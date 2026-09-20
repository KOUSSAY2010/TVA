import mongoose from 'mongoose';

const PromoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    rewardPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    rewardTon: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxUses: {
      type: Number,
      default: 100,
    },
    requiredAdsCount: {
      type: Number,
      default: 1,
      min: 0,
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
    usedBy: [
      {
        telegramId: { type: Number, required: true },
        redeemedAt: { type: Date, default: Date.now },
      },
    ],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PromoCode = mongoose.model('PromoCode', PromoCodeSchema);
export default PromoCode;
