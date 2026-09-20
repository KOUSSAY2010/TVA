import mongoose from 'mongoose';

const SystemConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'global_settings',
      unique: true,
    },
    minWithdrawalTon: {
      type: Number,
      default: 0.1,
      min: 0.01,
    },
    withdrawalFeePercent: {
      type: Number,
      default: 5,
      min: 0,
      max: 50,
    },
    adsRequiredForWithdrawal: {
      type: Number,
      default: 15,
      min: 0,
    },
    requireRigForWithdrawal: {
      type: Boolean,
      default: false,
    },
    baseMiningRate: {
      type: Number,
      default: 0.001,
      min: 0,
    },
    maxDailyAds: {
      type: Number,
      default: 40,
      min: 1,
    },
    activeReferralRequiredAds: {
      type: Number,
      default: 10,
      min: 1,
    },
    referralRewardPoints: {
      type: Number,
      default: 10,
      min: 0,
    },
    rigTiers: [
      {
        costTon: { type: Number, required: true },
        dailyYieldPercent: { type: Number, default: 11 },
        durationDays: { type: Number, default: 10 },
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Singleton retrieval helper that auto-initializes defaults if not yet created
 */
SystemConfigSchema.statics.getOrCreateConfig = async function () {
  let settings = await this.findOne({ key: 'global_settings' });
  if (!settings) {
    const defaultRigs = [1, 3, 5, 10, 25, 50, 100].map((cost) => ({
      costTon: cost,
      dailyYieldPercent: 11,
      durationDays: 10,
      isActive: true,
    }));

    settings = await this.create({
      key: 'global_settings',
      rigTiers: defaultRigs,
    });
  }
  return settings;
};

export const SystemConfig = mongoose.model('SystemConfig', SystemConfigSchema);
export default SystemConfig;
