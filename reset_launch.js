/**
 * TVA Crypto-Mining - Official Launch Database Reset Script
 * 
 * Mandated Actions:
 * 1. Sets ALL users' balance, tonBalance, points, totalPoints, totalMined to 0.
 * 2. Clears/empties the miners and rigs arrays for ALL users.
 * 3. Resets user ads counters, referral rewards, and mining claim timestamps.
 * 4. Resets global statistics, clearing test withdrawal requests.
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import config from './src/config/index.js';
import { User, WithdrawalRequest, PromoCode, Task, SystemConfig } from './src/models/index.js';

async function resetLaunchDatabase() {
  console.log('====================================================');
  console.log('🚀 TVA CRYPTO-MINING: OFFICIAL LAUNCH DATABASE WIPE');
  console.log('====================================================\n');

  const mongoUri = config.db?.uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/tva_mining';
  console.log(`📡 Connecting to MongoDB at: ${mongoUri.replace(/:([^@]+)@/, ':****@')}...`);

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to MongoDB successfully.\n');

    // 1. Update all users in MongoDB
    console.log('⏳ 1. Resetting all users: balance, points, totalMined -> 0, miners -> []...');
    const userResetResult = await User.updateMany(
      {},
      {
        $set: {
          // Balances & Points
          balance: 0,
          tonBalance: 0,
          points: 0,
          totalPoints: 0,
          totalMined: 0,

          // Miners & Rigs
          miners: [],
          rigs: [],

          // Activity & Ads Counters
          adsWatchedToday: 0,
          totalAdsWatched: 0,
          adsWatchedForWithdrawal: 0,
          hasWatchedAdForPromo: false,

          // Referral tracking
          activeReferralsCount: 0,
          isReferralRewarded: false,
          'referralStats.level1Earnings': 0,
          'referralStats.level2Earnings': 0,
          'referralStats.level3Earnings': 0,
          'referralStats.level4Earnings': 0,
          'referralStats.totalEarnings': 0,

          // Reset passive mining clock to now
          lastClaimAt: new Date(),
        },
      }
    );

    console.log(`✅ Successfully reset ${userResetResult.matchedCount} user record(s) (Modified: ${userResetResult.modifiedCount}).`);

    // 2. Clear all test withdrawal requests to reset global withdrawals stat
    console.log('⏳ 2. Clearing test withdrawal requests...');
    const withdrawalDeleteResult = await WithdrawalRequest.deleteMany({});
    console.log(`✅ Cleared ${withdrawalDeleteResult.deletedCount} withdrawal request record(s).`);

    // 3. Reset promo code redemption counters if any
    console.log('⏳ 3. Resetting promo code usage stats...');
    const promoResetResult = await PromoCode.updateMany(
      {},
      {
        $set: {
          usedCount: 0,
          usedBy: [],
        },
      }
    );
    console.log(`✅ Reset usage for ${promoResetResult.modifiedCount} promo code(s).`);

    // 4. Verify & re-initialize global SystemConfig
    console.log('⏳ 4. Resetting global statistics configuration...');
    await SystemConfig.deleteMany({});
    const newConfig = await SystemConfig.getOrCreateConfig();
    console.log(`✅ Global system settings re-initialized (Key: ${newConfig.key}).`);

    // 5. Calculate and display final statistics
    const remainingUsers = await User.countDocuments({});
    console.log('\n====================================================');
    console.log('🎉 OFFICIAL LAUNCH DATABASE RESET COMPLETE!');
    console.log(`👥 Total Users Retained: ${remainingUsers}`);
    console.log('💎 All Users Balances: 0.0000 TON');
    console.log('🎯 All Users Points: 0 PTS');
    console.log('🤖 All Users Active Miners/Rigs: 0');
    console.log('📊 Global Deposits & Withdrawals: 0 TON');
    console.log('====================================================\n');
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  }
}

resetLaunchDatabase();
