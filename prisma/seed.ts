import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const plans = [
  {
    name: 'Starter',
    slug: 'starter',
    description: 'Perfect for small teams getting started',
    monthlyPrice: 29,
    yearlyPrice: 290,
    maxContacts: 500,
    maxProperties: 50,
    maxTeamMembers: 2,
    maxCampaignsPerMonth: 3,
    maxEmailsPerMonth: 1000,
    hasApiAccess: false,
    hasAdvancedAnalytics: false,
    hasPrioritySupport: false,
    hasCustomIntegrations: false,
    hasWhiteLabeling: false,
    displayOrder: 1,
  },
  {
    name: 'Professional',
    slug: 'professional',
    description: 'For growing businesses with advanced needs',
    monthlyPrice: 79,
    yearlyPrice: 790,
    maxContacts: 5000,
    maxProperties: 500,
    maxTeamMembers: 5,
    maxCampaignsPerMonth: 20,
    maxEmailsPerMonth: 10000,
    hasApiAccess: true,
    hasAdvancedAnalytics: true,
    hasPrioritySupport: false,
    hasCustomIntegrations: false,
    hasWhiteLabeling: false,
    displayOrder: 2,
  },
  {
    name: 'Business',
    slug: 'business',
    description: 'For established businesses scaling up',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    maxContacts: 25000,
    maxProperties: 999999,
    maxTeamMembers: 15,
    maxCampaignsPerMonth: 999999,
    maxEmailsPerMonth: 50000,
    hasApiAccess: true,
    hasAdvancedAnalytics: true,
    hasPrioritySupport: true,
    hasCustomIntegrations: true,
    hasWhiteLabeling: false,
    displayOrder: 3,
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'Custom solutions for large organizations',
    monthlyPrice: 499,
    yearlyPrice: 4990,
    maxContacts: 999999,
    maxProperties: 999999,
    maxTeamMembers: 999999,
    maxCampaignsPerMonth: 999999,
    maxEmailsPerMonth: 999999,
    hasApiAccess: true,
    hasAdvancedAnalytics: true,
    hasPrioritySupport: true,
    hasCustomIntegrations: true,
    hasWhiteLabeling: true,
    displayOrder: 4,
  },
];

async function main() {
  console.log('Seeding plans...');

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
    console.log(`  Created/updated plan: ${plan.name}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
