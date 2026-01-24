import { PrismaClient, CampaignStatus, RecommendationType, Priority } from '@prisma/client';
import { subDays } from 'date-fns';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
// Helper to generate random number in range
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => Math.random() * (max - min) + min;
// Campaign names by platform
const campaignNames = {
    GOOGLE_ADS: [
        'Brand Search - US',
        'Non-Brand Search - Competitors',
        'Performance Max - Ecommerce',
        'Display Remarketing',
        'YouTube In-Stream',
    ],
    META: [
        'Prospecting - LAL Purchasers',
        'Retargeting - Cart Abandoners',
        'Dynamic Product Ads',
        'Video Views - Brand',
        'Lead Gen - Webinar',
    ],
    LINKEDIN: [
        'B2B Lead Generation',
        'Decision Makers - Enterprise',
        'Content Promotion',
    ],
    TIKTOK: [
        'Spark Ads - UGC',
        'In-Feed Brand Awareness',
        'Conversion Campaign',
    ],
};
// Recommendation templates
const recommendationTemplates = [
    {
        type: RecommendationType.PAUSE_KEYWORD,
        priority: Priority.HIGH,
        title: 'Pause Underperforming Keywords',
        description: 'These 5 keywords have spent $2,340 with 0 conversions in the last 30 days. Pausing them could save significant budget.',
        impact: 'Save $2,340/month',
        impactValue: 2340,
    },
    {
        type: RecommendationType.BUDGET_REALLOCATION,
        priority: Priority.CRITICAL,
        title: 'Reallocate Budget to Top Performer',
        description: 'Campaign "Brand Search - US" has a ROAS of 8.5x but is limited by budget. Shifting $1,000 from underperforming campaigns could yield an additional $8,500 in revenue.',
        impact: 'Potential +$8,500 revenue',
        impactValue: 8500,
    },
    {
        type: RecommendationType.ADJUST_BID,
        priority: Priority.MEDIUM,
        title: 'Increase Bids for High-Value Audiences',
        description: 'Your "Previous Purchasers" audience has a 3x higher conversion rate. Increasing bids by 20% could capture more of this valuable traffic.',
        impact: '+15% conversions',
        impactValue: 450,
    },
    {
        type: RecommendationType.ADD_NEGATIVE_KEYWORD,
        priority: Priority.HIGH,
        title: 'Add Negative Keywords',
        description: 'Search term report shows "free" and "jobs" generating clicks with 0% conversion rate. Adding these as negatives will reduce wasted spend.',
        impact: 'Save $890/month',
        impactValue: 890,
    },
    {
        type: RecommendationType.CREATIVE_REFRESH,
        priority: Priority.MEDIUM,
        title: 'Refresh Ad Creatives',
        description: 'Your top ad has been running for 45 days and CTR has dropped 23%. Fresh creatives could restore performance.',
        impact: '+20% CTR',
        impactValue: 300,
    },
    {
        type: RecommendationType.FIX_TRACKING,
        priority: Priority.CRITICAL,
        title: 'Fix Conversion Tracking Issue',
        description: 'Meta pixel events dropped 80% yesterday. This indicates a tracking issue that needs immediate attention.',
        impact: 'Critical fix',
        impactValue: 0,
    },
];
async function seed() {
    console.log('🌱 Starting database seed...');
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.touchpoint.deleteMany();
    await prisma.visitor.deleteMany();
    await prisma.competitorSnapshot.deleteMany();
    await prisma.competitorInsight.deleteMany();
    await prisma.competitorAd.deleteMany();
    await prisma.competitor.deleteMany();
    await prisma.alert.deleteMany();
    await prisma.prediction.deleteMany();
    await prisma.automationExecution.deleteMany();
    await prisma.automationRule.deleteMany();
    await prisma.generatedCreative.deleteMany();
    await prisma.report.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.chatSession.deleteMany();
    await prisma.creativeAnalysis.deleteMany();
    await prisma.recommendation.deleteMany();
    await prisma.adMetric.deleteMany();
    await prisma.ad.deleteMany();
    await prisma.adGroup.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.adAccount.deleteMany();
    await prisma.workspaceMember.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    // Create demo user
    console.log('Creating demo user...');
    const hashedPassword = await bcrypt.hash('Demo1234!', 12);
    const user = await prisma.user.create({
        data: {
            email: 'demo@ryze.ai',
            passwordHash: hashedPassword,
            name: 'Demo User',
            emailVerified: true,
        },
    });
    // Create workspace
    console.log('Creating workspace...');
    const workspace = await prisma.workspace.create({
        data: {
            name: 'Demo Company',
            slug: 'demo-company',
            plan: 'PROFESSIONAL',
            members: {
                create: {
                    userId: user.id,
                    role: 'OWNER',
                },
            },
        },
    });
    // Create ad accounts
    console.log('Creating ad accounts...');
    const platforms = ['GOOGLE_ADS', 'META', 'LINKEDIN', 'TIKTOK'];
    const adAccounts = await Promise.all(platforms.map((platform) => prisma.adAccount.create({
        data: {
            workspaceId: workspace.id,
            platform,
            name: `${platform.replace('_', ' ')} - Main Account`,
            externalId: `demo_${platform.toLowerCase()}_${random(100000, 999999)}`,
            accessToken: 'demo_token',
            status: 'ACTIVE',
            lastSyncAt: new Date(),
        },
    })));
    // Create campaigns and metrics
    console.log('Creating campaigns and metrics...');
    for (const account of adAccounts) {
        const names = campaignNames[account.platform] || ['Default Campaign'];
        for (const name of names) {
            const budget = random(50, 500) * 10;
            const campaign = await prisma.campaign.create({
                data: {
                    adAccountId: account.id,
                    externalId: `camp_${random(100000, 999999)}`,
                    name,
                    status: Math.random() > 0.2 ? CampaignStatus.ACTIVE : CampaignStatus.PAUSED,
                    objective: 'CONVERSIONS',
                    budget,
                    budgetType: 'DAILY',
                    startDate: subDays(new Date(), random(30, 180)),
                },
            });
            // Create ad group
            const adGroup = await prisma.adGroup.create({
                data: {
                    campaignId: campaign.id,
                    externalId: `adg_${random(100000, 999999)}`,
                    name: `${name} - Ad Group 1`,
                    status: 'ACTIVE',
                },
            });
            // Create ads
            const adTypes = ['IMAGE', 'VIDEO', 'RESPONSIVE'];
            for (let i = 0; i < random(2, 4); i++) {
                await prisma.ad.create({
                    data: {
                        adGroupId: adGroup.id,
                        externalId: `ad_${random(100000, 999999)}`,
                        name: `Ad Variation ${i + 1}`,
                        type: adTypes[random(0, adTypes.length - 1)],
                        status: 'ACTIVE',
                        headline: 'Transform Your Business Today',
                        description: 'Get started with our award-winning platform.',
                        ctaText: 'Learn More',
                        landingUrl: 'https://example.com/landing',
                    },
                });
            }
            // Create daily metrics for last 90 days
            for (let day = 0; day < 90; day++) {
                const date = subDays(new Date(), day);
                const impressions = random(1000, 50000);
                const ctr = randomFloat(0.5, 5);
                const clicks = Math.floor(impressions * (ctr / 100));
                const spend = randomFloat(budget * 0.7, budget * 1.1);
                const conversionRate = randomFloat(1, 8);
                const conversions = Math.floor(clicks * (conversionRate / 100));
                const avgOrderValue = randomFloat(50, 200);
                const revenue = conversions * avgOrderValue;
                await prisma.adMetric.create({
                    data: {
                        date,
                        adAccountId: account.id,
                        campaignId: campaign.id,
                        adGroupId: adGroup.id,
                        impressions,
                        clicks,
                        spend,
                        conversions,
                        revenue,
                        ctr,
                        cpc: clicks > 0 ? spend / clicks : 0,
                        cpa: conversions > 0 ? spend / conversions : 0,
                        roas: spend > 0 ? revenue / spend : 0,
                    },
                });
            }
        }
    }
    // Create recommendations
    console.log('Creating recommendations...');
    for (const template of recommendationTemplates) {
        const account = adAccounts[random(0, adAccounts.length - 1)];
        await prisma.recommendation.create({
            data: {
                adAccountId: account.id,
                type: template.type,
                priority: template.priority,
                title: template.title,
                description: template.description,
                impact: template.impact,
                impactValue: template.impactValue,
                status: 'PENDING',
                expiresAt: subDays(new Date(), -7),
            },
        });
    }
    // Create sample chat session
    console.log('Creating sample chat session...');
    const chatSession = await prisma.chatSession.create({
        data: {
            userId: user.id,
            workspaceId: workspace.id,
            title: 'Performance Analysis',
        },
    });
    await prisma.chatMessage.createMany({
        data: [
            {
                sessionId: chatSession.id,
                role: 'USER',
                content: 'How is my ROAS performing this month?',
            },
            {
                sessionId: chatSession.id,
                role: 'ASSISTANT',
                content: `Based on your data, here's your ROAS performance for this month:

**Overall ROAS: 4.2x** (up 12% from last month)

**By Platform:**
- Google Ads: 5.1x (best performer)
- Meta: 3.8x (stable)
- LinkedIn: 2.4x (needs attention)
- TikTok: 4.0x (improving)

**Key Insights:**
1. Your Brand Search campaigns are driving the highest ROAS at 8.5x
2. Retargeting campaigns have improved 23% after the recent audience updates
3. LinkedIn CPA is higher than target - consider reviewing audience targeting

Would you like me to generate specific recommendations to improve LinkedIn performance?`,
            },
        ],
    });
    // Create automation rules
    console.log('Creating automation rules...');
    await prisma.automationRule.createMany({
        data: [
            {
                workspaceId: workspace.id,
                name: 'Pause Low ROAS Campaigns',
                description: 'Automatically pause campaigns with ROAS below 1.5x for 7 consecutive days',
                triggerType: 'ROAS_BELOW_THRESHOLD',
                triggerConfig: { threshold: 1.5, daysConsecutive: 7 },
                actionType: 'PAUSE_CAMPAIGN',
                actionConfig: { notify: true },
                guardrails: { maxDailyActions: 3, excludedCampaigns: [], cooldownHours: 24 },
                executionMode: 'APPROVAL',
                status: 'ACTIVE',
            },
            {
                workspaceId: workspace.id,
                name: 'Budget Alert',
                description: 'Alert when daily spend exceeds 120% of budget',
                triggerType: 'SPEND_EXCEEDS_BUDGET',
                triggerConfig: { threshold: 1.2 },
                actionType: 'ADJUST_BUDGET',
                actionConfig: { adjustment: 'pause_until_review' },
                guardrails: { maxDailyActions: 10 },
                executionMode: 'NOTIFY',
                status: 'ACTIVE',
            },
        ],
    });
    // Create competitors
    console.log('Creating competitors...');
    const competitors = [
        { name: 'Competitor A', domain: 'competitor-a.com' },
        { name: 'Competitor B', domain: 'competitor-b.com' },
        { name: 'Competitor C', domain: 'competitor-c.com' },
    ];
    for (const comp of competitors) {
        await prisma.competitor.create({
            data: {
                workspaceId: workspace.id,
                name: comp.name,
                domain: comp.domain,
                trackedKeywords: ['marketing automation', 'ad optimization', 'ai advertising'],
                platforms: ['GOOGLE_ADS', 'META'],
                isActive: true,
            },
        });
    }
    // Create predictions
    console.log('Creating predictions...');
    const googleAccount = adAccounts.find((a) => a.platform === 'GOOGLE_ADS');
    await prisma.prediction.create({
        data: {
            workspaceId: workspace.id,
            entityType: 'campaign',
            entityId: 'sample',
            metric: 'roas',
            currentValue: 4.2,
            predictedValue: 3.8,
            predictedChange: -9.5,
            confidence: 0.82,
            timeframe: '72h',
            factors: [
                { factor: 'Competitor activity increase', impact: 'negative', weight: 0.4 },
                { factor: 'Seasonal trend', impact: 'negative', weight: 0.3 },
                { factor: 'Ad fatigue detected', impact: 'negative', weight: 0.3 },
            ],
            status: 'ACTIVE',
            expiresAt: subDays(new Date(), -3),
        },
    });
    // Create alerts
    console.log('Creating alerts...');
    await prisma.alert.createMany({
        data: [
            {
                workspaceId: workspace.id,
                type: 'PREDICTION_WARNING',
                severity: 'WARNING',
                title: 'ROAS Decline Predicted',
                message: 'Our AI predicts a 9.5% drop in ROAS over the next 72 hours based on competitor activity and ad fatigue.',
                isRead: false,
            },
            {
                workspaceId: workspace.id,
                type: 'ANOMALY_DETECTED',
                severity: 'CRITICAL',
                title: 'Conversion Tracking Anomaly',
                message: 'Meta pixel events dropped 80% in the last 24 hours. This may indicate a tracking issue.',
                isRead: false,
            },
            {
                workspaceId: workspace.id,
                type: 'COMPETITOR_ALERT',
                severity: 'INFO',
                title: 'Competitor A Launched New Campaign',
                message: 'Detected 12 new ads from Competitor A targeting your primary keywords.',
                isRead: true,
            },
        ],
    });
    console.log('');
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📧 Demo credentials:');
    console.log('   Email: demo@ryze.ai');
    console.log('   Password: Demo1234!');
    console.log('');
}
seed()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
