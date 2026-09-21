import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleAr: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    descriptionAr: {
      type: String,
      default: '',
      trim: true,
    },
    rewardPoints: {
      type: Number,
      default: 10,
      min: 0,
    },
    rewardAmount: {
      type: Number,
      default: 10,
      min: 0,
    },
    rewardTon: {
      type: Number,
      default: 0,
      min: 0,
    },
    autoVerify: {
      type: Boolean,
      default: true,
    },
    memberLimit: {
      type: Number,
      default: 0, // 0 = unlimited
      min: 0,
    },
    type: {
      type: String,
      enum: ['ad', 'telegram', 'partner', 'custom', 'social'],
      default: 'telegram',
    },
    actionUrl: {
      type: String,
      default: '',
      trim: true,
    },
    durationSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    completedBy: [
      {
        telegramId: { type: Number, required: true },
        completedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model('Task', TaskSchema);
export default Task;
