import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { prisma } from '@/db/client.js';
import { subDays, format } from 'date-fns';
import type { WorkspaceContext } from '../chat-agent.js';

const metricsInputSchema = z.object({
  dateRange: z
    .enum(['7d', '30d', '90d', 'custom'])
    .describe('Time period for metrics. Use 7d, 30d, 90d, or custom with startDate/endDate'),
  startDate: z.string().optional().describe('Start date in YYYY-MM-DD format (for custom range)'),
  endDate: z.string().optional().describe('End date in YYYY-MM-DD format (for custom range)'),
  accountIds: z
    .array(z.string())
    .optional()
    .describe('Filter by specific ad account IDs. If empty, returns all accounts.'),
  groupBy: z
    .enum(['day', 'week', 'month', 'campaign', 'platform'])
    .optional()
    .describe('How to group the results'),
});

export const createMetricsTool = (context: WorkspaceContext) => {
  return new DynamicStructuredTool({
    name: 'get_performance_metrics',
    description:
      'Get advertising performance metrics including ROAS, CPA, CTR, spend, conversions, impressions, and clicks for the workspace. Use this to analyze campaign performance over time.',
    schema: metricsInputSchema,
    func: async (input) => {
      try {
        // Calculate date range
        let startDate: Date;
        let endDate = new Date();

        switch (input.dateRange) {
          case '7d':
            startDate = subDays(endDate, 7);
            break;
          case '30d':
            startDate = subDays(endDate, 30);
            break;
          case '90d':
            startDate = subDays(endDate, 90);
            break;
          case 'custom':
            startDate = input.startDate ? new Date(input.startDate) : subDays(endDate, 30);
            endDate = input.endDate ? new Date(input.endDate) : new Date();
            break;
          default:
            startDate = subDays(endDate, 30);
        }

        // Get ad accounts for the workspace
        const accounts = await prisma.adAccount.findMany({
          where: {
            workspaceId: context.workspaceId,
            ...(input.accountIds?.length ? { id: { in: input.accountIds } } : {}),
          },
          select: { id: true, platform: true, name: true },
        });

        if (accounts.length === 0) {
          return JSON.stringify({
            message: 'No ad accounts connected to this workspace.',
            suggestion: 'Connect an ad account to start tracking metrics.',
          });
        }

        const accountIds = accounts.map((a) => a.id);

        // Get aggregated metrics
        const metrics = await prisma.adMetric.aggregate({
          where: {
            adAccountId: { in: accountIds },
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: {
            impressions: true,
            clicks: true,
            spend: true,
            conversions: true,
            revenue: true,
          },
        });

        const totalSpend = metrics._sum.spend || 0;
        const totalRevenue = metrics._sum.revenue || 0;
        const totalClicks = metrics._sum.clicks || 0;
        const totalImpressions = metrics._sum.impressions || 0;
        const totalConversions = metrics._sum.conversions || 0;

        // Calculate derived metrics
        const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
        const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
        const cpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
        const cpa = totalConversions > 0 ? totalSpend / totalConversions : 0;

        // Get daily breakdown if requested
        let dailyBreakdown = null;
        if (input.groupBy === 'day') {
          const dailyMetrics = await prisma.adMetric.groupBy({
            by: ['date'],
            where: {
              adAccountId: { in: accountIds },
              date: { gte: startDate, lte: endDate },
            },
            _sum: {
              impressions: true,
              clicks: true,
              spend: true,
              conversions: true,
              revenue: true,
            },
            orderBy: { date: 'asc' },
          });

          dailyBreakdown = dailyMetrics.map((day) => ({
            date: format(day.date, 'yyyy-MM-dd'),
            impressions: day._sum.impressions || 0,
            clicks: day._sum.clicks || 0,
            spend: day._sum.spend || 0,
            conversions: day._sum.conversions || 0,
            revenue: day._sum.revenue || 0,
          }));
        }

        // Get platform breakdown if requested
        let platformBreakdown = null;
        if (input.groupBy === 'platform') {
          const byPlatform = await Promise.all(
            accounts.map(async (account) => {
              const platformMetrics = await prisma.adMetric.aggregate({
                where: {
                  adAccountId: account.id,
                  date: { gte: startDate, lte: endDate },
                },
                _sum: {
                  impressions: true,
                  clicks: true,
                  spend: true,
                  conversions: true,
                  revenue: true,
                },
              });

              return {
                platform: account.platform,
                accountName: account.name,
                impressions: platformMetrics._sum.impressions || 0,
                clicks: platformMetrics._sum.clicks || 0,
                spend: platformMetrics._sum.spend || 0,
                conversions: platformMetrics._sum.conversions || 0,
                revenue: platformMetrics._sum.revenue || 0,
              };
            })
          );

          platformBreakdown = byPlatform;
        }

        return JSON.stringify({
          period: {
            start: format(startDate, 'yyyy-MM-dd'),
            end: format(endDate, 'yyyy-MM-dd'),
          },
          summary: {
            totalSpend: Math.round(totalSpend * 100) / 100,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            totalImpressions,
            totalClicks,
            totalConversions,
            roas: Math.round(roas * 100) / 100,
            ctr: Math.round(ctr * 100) / 100,
            cpc: Math.round(cpc * 100) / 100,
            cpa: Math.round(cpa * 100) / 100,
          },
          accounts: accounts.length,
          ...(dailyBreakdown && { dailyBreakdown }),
          ...(platformBreakdown && { platformBreakdown }),
        });
      } catch (error) {
        console.error('Metrics tool error:', error);
        return JSON.stringify({
          error: 'Failed to fetch metrics',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },
  });
};
