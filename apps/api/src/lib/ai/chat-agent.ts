import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { env } from '@/config/env.js';
import { AI_MODELS } from '@/config/constants.js';
import { createMetricsTool } from './tools/metrics-tool.js';
import { createCampaignsTool } from './tools/campaigns-tool.js';
import { createRecommendationsTool } from './tools/recommendations-tool.js';
import { createAnalysisTool } from './tools/analysis-tool.js';

export interface WorkspaceContext {
  workspaceId: string;
  userId: string;
}

export interface ChatResponse {
  content: string;
  toolsUsed: string[];
}

const buildSystemPrompt = (context: WorkspaceContext): string => {
  return `You are Ryze AI, an advanced AI-powered advertising optimization assistant. You help users manage and optimize their advertising campaigns across multiple platforms including Google Ads, Meta, LinkedIn, Amazon, and more.

Your capabilities include:
1. **Performance Analysis**: Analyze campaign metrics (ROAS, CPA, CTR, conversions, spend) and identify trends
2. **Optimization Recommendations**: Provide actionable recommendations to improve campaign performance
3. **Budget Optimization**: Suggest budget reallocation strategies across campaigns and platforms
4. **Creative Insights**: Analyze ad creatives and suggest improvements
5. **Predictive Analytics**: Identify potential performance issues before they happen
6. **Competitor Intelligence**: Provide insights about competitor activities (when data is available)

When responding:
- Be concise but thorough
- Use data to support your recommendations
- Provide specific, actionable advice
- When you don't have enough data, acknowledge it and suggest what data would be helpful
- Format numbers and metrics clearly (use percentages, currency symbols appropriately)
- If asked about something outside your capabilities, be honest about limitations

You are currently assisting with workspace ID: ${context.workspaceId}

Remember: You have access to tools to fetch real data. Always use them when you need current metrics or campaign information rather than making assumptions.`;
};

export const createRyzeAgent = async (context: WorkspaceContext) => {
  const llm = new ChatGoogleGenerativeAI({
    modelName: AI_MODELS.GEMINI_PRO,
    temperature: 0.3,
    apiKey: env.GOOGLE_AI_API_KEY,
    maxOutputTokens: 2048,
  });

  const tools = [
    createMetricsTool(context),
    createCampaignsTool(context),
    createRecommendationsTool(context),
    createAnalysisTool(context),
  ];

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', buildSystemPrompt(context)],
    new MessagesPlaceholder('chat_history'),
    ['human', '{input}'],
    new MessagesPlaceholder('agent_scratchpad'),
  ]);

  const agent = await createToolCallingAgent({
    llm,
    tools,
    prompt,
  });

  return new AgentExecutor({
    agent,
    tools,
    verbose: env.NODE_ENV === 'development',
    maxIterations: 5,
    returnIntermediateSteps: true,
  });
};

export const runAIChat = async (
  message: string,
  context: WorkspaceContext,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<ChatResponse> => {
  try {
    const executor = await createRyzeAgent(context);

    // Convert chat history to LangChain message format
    const formattedHistory = chatHistory.map((msg) =>
      msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
    );

    const result = await executor.invoke({
      input: message,
      chat_history: formattedHistory,
    });

    const toolsUsed =
      result.intermediateSteps?.map(
        (step: { action: { tool: string } }) => step.action.tool
      ) || [];

    return {
      content: result.output,
      toolsUsed,
    };
  } catch (error) {
    console.error('AI Chat error:', error);
    throw error;
  }
};

// Streaming version for real-time responses
export const streamAIChat = async function* (
  message: string,
  context: WorkspaceContext,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): AsyncGenerator<string> {
  const llm = new ChatGoogleGenerativeAI({
    modelName: AI_MODELS.GEMINI_PRO,
    temperature: 0.3,
    apiKey: env.GOOGLE_AI_API_KEY,
    streaming: true,
  });

  const formattedHistory = chatHistory.map((msg) =>
    msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
  );

  const messages = [
    new SystemMessage(buildSystemPrompt(context)),
    ...formattedHistory,
    new HumanMessage(message),
  ];

  const stream = await llm.stream(messages);

  for await (const chunk of stream) {
    if (chunk.content) {
      yield chunk.content.toString();
    }
  }
};
