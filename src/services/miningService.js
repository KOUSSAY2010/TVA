import { User, WithdrawalRequest, PromoCode, SystemConfig } from '../models/index.js';
import config from '../config/index.js';

/**
 * Service handling mining calculations, ads rewards, referrals, and withdrawals.
 */
export class MiningService {
  /**
   * Get or create a user by Telegram ID with robust referral linking
   */
  static async getOrCreateUser(telegramUser, referrerId = null) {
    let user = await User.findOne({ telegramId: telegramUser.id });

    // Clean & sanitize referrer ID (handles 'ref_12345', 12345, '12345')
    let parsedReferrerId = null;
    if (referrerId !== null && referrerId !== undefined && referrerId !== '') {
      const cleanRef = String(referrerId).replace(/^ref_?/i, '').trim();
      const parsedNum = parseInt(cleanRef, 10);
      if (!isNaN(parsedNum) && parsedNum > 0 && parsedNum !== Number(telegramUser.id)) {
        parsedReferrerId = parsedNum;
      }
    }

    if (!user) {
      // Validate referrer exists in database and build 4-level upline chain
      let validReferrerId = null;
      let uplines = [];
      if (parsedReferrerId) {
        const referrerExists = await User.exists({ telegramId: parsedReferrerId });
        if (referrerExists) {
          validReferrerId = parsedReferrerId;
          uplines = await MiningService.resolveReferralUplines(parsedReferrerId);
        }
      }

      user = await User.create({
        telegramId: telegramUser.id,
        username: telegramUser.username || '',
        firstName: telegramUser.first_name || '',
        referredBy: validReferrerId,
        referralUplines: uplines,
        lastClaimAt: new Date(),
      });

      // Update upline stats
      if (uplines.length > 0) {
        await MiningService.incrementUplineCounts(uplines);
      }
    } else {
      // If user exists without a referrer, link them now if a valid referrer is provided
      if (!user.referredBy && parsedReferrerId) {
        const referrerExists = await User.exists({ telegramId: parsedReferrerId });
        if (referrerExists) {
          user.referredBy = parsedReferrerId;
          const uplines = await MiningService.resolveReferralUplines(parsedReferrerId);
          user.referralUplines = uplines;
          await MiningService.incrementUplineCounts(uplines);
        }
      }
      user.checkAndResetDailyAds();
      user.updateRigsStatus();
      await user.save();
    }

    return user;
  }

  /**
   * Resolve 4-level upline hierarchy
   * Level 1: direct inviter
   * Level 2: inviter of Level 1
   * Level 3: inviter of Level 2
   * Level 4: inviter of Level 3
   */
  static async resolveReferralUplines(directReferrerId) {
    const uplines = [];
    let currentRefId = directReferrerId;
    const visited = new Set();

    for (let level = 1; level <= 4; level++) {
      if (!currentRefId || visited.has(currentRefId)) break;
      visited.add(currentRefId);

      const uplineUser = await User.findOne({ telegramId: currentRefId }, 'telegramId referredBy');
      if (!uplineUser) break;

      uplines.push({ level, telegramId: uplineUser.telegramId });
      currentRefId = uplineUser.referredBy;
    }

    return uplines;
  }

  /**
   * Increment referral counters for each upline tier
   */
  static async incrementUplineCounts(uplines) {
    for (const item of uplines) {
      try {
        const uplineUser = await User.findOne({ telegramId: item.telegramId });
        if (uplineUser) {
          if (!uplineUser.referralStats) {
            uplineUser.referralStats = {
              level1Count: 0, level2Count: 0, level3Count: 0, level4Count: 0,
              level1Earnings: 0, level2Earnings: 0, level3Earnings: 0, level4Earnings: 0,
              totalEarnings: 0,
            };
          }
          if (item.level === 1) {
            uplineUser.referralStats.level1Count = (uplineUser.referralStats.level1Count || 0) + 1;
            uplineUser.activeReferralsCount = (uplineUser.activeReferralsCount || 0) + 1;
          } else if (item.level === 2) {
            uplineUser.referralStats.level2Count = (uplineUser.referralStats.level2Count || 0) + 1;
          } else if (item.level === 3) {
            uplineUser.referralStats.level3Count = (uplineUser.referralStats.level3Count || 0) + 1;
          } else if (item.level === 4) {
            uplineUser.referralStats.level4Count = (uplineUser.referralStats.level4Count || 0) + 1;
          }
          await uplineUser.save();
        }
      } catch (err) {
        console.warn(`Failed to increment count for upline ${item.telegramId}:`, err.message);
      }
    }
  }

  /**
   * Distribute 4-tier referral points when a user earns:
   * Level 1: 1 Point
   * Level 2: 0.5 Points
   * Level 3: 0.25 Points
   * Level 4: 0.1 Points
   */
  static async distributeMultiLevelRewards(user) {
    let uplines = user.referralUplines || [];
    if ((!uplines || uplines.length === 0) && user.referredBy) {
      uplines = await MiningService.resolveReferralUplines(user.referredBy);
      user.referralUplines = uplines;
      await user.save();
    }

    if (!uplines || uplines.length === 0) return;

    const tierRates = { 1: 1.0, 2: 0.5, 3: 0.25, 4: 0.1 };

    for (const item of uplines) {
      const rewardPoints = tierRates[item.level];
      if (!rewardPoints) continue;

      try {
        const uplineUser = await User.findOne({ telegramId: item.telegramId });
        if (uplineUser) {
          uplineUser.totalPoints = Number((uplineUser.totalPoints + rewardPoints).toFixed(4));
          uplineUser.points = uplineUser.totalPoints;
          if (!uplineUser.referralStats) {
            uplineUser.referralStats = {
              level1Count: 0, level2Count: 0, level3Count: 0, level4Count: 0,
              level1Earnings: 0, level2Earnings: 0, level3Earnings: 0, level4Earnings: 0,
              totalEarnings: 0,
            };
          }
          if (item.level === 1) uplineUser.referralStats.level1Earnings = Number(((uplineUser.referralStats.level1Earnings || 0) + rewardPoints).toFixed(4));
          if (item.level === 2) uplineUser.referralStats.level2Earnings = Number(((uplineUser.referralStats.level2Earnings || 0) + rewardPoints).toFixed(4));
          if (item.level === 3) uplineUser.referralStats.level3Earnings = Number(((uplineUser.referralStats.level3Earnings || 0) + rewardPoints).toFixed(4));
          if (item.level === 4) uplineUser.referralStats.level4Earnings = Number(((uplineUser.referralStats.level4Earnings || 0) + rewardPoints).toFixed(4));
          uplineUser.referralStats.totalEarnings = Number(((uplineUser.referralStats.totalEarnings || 0) + rewardPoints).toFixed(4));

          await uplineUser.save();
        }
      } catch (err) {
        console.warn(`Failed to reward upline ${item.telegramId} level ${item.level}:`, err.message);
      }
    }
  }

  /**
   * Calculate currently accumulated claimable TON based on elapsed time and current daily rate.
   */
  static calculateAccumulatedTon(user) {
    user.checkAndResetDailyAds();
    user.updateRigsStatus();

    const dailyRate = user.calculateDailyMiningRate();
    const now = Date.now();
    const lastClaim = new Date(user.lastClaimAt).getTime();
    const elapsedSeconds = Math.max(0, (now - lastClaim) / 1000);

    // Accumulated = (Daily Rate / 86400 seconds) * elapsedSeconds
    const accumulated = (dailyRate / 86400) * elapsedSeconds;
    return {
      dailyRate,
      elapsedSeconds: Math.floor(elapsedSeconds),
      accumulatedTon: Number(accumulated.toFixed(8)),
    };
  }

  /**
   * Claim accumulated mined TON to main balance.
   */
  static async claimMinedTon(telegramId) {
    const user = await User.findOne({ telegramId });
    if (!user) throw new Error('User not found');

    const { accumulatedTon, dailyRate } = this.calculateAccumulatedTon(user);

    if (accumulatedTon <= 0) {
      return { claimedTon: 0, newBalance: user.tonBalance, dailyRate };
    }

    user.tonBalance = Number((user.tonBalance + accumulatedTon).toFixed(8));
    user.lastClaimAt = new Date();
    await user.save();

    return {
      claimedTon: accumulatedTon,
      newBalance: user.tonBalance,
      dailyRate,
    };
  }

  /**
   * Process AdsGram / Ad reward with 15-second anti-cheat verification and referral rewards.
   */
  static async processAdReward(telegramId, adDurationSeconds) {
    // Anti-Cheat: Reject if ad watched duration is under 15 seconds
    if (typeof adDurationSeconds === 'number' && adDurationSeconds < config.ads.minDurationSeconds) {
      throw new Error(`Anti-cheat violation: Ad watched duration (${adDurationSeconds}s) is below required ${config.ads.minDurationSeconds}s.`);
    }

    const user = await User.findOne({ telegramId });
    if (!user) throw new Error('User not found');

    user.checkAndResetDailyAds();

    // Check daily ads limit (max 40/day)
    if (user.adsWatchedToday >= config.ads.maxDailyAds) {
      throw new Error(`Daily limit of ${config.ads.maxDailyAds} ads reached. Resets at midnight UTC.`);
    }

    // 1 watched ad = 1 point
    user.adsWatchedToday += 1;
    user.totalAdsWatched += 1;
    user.totalPoints += config.mining.pointsPerAd; // 1 point = +0.0001 TON/day
    user.adsWatchedForWithdrawal += 1;
    user.hasWatchedAdForPromo = true;

    // 4-Tier Multi-Level Referral Distribution:
    // Level 1: 1 Point | Level 2: 0.5 Point | Level 3: 0.25 Point | Level 4: 0.1 Point
    try {
      await MiningService.distributeMultiLevelRewards(user);
    } catch (refErr) {
      console.warn('⚠️ Multi-level referral reward error:', refErr.message);
    }

    // Check Legacy Referral Activation:
    // A referral is considered "active" (and rewards referrer with 10 points)
    // AFTER the referred user watches exactly 10 ads.
    let referralRewarded = false;
    if (user.referredBy && !user.isReferralRewarded && user.totalAdsWatched >= config.ads.adsForActiveReferral) {
      const referrer = await User.findOne({ telegramId: user.referredBy });
      if (referrer) {
        referrer.activeReferralsCount += 1;
        referrer.totalPoints += config.ads.referralRewardPoints; // 10 points
        await referrer.save();

        user.isReferralRewarded = true;
        referralRewarded = true;
      }
    }

    await user.save();

    return {
      pointsAwarded: config.mining.pointsPerAd,
      totalPoints: user.totalPoints,
      adsWatchedToday: user.adsWatchedToday,
      remainingDailyAds: config.ads.maxDailyAds - user.adsWatchedToday,
      currentDailyMiningRate: user.calculateDailyMiningRate(),
      referralRewarded,
    };
  }

  /**
   * Buy a mining rig using TON balance.
   * Prices: [1, 3, 5, 10, 25, 50, 100] TON.
   * Grants Points directly as a lifetime upgrade.
   */
  static async purchaseRig(telegramId, costTon) {
    const tier = config.rigTiers.find((t) => t.costTon === costTon);
    if (!tier) {
      throw new Error(`Invalid rig tier. Allowed costs: ${config.rigTiers.map((t) => t.costTon).join(', ')} TON.`);
    }

    const user = await User.findOne({ telegramId });
    if (!user) throw new Error('User not found');

    if (user.tonBalance < costTon) {
      throw new Error(`Insufficient TON balance. Required: ${costTon} TON, Current: ${user.tonBalance.toFixed(4)} TON.`);
    }

    // Deduct balance and grant Points
    user.tonBalance = Number((user.tonBalance - costTon).toFixed(4));
    const pointsAwarded = tier.pointsReward || (costTon * 1100);
    user.totalPoints += pointsAwarded;

    user.rigs.push({
      tierId: tier.tierId,
      costTon: tier.costTon,
      pointsReward: pointsAwarded,
      dailyYieldTon: 0,
      isLifetime: true,
      purchasedAt: new Date(),
      expiresAt: null, // Lifetime upgrade
      status: 'active',
    });

    await user.save();

    return {
      tier,
      pointsAwarded,
      newPoints: user.totalPoints,
      newTonBalance: user.tonBalance,
      newDailyMiningRate: user.calculateDailyMiningRate(),
      activeRigsCount: user.rigs.filter((r) => r.status === 'active').length,
    };
  }

  /**
   * Claim a promo code.
   * Requirement: User must watch at least 1 ad before claiming any promo code.
   */
  static async claimPromoCode(telegramId, rawCode) {
    const code = rawCode.trim().toUpperCase();
    const user = await User.findOne({ telegramId });
    if (!user) throw new Error('User not found');

    const promo = await PromoCode.findOne({ code, isActive: true });
    if (!promo) {
      throw new Error('Invalid or expired promo code.');
    }

    // Dynamic ad requirement per promo code
    const requiredAds = typeof promo.requiredAdsCount === 'number' ? promo.requiredAdsCount : 1;
    if (user.totalAdsWatched < requiredAds) {
      throw new Error(`You must watch at least ${requiredAds} ad(s) before claiming this promo code. (Watched: ${user.totalAdsWatched}/${requiredAds})`);
    }

    if (promo.expiresAt && new Date(promo.expiresAt) <= new Date()) {
      throw new Error('This promo code has expired.');
    }

    if (promo.timesUsed >= promo.maxUses) {
      throw new Error('This promo code has reached its maximum usage limit.');
    }

    const alreadyUsed = promo.usedBy.some((u) => u.telegramId === telegramId);
    if (alreadyUsed) {
      throw new Error('You have already claimed this promo code.');
    }

    // Apply rewards
    promo.timesUsed += 1;
    promo.usedBy.push({ telegramId, redeemedAt: new Date() });
    await promo.save();

    if (promo.rewardPoints > 0) {
      user.totalPoints += promo.rewardPoints;
    }
    if (promo.rewardTon > 0) {
      user.tonBalance = Number((user.tonBalance + promo.rewardTon).toFixed(4));
    }

    await user.save();

    return {
      rewardPoints: promo.rewardPoints,
      rewardTon: promo.rewardTon,
      newPoints: user.totalPoints,
      newTonBalance: user.tonBalance,
      newDailyMiningRate: user.calculateDailyMiningRate(),
    };
  }

  /**
   * Submit manual withdrawal request.
   * Requirements:
   * 1. Min 0.1 TON.
   * 2. 5% withdrawal fee.
   * 3. Must have watched 15 ads for withdrawal.
   * 4. If requireRigForWithdrawal toggle is true, user must own at least 1 active rig.
   */
  static async createWithdrawalRequest(telegramId, walletAddress, amountTon, botInstance = null) {
    if (amountTon < config.withdrawals.minAmountTon) {
      throw new Error(`Minimum withdrawal amount is ${config.withdrawals.minAmountTon} TON.`);
    }

    const user = await User.findOne({ telegramId });
    if (!user) throw new Error('User not found');

    // Check 15 ads requirement
    if (user.adsWatchedForWithdrawal < config.withdrawals.adsRequiredForWithdrawal) {
      throw new Error(
        `You must watch ${config.withdrawals.adsRequiredForWithdrawal} ads before requesting a withdrawal. Progress: ${user.adsWatchedForWithdrawal}/${config.withdrawals.adsRequiredForWithdrawal}`
      );
    }

    // Check rig requirement toggle (dynamically retrieved from SystemConfig)
    user.updateRigsStatus();
    const sysSettings = await SystemConfig.getOrCreateConfig();
    const isRigRequired = sysSettings.requireRigForWithdrawal ?? config.withdrawals.requireRigForWithdrawal;
    if (isRigRequired) {
      const hasPurchasedRig = user.rigs && user.rigs.length > 0;
      if (!hasPurchasedRig) {
        throw new Error('يجب شراء منصة تعدين واحدة على الأقل لتتمكن من سحب الأرباح. / You must purchase at least one mining rig before you can withdraw.');
      }
    }

    // Check balance
    if (user.tonBalance < amountTon) {
      throw new Error(`Insufficient TON balance. Current balance: ${user.tonBalance.toFixed(4)} TON.`);
    }

    // Deduct balance and reset withdrawal ads counter
    const feeTon = Number(((amountTon * config.withdrawals.feePercent) / 100).toFixed(6));
    const netAmountTon = Number((amountTon - feeTon).toFixed(6));
    const currentRate = user.calculateDailyMiningRate();

    user.tonBalance = Number((user.tonBalance - amountTon).toFixed(6));
    // Reset the 15-ads requirement counter for subsequent withdrawal
    user.adsWatchedForWithdrawal = Math.max(0, user.adsWatchedForWithdrawal - config.withdrawals.adsRequiredForWithdrawal);
    await user.save();

    const request = await WithdrawalRequest.create({
      telegramId,
      walletAddress,
      amountTon,
      feeTon,
      netAmountTon,
      currentDailyMiningRateAtRequest: currentRate,
      status: 'pending',
    });

    // Notify Admin via Telegram Bot if admin ID and bot instance are configured
    if (botInstance && config.telegram.adminId) {
      const adminMessage = 
        `🚨 *New Withdrawal Request* 🚨\n\n` +
        `👤 *User ID:* \`${telegramId}\`\n` +
        `💰 *Requested Amount:* \`${amountTon} TON\`\n` +
        `💸 *Fee (5%):* \`${feeTon} TON\`\n` +
        `💵 *Net Payout:* \`${netAmountTon} TON\`\n` +
        `🏦 *Wallet:* \`${walletAddress}\`\n` +
        `⚡ *Current Daily Mining Rate:* \`${currentRate} TON/day\`\n` +
        `🆔 *Request ID:* \`${request._id}\``;

      try {
        const sent = await botInstance.telegram.sendMessage(config.telegram.adminId, adminMessage, {
          parse_mode: 'Markdown',
        });
        request.adminTelegramMessageId = sent.message_id;
        await request.save();
      } catch (err) {
        console.error('Failed to send admin withdrawal notification:', err.message);
      }
    }

    return {
      requestId: request._id,
      amountTon,
      feeTon,
      netAmountTon,
      currentDailyMiningRate: currentRate,
      remainingBalance: user.tonBalance,
    };
  }
}

export default MiningService;
