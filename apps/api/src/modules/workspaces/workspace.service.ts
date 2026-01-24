import { nanoid } from 'nanoid';
import { prisma } from '@/db/client';
import { AppError } from '@/middleware/error-handler';
import type { CreateWorkspaceInput, UpdateWorkspaceInput, InviteMemberInput } from './workspace.schema';

export const createWorkspace = async (userId: string, input: CreateWorkspaceInput) => {
  const slug = `${input.name.toLowerCase().replace(/\s+/g, '-')}-${nanoid(6)}`;

  return prisma.workspace.create({
    data: {
      name: input.name,
      slug,
      members: {
        create: {
          userId,
          role: 'OWNER',
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
    },
  });
};

export const getWorkspacesByUser = async (userId: string) => {
  return prisma.workspace.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
      _count: {
        select: { adAccounts: true },
      },
    },
  });
};

export const getWorkspaceById = async (workspaceId: string, userId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
      adAccounts: {
        select: {
          id: true,
          platform: true,
          name: true,
          status: true,
        },
      },
      _count: {
        select: {
          adAccounts: true,
          chatSessions: true,
          reports: true,
        },
      },
    },
  });

  if (!workspace) {
    throw new AppError('NOT_FOUND', 'Workspace not found', 404);
  }

  // Check if user is a member
  const isMember = workspace.members.some((m: { userId: string }) => m.userId === userId);
  if (!isMember) {
    throw new AppError('FORBIDDEN', 'You do not have access to this workspace', 403);
  }

  return workspace;
};

export const updateWorkspace = async (
  workspaceId: string,
  userId: string,
  input: UpdateWorkspaceInput
) => {
  // Verify user has permission
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId },
    },
  });

  if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
    throw new AppError('FORBIDDEN', 'Insufficient permissions', 403);
  }

  return prisma.workspace.update({
    where: { id: workspaceId },
    data: input,
  });
};

export const deleteWorkspace = async (workspaceId: string, userId: string) => {
  // Verify user is owner
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId },
    },
  });

  if (!membership || membership.role !== 'OWNER') {
    throw new AppError('FORBIDDEN', 'Only the owner can delete a workspace', 403);
  }

  await prisma.workspace.delete({ where: { id: workspaceId } });
};

export const inviteMember = async (
  workspaceId: string,
  inviterId: string,
  input: InviteMemberInput
) => {
  // Verify inviter has permission
  const inviterMembership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId: inviterId },
    },
  });

  if (!inviterMembership || !['OWNER', 'ADMIN'].includes(inviterMembership.role)) {
    throw new AppError('FORBIDDEN', 'Insufficient permissions to invite members', 403);
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AppError('NOT_FOUND', 'User with this email not found', 404);
  }

  // Check if already a member
  const existingMembership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId: user.id },
    },
  });

  if (existingMembership) {
    throw new AppError('CONFLICT', 'User is already a member of this workspace', 409);
  }

  return prisma.workspaceMember.create({
    data: {
      workspaceId,
      userId: user.id,
      role: input.role,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  });
};

export const removeMember = async (
  workspaceId: string,
  removerId: string,
  memberUserId: string
) => {
  // Verify remover has permission
  const removerMembership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId: removerId },
    },
  });

  if (!removerMembership || !['OWNER', 'ADMIN'].includes(removerMembership.role)) {
    throw new AppError('FORBIDDEN', 'Insufficient permissions to remove members', 403);
  }

  // Can't remove owner
  const targetMembership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId: memberUserId },
    },
  });

  if (!targetMembership) {
    throw new AppError('NOT_FOUND', 'Member not found', 404);
  }

  if (targetMembership.role === 'OWNER') {
    throw new AppError('FORBIDDEN', 'Cannot remove the workspace owner', 403);
  }

  await prisma.workspaceMember.delete({
    where: {
      workspaceId_userId: { workspaceId, userId: memberUserId },
    },
  });
};
