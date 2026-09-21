import assert from 'assert';
import config from '../src/config/index.js';
import User from '../src/models/User.js';

console.log('🧪 Running Business Logic & Schema Verification Tests...\n');

// 1. Verify Rig Tiers Configuration
console.log('Test 1: Verifying Rig Tiers & Points Math');
const expectedPrices = [1, 3, 5, 10, 25, 50, 100];
assert.strictEqual(config.rigTiers.length, expectedPrices.length, 'Rig tiers length mismatch');
config.rigTiers.forEach((rig, idx) => {
  const price = expectedPrices[idx];
  assert.strictEqual(rig.costTon, price);
  assert.strictEqual(rig.isLifetime, true);
  const expectedPoints = price * 1100;
  assert.strictEqual(rig.pointsReward, expectedPoints, `Points reward mismatch for ${price} TON`);
});
console.log('✅ Rig tiers lifetime points upgrades (1100 pts / 1 TON) verified.');

// 2. Test Mining Rate Calculation on User Model
console.log('\nTest 2: Verifying Dynamic Mining Rate Calculation');
const mockUser = new User({
  telegramId: 12345678,
  username: 'test_miner',
  totalPoints: 50, // 50 points * 0.0001 = 0.005 TON/day
  rigs: [
    {
      tierId: 'rig_1ton',
      costTon: 1,
      dailyYieldTon: 0.11, // 11% of 1 TON
      status: 'active',
      expiresAt: new Date(Date.now() + 10 * 86400000),
    },
    {
      tierId: 'rig_10ton',
      costTon: 10,
      dailyYieldTon: 1.10, // 11% of 10 TON
      status: 'active',
      expiresAt: new Date(Date.now() + 10 * 86400000),
    },
    {
      tierId: 'rig_5ton',
      costTon: 5,
      dailyYieldTon: 0.55,
      status: 'expired', // Expired rig should NOT count!
      expiresAt: new Date(Date.now() - 1000),
    },
  ],
});

// Base = 0.001
// Points = 50 * 0.0001 = 0.005
// Active Rigs = 0.11 + 1.10 = 1.21
// Total Expected = 0.001 + 0.005 + 1.21 = 1.216
const calculatedRate = mockUser.calculateDailyMiningRate();
assert.strictEqual(calculatedRate, 1.216, `Expected rate 1.216, got ${calculatedRate}`);
console.log(`✅ Daily mining rate math exact: Base (0.001) + Points (0.005) + Active Rigs (1.21) = ${calculatedRate} TON/day`);

// 3. Test Withdrawal Fee Calculation
console.log('\nTest 3: Verifying Withdrawal Fee (5%) & Minimums');
const amount = 10;
const fee = Number(((amount * config.withdrawals.feePercent) / 100).toFixed(6));
const net = Number((amount - fee).toFixed(6));
assert.strictEqual(fee, 0.5, 'Fee should be 0.5 TON');
assert.strictEqual(net, 9.5, 'Net amount should be 9.5 TON');
assert.strictEqual(config.withdrawals.minAmountTon, 0.1, 'Min withdrawal must be 0.1 TON');
assert.strictEqual(config.withdrawals.adsRequiredForWithdrawal, 15, 'Must require 15 ads for withdrawal');
assert.strictEqual(config.withdrawals.requireRigForWithdrawal, false, 'Rig requirement toggle is disabled by default');
console.log(`✅ Withdrawal fees & limits verified (10 TON -> 0.5 fee, 9.5 net, min 0.1, 15 ads required, rig toggle: false).`);

// 4. Test Ads & Anti-Cheat Settings
console.log('\nTest 4: Verifying Ads Limits & Anti-Cheat Configuration');
assert.strictEqual(config.ads.maxDailyAds, 40, 'Max daily ads should be 40');
assert.strictEqual(config.ads.minDurationSeconds, 15, 'Anti-cheat duration should be 15s');
assert.strictEqual(config.ads.adsForActiveReferral, 10, 'Active referral requires 10 ads');
assert.strictEqual(config.ads.referralRewardPoints, 10, 'Referral rewards 10 points');
console.log('✅ Ads limits, anti-cheat (15s minimum), and referral rules verified.');

console.log('\n🎉 ALL LOGIC AND SCHEMA TESTS PASSED SUCCESSFULLY!');
process.exit(0);
