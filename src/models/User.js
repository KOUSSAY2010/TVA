import mongoose from 'mongoose';
import config from '../config/index.js';

const RigSchema = new mongoose.Schema(
  {
    tierId: { type: String, required: true },
    costTon: { type: Number, required: true },
    pointsReward: { type: Number, default: 0 },
    dailyYieldTon: { type: Number, default: 0 },
    isLifetime: { type: Boolean, default: true },
    purchasedAt: { type: Date, default: Date.now },
    expiresAt: {
      type: Date,
      default: null, // Lifetime upgrade
    },
    status: {
      type: String,
      enum: ['active', 'expired'],
      default: 'active',
    },
  },
  { _id: true }
);

const UserSchema = new mongoose.Schema(
  {
    telegramId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    username: { type: String, default: '' },
    firstName: { type: String, default: '' },

    // Financial Balances
    tonBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Passive Mining Tracking
    lastClaimAt: {
      type: Date,
      default: Date.now,
    },

    // Ads Tracking
    adsWatchedToday: {
      type: Number,
      default: 0,
      max: config.ads.maxDailyAds, // Max 40 ads/day
    },
    lastAdDate: {
      type: String, // Stored as YYYY-MM-DD (UTC) for daily reset check
      default: () => new Date().toISOString().split('T')[0],
    },
    totalAdsWatched: {
      type: Number,
      default: 0,
    },
    adsWatchedForWithdrawal: {
      type: Number,
      default: 0, // Need 15 to request manual withdrawal
    },
    hasWatchedAdForPromo: {
      type: Boolean,
      default: false, // User must watch at least 1 ad before claiming promo code
    },

    // Referral System (4 Levels)
    referredBy: {
      type: Number,
      default: null,
      index: true,
    },
    referralUplines: [
      {
        level: { type: Number, required: true }, // 1, 2, 3, 4
        telegramId: { type: Number, required: true },
      },
    ],
    referralStats: {
      level1Count: { type: Number, default: 0 },
      level2Count: { type: Number, default: 0 },
      level3Count: { type: Number, default: 0 },
      level4Count: { type: Number, default: 0 },
      level1Earnings: { type: Number, default: 0 },
      level2Earnings: { type: Number, default: 0 },
      level3Earnings: { type: Number, default: 0 },
      level4Earnings: { type: Number, default: 0 },
      totalEarnings: { type: Number, default: 0 },
    },
    activeReferralsCount: {
      type: Number,
      default: 0,
    },
    isReferralRewarded: {
      type: Boolean,
      default: false, // True once this user watched 10 ads and granted 10 points to their referrer
    },

    // Financial Aliases & Mining Stats for complete compatibility
    balance: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    totalMined: {
      type: Number,
      default: 0,
    },

    // Mining Rigs / Miners
    miners: [RigSchema],
    rigs: [RigSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Resets daily ads counter if day has rolled over.
 */
UserSchema.methods.checkAndResetDailyAds = function () {
  const today = new Date().toISOString().split('T')[0];
  if (this.lastAdDate !== today) {
    this.adsWatchedToday = 0;
    this.lastAdDate = today;
  }
};

/**
 * Update rig expiration statuses based on current timestamp.
 */
UserSchema.methods.updateRigsStatus = function () {
  const now = new Date();
  let updated = false;
  this.rigs.forEach((rig) => {
    // Only expire rigs that have an explicit expiration date
    if (rig.expiresAt && rig.status === 'active' && new Date(rig.expiresAt) <= now) {
      rig.status = 'expired';
      updated = true;
    }
  });
  return updated;
};

/**
 * Calculate user's current daily mining rate dynamically:
 * Base + (totalPoints * 0.0001) + Sum of any legacy rigs daily yields
 */
UserSchema.methods.calculateDailyMiningRate = function () {
  this.updateRigsStatus();

  const baseRate = config.mining.baseDailyRateTon;
  const pointsRate = this.totalPoints * config.mining.rateBoostPerPoint;

  // Legacy fallback: only rigs that did not grant direct points
  const activeRigsYield = this.rigs
    .filter((rig) => rig.status === 'active' && (!rig.pointsReward || rig.pointsReward === 0))
    .reduce((sum, rig) => sum + (rig.dailyYieldTon || 0), 0);

  const totalRate = baseRate + pointsRate + activeRigsYield;
  return Number(totalRate.toFixed(6));
};

/**
 * Virtual property for current daily mining rate.
 */
UserSchema.virtual('currentDailyMiningRate').get(function () {
  return this.calculateDailyMiningRate();
});

export const User = mongoose.model('User', UserSchema);
export default User;
