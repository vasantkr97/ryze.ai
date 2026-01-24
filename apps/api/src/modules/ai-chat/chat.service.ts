import { prisma } from '@/db/client.js';
import { runAIChat, streamAIChat, type WorkspaceContext, type ChatResponse } from '@/lib/ai/chat-agent.js';
import { AppError } from '@/middleware/error-handler.js';

export interface ChatSessionWithMessages {
  id: string;
  title: string | null;
  createdAt: Date;
  messages: Array<{
    id: string;
    role: 'USER' | 'ASSISTANT' | 'SYSTEM';
    content: string;
    createdAt: Date;
  }>;
}

export const createChatSession = async (
  userId: string,
  workspaceId: string,
  title?: string
) => {
  return prisma.chatSession.create({
    data: {
      userId,
      workspaceId,
      title: title || 'New Chat',
    },
  });
};

export const getChatSessions = async (workspaceId: string, userId: string) => {
  return prisma.chatSession.findMany({
    where: {
      workspaceId,
      userId,
    },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { messages: true },
      },
    },
  });
};

export const getChatSession = async (
  sessionId: string,
  userId: string
): Promise<ChatSessionWithMessages> => {
  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });

  if (!session) {
    throw new AppError('NOT_FOUND', 'Chat session not found', 404);
  }

  if (session.userId !== userId) {
    throw new AppError('FORBIDDEN', 'You do not have access to this chat session', 403);
  }

  return session;
};

export const processUserMessage = async (
  sessionId: string,
  message: string,
  userId: string,
  workspaceId: string
): Promise<ChatResponse & { sessionId: string }> => {
  // Verify session exists and belongs to user
  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 20, // Last 20 messages for context
        select: {
          role: true,
          content: true,
        },
      },
    },
  });

  if (!session) {
    throw new AppError('NOT_FOUND', 'Chat session not found', 404);
  }

  if (session.userId !== userId) {
    throw new AppError('FORBIDDEN', 'You do not have access to this chat session', 403);
  }

  // Save user message
  await prisma.chatMessage.create({
    data: {
      sessionId,
      role: 'USER',
      content: message,
    },
  });

  // Prepare chat history
  const chatHistory = session.messages.map((msg: { role: string; content: string }) => ({
    role: (msg.role === 'USER' ? 'user' : 'assistant') as 'user' | 'assistant',
    content: msg.content,
  }));

  // Get AI response
  const context: WorkspaceContext = { workspaceId, userId };
  const response = await runAIChat(message, context, chatHistory);

  // Save AI response
  await prisma.chatMessage.create({
    data: {
      sessionId,
      role: 'ASSISTANT',
      content: response.content,
      metadata: { toolsUsed: response.toolsUsed },
    },
  });

  // Update session title if it's the first message
  if (session.messages.length === 0) {
    const title = message.length > 50 ? message.substring(0, 47) + '...' : message;
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { title },
    });
  }

  // Update session timestamp
  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { updatedAt: new Date() },
  });

  return { ...response, sessionId };
};

export const sendMessageWithNewSession = async (
  message: string,
  userId: string,
  workspaceId: string
): Promise<ChatResponse & { sessionId: string }> => {
  // Create new session
  const title = message.length > 50 ? message.substring(0, 47) + '...' : message;
  const session = await createChatSession(userId, workspaceId, title);

  // Process message
  return processUserMessage(session.id, message, userId, workspaceId);
};

export const deleteChatSession = async (sessionId: string, userId: string) => {
  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new AppError('NOT_FOUND', 'Chat session not found', 404);
  }

  if (session.userId !== userId) {
    throw new AppError('FORBIDDEN', 'You do not have access to this chat session', 403);
  }

  await prisma.chatSession.delete({
    where: { id: sessionId },
  });
};

// Generator for streaming responses
export async function* streamUserMessage(
  sessionId: string,
  message: string,
  userId: string,
  workspaceId: string
): AsyncGenerator<string> {
  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 20,
        select: { role: true, content: true },
      },
    },
  });

  if (!session || session.userId !== userId) {
    throw new AppError('FORBIDDEN', 'Access denied', 403);
  }

  // Save user message
  await prisma.chatMessage.create({
    data: { sessionId, role: 'USER', content: message },
  });

  const chatHistory = session.messages.map((msg: { role: string; content: string }) => ({
    role: (msg.role === 'USER' ? 'user' : 'assistant') as 'user' | 'assistant',
    content: msg.content,
  }));

  const context: WorkspaceContext = { workspaceId, userId };
  let fullResponse = '';

  for await (const chunk of streamAIChat(message, context, chatHistory)) {
    fullResponse += chunk;
    yield chunk;
  }

  // Save complete AI response
  await prisma.chatMessage.create({
    data: { sessionId, role: 'ASSISTANT', content: fullResponse },
  });

  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { updatedAt: new Date() },
  });
}
