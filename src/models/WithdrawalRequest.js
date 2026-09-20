import mongoose from 'mongoose';

const WithdrawalRequestSchema = new mongoose.Schema(
  {
    telegramId: {
      type: Number,
      required: true,
      index: true,
    },
    walletAddress: {
      type: String,
      required: true,
      trim: true,
    },
    amountTon: {
      type: Number,
      required: true,
      min: 0.1,
    },
    feeTon: {
      type: Number,
      required: true,
    },
    netAmountTon: {
      type: Number,
      required: true,
    },
    // Captured snapshot of the user's daily mining rate at time of request for admin review
    currentDailyMiningRateAtRequest: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
      index: true,
    },
    adminTelegramMessageId: {
      type: Number,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    txHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const WithdrawalRequest = mongoose.model(
  'WithdrawalRequest',
  WithdrawalRequestSchema
);
export default WithdrawalRequest;
