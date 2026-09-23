import mongoose from 'mongoose';
import config from '../config/index.js';
import User from '../models/User.js';

async function resetAllPoints() {
  try {
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(config.database.uri);
    console.log('Connected.');

    const totalBefore = await User.countDocuments();
    const withPoints = await User.countDocuments({
      $or: [{ totalPoints: { $gt: 0 } }, { points: { $gt: 0 } }],
    });

    console.log(`Total registered users: ${totalBefore}`);
    console.log(`Users with points > 0: ${withPoints}`);

    const result = await User.updateMany(
      {},
      {
        $set: {
          totalPoints: 0,
          points: 0,
        },
      }
    );

    console.log(`✅ Successfully reset points for ${result.modifiedCount} users to 0!`);

    const sample = await User.find({}, 'telegramId username totalPoints points').limit(5);
    console.log('Sample users after reset:', JSON.stringify(sample, null, 2));

    await mongoose.disconnect();
    console.log('Disconnected. Operation complete.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting points:', error);
    process.exit(1);
  }
}

resetAllPoints();
