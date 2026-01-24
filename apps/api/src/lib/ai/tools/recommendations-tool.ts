import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { prisma } from '@/db/client.js';
import type { WorkspaceContext } from '../chat-agent.js';

const recommendationsInputSchema = z.object({
  status: z
    .enum(['all', 'PENDING', 'APPLIED', 'DISMISSED'])
    .optional()
    .default('PENDING')
    .describe('Filter by recommendation status'),
  priority: z
    .enum(['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
    .optional()
    .default('all')
    .describe('Filter by priority level'),
  type: z
    .enum([
      'all',
      'PAUSE_KEYWORD',
      'ADD_NEGATIVE_KEYWORD',
      'ADJUST_BID',
      'BUDGET_REALLOCATION',
      'SPLIT_CAMPAIGN',
      'FIX_TRACKING',
      'CREATIVE_REFRESH',
      'AUDIENCE_EXPANSION',
    ])
    .optional()
    .default('all')
    .describe('Filter by recommendation type'),
  limit: z.number().optional().default(10).describe('Number of recommendations to return'),
});

export const createRecommendationsTool = (context: WorkspaceContext) => {
  return new DynamicStructuredTool({
    name: 'get_recommendations',
    description:
      'Get AI-generated optimization recommendations for ad campaigns. These include suggestions for pausing keywords, adjusting bids, reallocating budget, and more. Each recommendation includes an estimated impact.',
    schema: recommendationsInputSchema,
    func: async (input) => {
      try {
        // Get accounts for workspace
        const accounts = await prisma.adAccount.findMany({
          where: { workspaceId: context.workspaceId },
          select: { id: true },
        });

        if (accounts.length === 0) {
          return JSON.stringify({
            message: 'No ad accounts connected. Connect accounts to get recommendations.',
            recommendations: [],
          });
        }

        const recommendations = await prisma.recommendation.findMany({
          where: {
            adAccountId: { in: accounts.map((a: { id: string }) => a.id) },
            ...(input.status !== 'all' ? { status: input.status as never } : {}),
            ...(input.priority !== 'all' ? { priority: input.priority as never } : {}),
            ...(input.type !== 'all' ? { type: input.type as never } : {}),
          },
          include: {
            adAccount: {
              select: { name: true, platform: true },
            },
          },
          orderBy: [
            { priority: 'asc' }, // CRITICAL first
            { createdAt: 'desc' },
          ],
          take: input.limit,
        });

        // Count by type and priority
        const allRecs = await prisma.recommendation.groupBy({
          by: ['priority', 'status'],
          where: {
            adAccountId: { in: accounts.map((a: { id: string }) => a.id) },
          },
          _count: true,
        });

        type RecGroup = typeof allRecs[number];
        const summary = {
          pending: allRecs.filter((r: RecGroup) => r.status === 'PENDING').reduce((sum: number, r: RecGroup) => sum + r._count, 0),
          critical: allRecs.filter((r: RecGroup) => r.priority === 'CRITICAL' && r.status === 'PENDING').reduce((sum: number, r: RecGroup) => sum + r._count, 0),
          high: allRecs.filter((r: RecGroup) => r.priority === 'HIGH' && r.status === 'PENDING').reduce((sum: number, r: RecGroup) => sum + r._count, 0),
          applied: allRecs.filter((r: RecGroup) => r.status === 'APPLIED').reduce((sum: number, r: RecGroup) => sum + r._count, 0),
        };

        type Recommendation = typeof recommendations[number];
        const formattedRecs = recommendations.map((rec: Recommendation) => ({
          id: rec.id,
          type: rec.type,
          priority: rec.priority,
          status: rec.status,
          title: rec.title,
          description: rec.description,
          impact: rec.impact,
          impactValue: rec.impactValue,
          account: {
            name: rec.adAccount.name,
            platform: rec.adAccount.platform,
          },
          createdAt: rec.createdAt.toISOString(),
        }));

        return JSON.stringify({
          summary,
          recommendations: formattedRecs,
          totalEstimatedImpact:
            recommendations.reduce((sum: number, r: Recommendation) => sum + (r.impactValue || 0), 0).toFixed(2),
        });
      } catch (error) {
        console.error('Recommendations tool error:', error);
        return JSON.stringify({
          error: 'Failed to fetch recommendations',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },
  });
};
