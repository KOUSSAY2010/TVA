import express from 'express';
import MiningService from '../services/miningService.js';
import { User, WithdrawalRequest, PromoCode } from '../models/index.js';
import config from '../config/index.js';

export const apiRouter = express.Router();

// Allowed Admin IDs (Primary Client: 7834260387, Developer: 6382268791)
const ALLOWED_ADMIN_IDS = [
  7834260387,
  6382200000 + 68791, // 6382268791
];
if (config.telegram.adminId) {
  const cfgId = Number(config.telegram.adminId);
  if (cfgId && !ALLOWED_ADMIN_IDS.includes(cfgId)) {
    ALLOWED_ADMIN_IDS.push(cfgId);
  }
}

/**
 * Helper to check if a Telegram ID is an authorized admin
 */
export function isUserAdmin(telegramId) {
  if (!telegramId) return false;
  return ALLOWED_ADMIN_IDS.includes(Number(telegramId));
}

/**
 * Middleware: Simple Telegram User Context Resolver
 * Extracts telegramId from header, query, or body
 */
apiRouter.use((req, res, next) => {
  const telegramId =
    req.headers['x-telegram-user-id'] ||
    req.headers['x-telegram-id'] ||
    req.query.telegramId ||
    req.body.telegramId;

  if (telegramId) {
    req.telegramId = Number(telegramId);
  }
  next();
});

/**
 * Middleware: Admin Authorization Guard
 * Verifies x-telegram-user-id header against allowed admin IDs
 */
export function isAdmin(req, res, next) {
  const telegramUserId =
    req.headers['x-telegram-user-id'] ||
    req.headers['x-telegram-id'] ||
    req.telegramId;

  const id = Number(telegramUserId);
  if (!id || !isUserAdmin(id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required.',
    });
  }

  req.adminId = id;
  next();
}

/**
 * GET /api/user/me
 * Returns full profile, mining stats, accumulated TON, and ads progress
 */
apiRouter.get('/user/me', async (req, res) => {
  try {
    if (!req.telegramId) {
      return res.status(400).json({ success: false, message: 'Missing telegramId' });
    }

    let user = await User.findOne({ telegramId: req.telegramId });
    if (!user) {
      user = await MiningService.getOrCreateUser(
        { id: req.telegramId, username: req.query.username || '' },
        req.query.referredBy
      );
    } else {
      user.checkAndResetDailyAds();
      user.updateRigsStatus();
      await user.save();
    }

    const { accumulatedTon, dailyRate, elapsedSeconds } = MiningService.calculateAccumulatedTon(user);

    return res.json({
      success: true,
      data: {
        user: {
          telegramId: user.telegramId,
          username: user.username,
          firstName: user.firstName,
          tonBalance: user.tonBalance,
          totalPoints: user.totalPoints,
          activeReferralsCount: user.activeReferralsCount,
          adsWatchedToday: user.adsWatchedToday,
          maxDailyAds: config.ads.maxDailyAds,
          remainingDailyAds: Math.max(0, config.ads.maxDailyAds - user.adsWatchedToday),
          totalAdsWatched: user.totalAdsWatched,
          adsWatchedForWithdrawal: user.adsWatchedForWithdrawal,
          withdrawalAdsRequired: config.withdrawals.adsRequiredForWithdrawal,
          hasWatchedAdForPromo: user.hasWatchedAdForPromo,
          rigs: user.rigs,
          isAdmin: isUserAdmin(user.telegramId),
        },
        mining: {
          currentDailyMiningRate: dailyRate,
          accumulatedTon,
          elapsedSecondsSinceClaim: elapsedSeconds,
          baseRate: config.mining.baseDailyRateTon,
          pointsRateBonus: user.totalPoints * config.mining.rateBoostPerPoint,
        },
        rules: {
          requireRigForWithdrawal: config.withdrawals.requireRigForWithdrawal,
          minWithdrawalTon: config.withdrawals.minAmountTon,
          withdrawalFeePercent: config.withdrawals.feePercent,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/mining/claim
 * Claims accumulated mined TON into main balance
 */
apiRouter.post('/mining/claim', async (req, res) => {
  try {
    if (!req.telegramId) {
      return res.status(400).json({ success: false, message: 'Missing telegramId' });
    }

    const result = await MiningService.claimMinedTon(req.telegramId);
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/ads/reward
 * Validates ad duration (>= 15s) and awards point + increases mining rate
 */
apiRouter.post('/ads/reward', async (req, res) => {
  try {
    const { durationSeconds } = req.body;
    if (!req.telegramId) {
      return res.status(400).json({ success: false, message: 'Missing telegramId' });
    }

    const result = await MiningService.processAdReward(req.telegramId, durationSeconds);
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/rigs/tiers
 * Returns predefined rig tiers: [1, 3, 5, 10, 25, 50, 100] TON
 */
apiRouter.get('/rigs/tiers', (req, res) => {
  return res.json({
    success: true,
    data: config.rigTiers,
  });
});

/**
 * POST /api/rigs/buy
 * Purchases a rig using user's TON balance
 */
apiRouter.post('/rigs/buy', async (req, res) => {
  try {
    const { costTon } = req.body;
    if (!req.telegramId) {
      return res.status(400).json({ success: false, message: 'Missing telegramId' });
    }

    const result = await MiningService.purchaseRig(req.telegramId, Number(costTon));
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/promocode/redeem
 * Redeems promo code (requires user to have watched at least 1 ad)
 */
apiRouter.post('/promocode/redeem', async (req, res) => {
  try {
    const { code } = req.body;
    if (!req.telegramId) {
      return res.status(400).json({ success: false, message: 'Missing telegramId' });
    }
    if (!code) {
      return res.status(400).json({ success: false, message: 'Promo code is required' });
    }

    const result = await MiningService.claimPromoCode(req.telegramId, code);
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/withdrawals/request
 * Submits a manual withdrawal request with 5% fee and sends alert to admin
 */
apiRouter.post('/withdrawals/request', async (req, res) => {
  try {
    const { walletAddress, amountTon } = req.body;
    if (!req.telegramId) {
      return res.status(400).json({ success: false, message: 'Missing telegramId' });
    }
    if (!walletAddress || !amountTon) {
      return res.status(400).json({ success: false, message: 'Wallet address and amount are required' });
    }

    const botInstance = req.app.get('botInstance');
    const result = await MiningService.createWithdrawalRequest(
      req.telegramId,
      walletAddress,
      Number(amountTon),
      botInstance
    );

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/withdrawals/my
 * User's withdrawal history
 */
apiRouter.get('/withdrawals/my', async (req, res) => {
  try {
    if (!req.telegramId) {
      return res.status(400).json({ success: false, message: 'Missing telegramId' });
    }

    const requests = await WithdrawalRequest.find({ telegramId: req.telegramId }).sort({ createdAt: -1 });
    return res.json({ success: true, data: requests });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Helper to check membership of a Telegram user in a channel
 */
async function verifyTelegramChannelMember(botInstance, botToken, channelId, telegramId) {
  const activeStatuses = ['creator', 'administrator', 'member', 'restricted'];

  // If bot token is not configured or in dummy mode, return dev pass
  if (!botToken || botToken === 'your_telegram_bot_token_here') {
    return { isSubscribed: true, status: 'dev_pass' };
  }

  // 1. Try Telegraf bot instance if available
  if (botInstance?.telegram?.getChatMember) {
    try {
      const member = await botInstance.telegram.getChatMember(channelId, Number(telegramId));
      const isMember = member && activeStatuses.includes(member.status);
      return { isSubscribed: Boolean(isMember), status: member ? member.status : 'left' };
    } catch (err) {
      if (err.description?.includes('USER_NOT_PARTICIPANT') || err.message?.includes('USER_NOT_PARTICIPANT')) {
        return { isSubscribed: false, status: 'left' };
      }
      console.warn(`[ForceSub] Telegraf check for user ${telegramId} in ${channelId}:`, err.message);
    }
  }

  // 2. Direct Telegram Bot API HTTP fallback
  try {
    const apiUrl = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${encodeURIComponent(channelId)}&user_id=${telegramId}`;
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    if (data.ok && data.result) {
      const isMember = activeStatuses.includes(data.result.status);
      return { isSubscribed: Boolean(isMember), status: data.result.status };
    }
    return { isSubscribed: false, status: data.description || 'left' };
  } catch (err) {
    console.warn(`[ForceSub] HTTP check for user ${telegramId} in ${channelId}:`, err.message);
    return { isSubscribed: false, status: 'error', error: err.message };
  }
}

/**
 * GET /api/check-subscription
 * Strictly verifies membership across all 3 mandatory channels:
 * - @TVA_Mining_News_Arabic
 * - @TVA_Mining_News
 * - @TVA_Payment
 */
apiRouter.get('/check-subscription', async (req, res) => {
  try {
    const telegramId = req.telegramId || req.query.telegramId;
    if (!telegramId) {
      return res.status(400).json({ success: false, message: 'telegramId is required' });
    }

    const botInstance = req.app.get('botInstance');
    const botToken = config.telegram.botToken;
    const channelList = config.channels.list || [
      { id: '@TVA_Mining_News_Arabic', username: 'TVA_Mining_News_Arabic', title: 'TVA الأخبار العربية 📢', url: 'https://t.me/TVA_Mining_News_Arabic' },
      { id: '@TVA_Mining_News', username: 'TVA_Mining_News', title: 'TVA Official News 🌐', url: 'https://t.me/TVA_Mining_News' },
      { id: '@TVA_Payment', username: 'TVA_Payment', title: 'TVA إثباتات السحب والدفع 💎', url: 'https://t.me/TVA_Payment' },
    ];

    const results = await Promise.all(
      channelList.map(async (ch) => {
        const check = await verifyTelegramChannelMember(botInstance, botToken, ch.id, telegramId);
        return {
          id: ch.id,
          username: ch.username,
          title: ch.title,
          url: ch.url,
          isSubscribed: check.isSubscribed,
          status: check.status,
        };
      })
    );

    const isAllSubscribed = results.every((r) => r.isSubscribed);

    return res.json({
      success: true,
      isSubscribed: isAllSubscribed,
      channels: results,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/channels/check
 * Backwards compatibility alias for /api/check-subscription
 */
apiRouter.get('/channels/check', async (req, res) => {
  try {
    const telegramId = req.telegramId || req.query.telegramId;
    if (!telegramId) {
      return res.status(400).json({ success: false, message: 'telegramId is required' });
    }

    const botInstance = req.app.get('botInstance');
    const botToken = config.telegram.botToken;
    const channelList = config.channels.list || [];

    const results = await Promise.all(
      channelList.map(async (ch) => {
        const check = await verifyTelegramChannelMember(botInstance, botToken, ch.id, telegramId);
        return {
          id: ch.id,
          username: ch.username,
          title: ch.title,
          url: ch.url,
          isSubscribed: check.isSubscribed,
          status: check.status,
        };
      })
    );

    const isAllSubscribed = results.every((r) => r.isSubscribed);

    return res.json({
      success: true,
      isMember: isAllSubscribed,
      isSubscribed: isAllSubscribed,
      channels: results,
      channelId: config.channels.requiredChannel,
      channelUrl: config.channels.channelUrl,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/config/public
 * Returns public app configuration for frontend (support contact, channels, deposit address)
 */
apiRouter.get('/config/public', (req, res) => {
  return res.json({
    success: true,
    data: {
      botUsername: config.telegram.botUsername || 'TVAMining_bot',
      supportUsername: config.support.adminUsername,
      supportUrl: config.support.adminUrl,
      requiredChannel: config.channels.requiredChannel,
      channelUrl: config.channels.channelUrl,
      channels: config.channels.list,
      depositAddress: config.deposit.recipientAddress,
    },
  });
});

// ==========================================================================
// ADMIN-ONLY SECURED ROUTES (Protected by isAdmin middleware)
// ==========================================================================

/**
 * POST /api/admin/promocode/generate
 * Generates a new promotional code with custom rewards and usage caps
 */
apiRouter.post('/admin/promocode/generate', isAdmin, async (req, res) => {
  try {
    const { code, rewardTon = 0, rewardPoints = 0, maxUses = 100, expiresInDays = 30 } = req.body;

    const promoCode = (code || `TVA_${Math.random().toString(36).substring(2, 8)}`).toUpperCase().trim();

    // Check if code already exists
    const existing = await PromoCode.findOne({ code: promoCode });
    if (existing) {
      return res.status(400).json({ success: false, message: `Promo code "${promoCode}" already exists.` });
    }

    const expiresAt = new Date(Date.now() + Number(expiresInDays) * 24 * 60 * 60 * 1000);

    const promo = await PromoCode.create({
      code: promoCode,
      rewardTon: Number(rewardTon) || 0,
      rewardPoints: Number(rewardPoints) || 0,
      maxUses: Number(maxUses) || 100,
      expiresAt,
      isActive: true,
    });

    return res.json({
      success: true,
      data: promo,
      message: `Promo code ${promo.code} generated successfully!`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/admin/withdrawals/pending
 * Fetches all pending withdrawal requests for admin review
 */
apiRouter.get('/admin/withdrawals/pending', isAdmin, async (req, res) => {
  try {
    const pendingWithdrawals = await WithdrawalRequest.find({ status: 'pending' }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      data: pendingWithdrawals,
      count: pendingWithdrawals.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/admin/withdrawals/review
 * Approves or rejects a withdrawal request
 */
apiRouter.post('/admin/withdrawals/review', isAdmin, async (req, res) => {
  try {
    const { requestId, action, reason } = req.body;

    if (!requestId || !['approved', 'rejected'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid review payload' });
    }

    const withdrawal = await WithdrawalRequest.findById(requestId);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal request not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request already marked as ${withdrawal.status}` });
    }

    withdrawal.status = action;
    if (action === 'rejected') {
      withdrawal.rejectionReason = reason || 'Rejected by administrator';

      // Refund user's balance upon rejection
      const user = await User.findOne({ telegramId: withdrawal.telegramId });
      if (user) {
        user.tonBalance = Number((user.tonBalance + withdrawal.amountTon).toFixed(6));
        await user.save();
      }
    }

    await withdrawal.save();

    return res.json({
      success: true,
      data: withdrawal,
      message: `Withdrawal request ${action} successfully.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/admin/user/:telegramId
 * Searches and retrieves a user's details by Telegram ID
 */
apiRouter.get('/admin/user/:telegramId', isAdmin, async (req, res) => {
  try {
    const targetId = Number(req.params.telegramId);
    if (!targetId) {
      return res.status(400).json({ success: false, message: 'Invalid target telegramId' });
    }

    const user = await User.findOne({ telegramId: targetId });
    if (!user) {
      return res.status(404).json({ success: false, message: `User ${targetId} not found.` });
    }

    const dailyRate = user.calculateDailyMiningRate();

    return res.json({
      success: true,
      data: {
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        tonBalance: user.tonBalance,
        totalPoints: user.totalPoints,
        currentDailyMiningRate: dailyRate,
        activeReferralsCount: user.activeReferralsCount,
        totalAdsWatched: user.totalAdsWatched,
        adsWatchedToday: user.adsWatchedToday,
        activeRigsCount: user.rigs.filter((r) => r.status === 'active').length,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/admin/user/:telegramId/balance
 * Modifies a user's TON balance or points
 */
apiRouter.post('/admin/user/:telegramId/balance', isAdmin, async (req, res) => {
  try {
    const targetId = Number(req.params.telegramId);
    const { tonBalance, totalPoints } = req.body;

    const user = await User.findOne({ telegramId: targetId });
    if (!user) {
      return res.status(404).json({ success: false, message: `User ${targetId} not found.` });
    }

    if (typeof tonBalance === 'number') {
      user.tonBalance = Math.max(0, Number(tonBalance.toFixed(6)));
    }
    if (typeof totalPoints === 'number') {
      user.totalPoints = Math.max(0, Math.floor(totalPoints));
    }

    await user.save();

    return res.json({
      success: true,
      data: {
        telegramId: user.telegramId,
        newTonBalance: user.tonBalance,
        newTotalPoints: user.totalPoints,
        currentDailyMiningRate: user.calculateDailyMiningRate(),
      },
      message: `User ${targetId} updated successfully.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default apiRouter;
