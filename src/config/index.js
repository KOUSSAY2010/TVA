import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  telegram: {
    botToken: process.env.BOT_TOKEN || '',
    botUsername: process.env.BOT_USERNAME || 'TVAMining_bot',
    adminId: process.env.ADMIN_TELEGRAM_ID || '',
    webAppUrl: process.env.WEBAPP_URL || 'https://tva-mining.local',
  },

  db: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tva_mining_db',
  },

  mining: {
    // Base daily rate before point bonuses or rigs
    baseDailyRateTon: parseFloat(process.env.BASE_MINING_RATE_TON_PER_DAY || '0.001'),
    // Each point adds +0.0001 TON/day
    rateBoostPerPoint: parseFloat(process.env.RATE_BOOST_PER_POINT || '0.0001'),
    // 1 ad watched = 1 point
    pointsPerAd: 1,
  },

  ads: {
    blockId: process.env.ADSGRAM_BLOCK_ID || '49428',
    maxDailyAds: parseInt(process.env.MAX_DAILY_ADS || '30', 10),
    minDurationSeconds: parseInt(process.env.ADS_MIN_DURATION_SECONDS || '15', 10),
    adsForActiveReferral: parseInt(process.env.ACTIVE_REFERRAL_REQUIRED_ADS || '10', 10),
    referralRewardPoints: parseInt(process.env.REFERRAL_REWARD_POINTS || '10', 10),
  },

  withdrawals: {
    minAmountTon: parseFloat(process.env.MIN_WITHDRAWAL_TON || '0.1'),
    feePercent: parseFloat(process.env.WITHDRAWAL_FEE_PERCENT || '5'),
    adsRequiredForWithdrawal: parseInt(process.env.ADS_REQUIRED_FOR_WITHDRAWAL || '15', 10),
    // Configurable toggle: User must own at least 1 active rig to withdraw (disabled by default)
    requireRigForWithdrawal: process.env.REQUIRE_RIG_FOR_WITHDRAWAL === 'true',
  },

  channels: {
    requiredChannel: process.env.REQUIRED_CHANNEL_ID || '@TVA_Mining_News_Arabic',
    channelUrl: process.env.REQUIRED_CHANNEL_URL || 'https://t.me/TVA_Mining_News_Arabic',
    list: [
      {
        id: '@TVA_Mining_News_Arabic',
        username: 'TVA_Mining_News_Arabic',
        title: 'TVA الأخبار العربية 📢',
        url: 'https://t.me/TVA_Mining_News_Arabic',
      },
      {
        id: '@TVA_Mining_News',
        username: 'TVA_Mining_News',
        title: 'TVA Official News 🌐',
        url: 'https://t.me/TVA_Mining_News',
      },
      {
        id: '@TVA_Payment',
        username: 'TVA_Payment',
        title: 'TVA إثباتات السحب والدفع 💎',
        url: 'https://t.me/TVA_Payment',
      },
    ],
  },

  support: {
    adminUsername: process.env.SUPPORT_ADMIN_USERNAME || 'TVA_Support_Help',
    adminUrl: process.env.SUPPORT_ADMIN_URL || 'https://t.me/TVA_Support_Help',
  },

  deposit: {
    recipientAddress: process.env.DEPOSIT_WALLET_ADDRESS || 'UQDUlQeNULJd5yl9WjHBkHjA0O3pVueC8NKscybGQbI-R92M',
  },

  // Rig presets: [1, 3, 5, 10, 25, 50, 100] TON
  // Lifetime upgrades granting Points (1100 points per 1 TON, where 1 point = 0.0001 TON/day)
  rigTiers: [1, 3, 5, 10, 25, 50, 100].map((cost) => ({
    tierId: `rig_${cost}ton`,
    name: `${cost} TON Rig`,
    costTon: cost,
    isLifetime: true,
    pointsReward: cost * 1100, // Grants Points directly
    dailyYieldTon: 0,
    dailyRateEquivalentTon: +(cost * 0.11).toFixed(4),
  })),
};

export default config;
