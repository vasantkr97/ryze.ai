import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { prisma } from '@/db/client.js';
import { subDays } from 'date-fns';
import type { WorkspaceContext } from '../chat-agent.js';

const analysisInputSchema = z.object({
  analysisType: z
    .enum(['top_performers', 'underperformers', 'trends', 'anomalies', 'budget_efficiency'])
    .describe('Type of analysis to perform'),
  metric: z
    .enum(['roas', 'cpa', 'ctr', 'conversions', 'spend'])
    .optional()
    .default('roas')
    .describe('Primary metric to analyze'),
  days: z.number().optional().default(30).describe('Number of days to analyze'),
});

export const createAnalysisTool = (context: WorkspaceContext) => {
  return new DynamicStructuredTool({
    name: 'analyze_performance',
    description:
      'Perform in-depth analysis of campaign performance. Can identify top performers, underperformers, trends over time, anomalies, and budget efficiency issues.',
    schema: analysisInputSchema,
    func: async (input) => {
      try {
        const startDate = subDays(new Date(), input.days);

        // Get all accounts and campaigns
        const accounts = await prisma.adAccount.findMany({
          where: { workspaceId: context.workspaceId },
          include: { campaigns: true },
        });

        if (accounts.length === 0) {
          return JSON.stringify({
            message: 'No ad accounts connected.',
            analysis: null,
          });
        }

        const allCampaigns = accounts.flatMap((a: { platform: string; name: string; campaigns: Array<{ id: string; name: string; status: string; budget: number | null }> }) =>
          a.campaigns.map((c: { id: string; name: string; status: string; budget: number | null }) => ({
            ...c,
            platform: a.platform,
            accountName: a.name,
          }))
        );

        // Get metrics for all campaigns
        const campaignMetrics = await Promise.all(
          allCampaigns.map(async (campaign: { id: string; name: string; status: string; budget: number | null; platform: string; accountName: string }) => {
            const metrics = await prisma.adMetric.aggregate({
              where: {
                campaignId: campaign.id,
                date: { gte: startDate },
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
            const clicks = metrics._sum.clicks || 0;
            const impressions = metrics._sum.impressions || 0;

            return {
              id: campaign.id,
              name: campaign.name,
              status: campaign.status,
              platform: campaign.platform,
              budget: campaign.budget,
              metrics: {
                spend,
                revenue,
                conversions,
                clicks,
                impressions,
                roas: spend > 0 ? revenue / spend : 0,
                cpa: conversions > 0 ? spend / conversions : 0,
                ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
              },
            };
          })
        );

        type CampaignMetric = typeof campaignMetrics[number];
        // Filter out campaigns with no data
        const activeCampaigns = campaignMetrics.filter((c: CampaignMetric) => c.metrics.spend > 0);

        let analysis: unknown;

        switch (input.analysisType) {
          case 'top_performers': {
            const sorted = [...activeCampaigns].sort(
              (a, b) =>
                (b.metrics[input.metric as keyof typeof b.metrics] as number) -
                (a.metrics[input.metric as keyof typeof a.metrics] as number)
            );
            analysis = {
              type: 'top_performers',
              metric: input.metric,
              campaigns: sorted.slice(0, 5).map((c) => ({
                name: c.name,
                platform: c.platform,
                [input.metric]: Math.round(c.metrics[input.metric as keyof typeof c.metrics] as number * 100) / 100,
                spend: Math.round(c.metrics.spend * 100) / 100,
                conversions: c.metrics.conversions,
              })),
              insight: `Top 5 campaigns by ${input.metric.toUpperCase()}`,
            };
            break;
          }

          case 'underperformers': {
            const avgRoas =
              activeCampaigns.reduce((sum: number, c: CampaignMetric) => sum + c.metrics.roas, 0) / activeCampaigns.length;
            const underperformers = activeCampaigns
              .filter((c: CampaignMetric) => c.metrics.roas < avgRoas * 0.5 && c.metrics.spend > 100)
              .sort((a: CampaignMetric, b: CampaignMetric) => a.metrics.roas - b.metrics.roas);

            analysis = {
              type: 'underperformers',
              averageRoas: Math.round(avgRoas * 100) / 100,
              campaigns: underperformers.slice(0, 5).map((c: CampaignMetric) => ({
                name: c.name,
                platform: c.platform,
                roas: Math.round(c.metrics.roas * 100) / 100,
                spend: Math.round(c.metrics.spend * 100) / 100,
                potentialSavings: Math.round(c.metrics.spend * 0.5 * 100) / 100,
              })),
              insight: `Found ${underperformers.length} campaigns with ROAS below 50% of average`,
              totalWastedSpend: Math.round(
                underperformers.reduce((sum: number, c: CampaignMetric) => sum + c.metrics.spend * 0.5, 0) * 100
              ) / 100,
            };
            break;
          }

          case 'budget_efficiency': {
            const withEfficiency = activeCampaigns.map((c: CampaignMetric) => ({
              ...c,
              efficiency: c.budget ? c.metrics.spend / c.budget : 1,
              roasToBudgetRatio: c.budget ? c.metrics.roas / (c.budget / 1000) : 0,
            }));

            type EfficiencyMetric = typeof withEfficiency[number];
            const underutilized = withEfficiency.filter((c: EfficiencyMetric) => c.efficiency < 0.7);
            const overutilized = withEfficiency.filter((c: EfficiencyMetric) => c.efficiency > 1.2);

            analysis = {
              type: 'budget_efficiency',
              underutilizedCampaigns: underutilized.slice(0, 3).map((c: EfficiencyMetric) => ({
                name: c.name,
                budget: c.budget,
                spend: Math.round(c.metrics.spend * 100) / 100,
                utilization: Math.round(c.efficiency * 100),
              })),
              overutilizedCampaigns: overutilized.slice(0, 3).map((c: EfficiencyMetric) => ({
                name: c.name,
                budget: c.budget,
                spend: Math.round(c.metrics.spend * 100) / 100,
                utilization: Math.round(c.efficiency * 100),
              })),
              insight: `${underutilized.length} campaigns underutilizing budget, ${overutilized.length} exceeding budget`,
            };
            break;
          }

          case 'trends': {
            // Get daily aggregates
            const dailyMetrics = await prisma.adMetric.groupBy({
              by: ['date'],
              where: {
                adAccountId: { in: accounts.map((a: { id: string }) => a.id) },
                date: { gte: startDate },
              },
              _sum: {
                spend: true,
                revenue: true,
                conversions: true,
              },
              orderBy: { date: 'asc' },
            });

            const firstHalf = dailyMetrics.slice(0, Math.floor(dailyMetrics.length / 2));
            const secondHalf = dailyMetrics.slice(Math.floor(dailyMetrics.length / 2));

            type DailyMetric = typeof dailyMetrics[number];
            const firstHalfSpend = firstHalf.reduce((sum: number, d: DailyMetric) => sum + (d._sum.spend || 0), 0);
            const secondHalfSpend = secondHalf.reduce((sum: number, d: DailyMetric) => sum + (d._sum.spend || 0), 0);
            const firstHalfRevenue = firstHalf.reduce((sum: number, d: DailyMetric) => sum + (d._sum.revenue || 0), 0);
            const secondHalfRevenue = secondHalf.reduce((sum: number, d: DailyMetric) => sum + (d._sum.revenue || 0), 0);

            const spendTrend = firstHalfSpend > 0 ? ((secondHalfSpend - firstHalfSpend) / firstHalfSpend) * 100 : 0;
            const revenueTrend = firstHalfRevenue > 0 ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100 : 0;

            analysis = {
              type: 'trends',
              period: `${input.days} days`,
              spendTrend: {
                change: Math.round(spendTrend * 10) / 10,
                direction: spendTrend > 0 ? 'increasing' : 'decreasing',
              },
              revenueTrend: {
                change: Math.round(revenueTrend * 10) / 10,
                direction: revenueTrend > 0 ? 'increasing' : 'decreasing',
              },
              insight:
                revenueTrend > spendTrend
                  ? 'Revenue growing faster than spend - efficiency improving'
                  : 'Spend growing faster than revenue - review campaign efficiency',
            };
            break;
          }

          case 'anomalies': {
            // Simple anomaly detection: campaigns with metrics > 2 std deviations from mean
            const roasValues = activeCampaigns.map((c: CampaignMetric) => c.metrics.roas);
            const mean = roasValues.reduce((sum: number, v: number) => sum + v, 0) / roasValues.length;
            const stdDev = Math.sqrt(
              roasValues.reduce((sum: number, v: number) => sum + Math.pow(v - mean, 2), 0) / roasValues.length
            );

            const anomalies = activeCampaigns.filter(
              (c: CampaignMetric) => Math.abs(c.metrics.roas - mean) > 2 * stdDev
            );

            analysis = {
              type: 'anomalies',
              metric: 'roas',
              mean: Math.round(mean * 100) / 100,
              stdDev: Math.round(stdDev * 100) / 100,
              anomalies: anomalies.map((c: CampaignMetric) => ({
                name: c.name,
                platform: c.platform,
                roas: Math.round(c.metrics.roas * 100) / 100,
                deviation: Math.round(((c.metrics.roas - mean) / stdDev) * 10) / 10,
                type: c.metrics.roas > mean ? 'outperformer' : 'underperformer',
              })),
              insight: `Found ${anomalies.length} campaigns with unusual ROAS performance`,
            };
            break;
          }
        }

        return JSON.stringify({
          analysisType: input.analysisType,
          period: `Last ${input.days} days`,
          totalCampaignsAnalyzed: activeCampaigns.length,
          analysis,
        });
      } catch (error) {
        console.error('Analysis tool error:', error);
        return JSON.stringify({
          error: 'Failed to perform analysis',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },
  });
};
