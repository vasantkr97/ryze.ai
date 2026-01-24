import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { prisma } from '@/db/client';
import { subDays } from 'date-fns';
import type { WorkspaceContext } from '../chat-agent';

const campaignsInputSchema = z.object({
  status: z
    .enum(['all', 'ACTIVE', 'PAUSED', 'ENDED'])
    .optional()
    .default('all')
    .describe('Filter by campaign status'),
  platform: z
    .enum(['all', 'GOOGLE_ADS', 'META', 'LINKEDIN', 'AMAZON', 'REDDIT', 'TWITTER', 'TIKTOK'])
    .optional()
    .default('all')
    .describe('Filter by ad platform'),
  sortBy: z
    .enum(['spend', 'conversions', 'roas', 'cpa', 'impressions'])
    .optional()
    .default('spend')
    .describe('Sort campaigns by this metric'),
  limit: z.number().optional().default(10).describe('Number of campaigns to return'),
});

export const createCampaignsTool = (context: WorkspaceContext) => {
  return new DynamicStructuredTool({
    name: 'get_campaigns',
    description:
      'Get campaign information and performance data. Use this to see which campaigns are running, their budgets, and recent performance metrics. Useful for identifying top/bottom performers.',
    schema: campaignsInputSchema,
    func: async (input) => {
      try {
        // Get accounts
        const accounts = await prisma.adAccount.findMany({
          where: {
            workspaceId: context.workspaceId,
            ...(input.platform !== 'all' ? { platform: input.platform as never } : {}),
          },
        });

        if (accounts.length === 0) {
          return JSON.stringify({
            message: 'No ad accounts found for this filter.',
            campaigns: [],
          });
        }

        // Get campaigns with their recent metrics
        const campaigns = await prisma.campaign.findMany({
          where: {
            adAccountId: { in: accounts.map((a: { id: string }) => a.id) },
            ...(input.status !== 'all' ? { status: input.status as never } : {}),
          },
          include: {
            adAccount: {
              select: { platform: true, name: true },
            },
          },
        });

        // Get 30-day metrics for each campaign
        const thirtyDaysAgo = subDays(new Date(), 30);
        type CampaignWithAccount = typeof campaigns[number];
        const campaignsWithMetrics = await Promise.all(
          campaigns.map(async (campaign: CampaignWithAccount) => {
            const metrics = await prisma.adMetric.aggregate({
              where: {
                campaignId: campaign.id,
                date: { gte: thirtyDaysAgo },
              },
              _sum: {
                impressions: true,
                clicks: true,
                spend: true,
                conversions: true,
                revenue: true,
              },
            });

            const spend = metrics._sum.spend || 0;
            const revenue = metrics._sum.revenue || 0;
            const conversions = metrics._sum.conversions || 0;

            return {
              id: campaign.id,
              name: campaign.name,
              status: campaign.status,
              platform: campaign.adAccount.platform,
              accountName: campaign.adAccount.name,
              budget: campaign.budget,
              budgetType: campaign.budgetType,
              objective: campaign.objective,
              last30Days: {
                impressions: metrics._sum.impressions || 0,
                clicks: metrics._sum.clicks || 0,
                spend: Math.round(spend * 100) / 100,
                conversions,
                revenue: Math.round(revenue * 100) / 100,
                roas: spend > 0 ? Math.round((revenue / spend) * 100) / 100 : 0,
                cpa: conversions > 0 ? Math.round((spend / conversions) * 100) / 100 : 0,
              },
            };
          })
        );

        // Sort campaigns
        const sortField = input.sortBy || 'spend';
        type CampaignWithMetrics = typeof campaignsWithMetrics[number];
        campaignsWithMetrics.sort((a: CampaignWithMetrics, b: CampaignWithMetrics) => {
          const aValue = a.last30Days[sortField as keyof typeof a.last30Days] || 0;
          const bValue = b.last30Days[sortField as keyof typeof b.last30Days] || 0;
          return (bValue as number) - (aValue as number);
        });

        // Limit results
        const limitedCampaigns = campaignsWithMetrics.slice(0, input.limit);

        // Calculate summary
        const summary = {
          totalCampaigns: campaigns.length,
          activeCampaigns: campaigns.filter((c: CampaignWithAccount) => c.status === 'ACTIVE').length,
          pausedCampaigns: campaigns.filter((c: CampaignWithAccount) => c.status === 'PAUSED').length,
          totalBudget: campaigns.reduce((sum: number, c: CampaignWithAccount) => sum + (c.budget || 0), 0),
        };

        return JSON.stringify({
          summary,
          campaigns: limitedCampaigns,
          note:
            limitedCampaigns.length < campaigns.length
              ? `Showing top ${limitedCampaigns.length} of ${campaigns.length} campaigns`
              : undefined,
        });
      } catch (error) {
        console.error('Campaigns tool error:', error);
        return JSON.stringify({
          error: 'Failed to fetch campaigns',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },
  });
};
