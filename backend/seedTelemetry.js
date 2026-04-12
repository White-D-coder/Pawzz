import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Listing } from './models/Listing.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, './.env') });

async function seedTelemetry() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected.');

    // 1. Seed Telemetry for Vet Clinics & NGOs
    const listings = await Listing.find({});
    console.log(`📊 Updating ${listings.length} listings with telemetry...`);

    for (const listing of listings) {
      const telemetry = {
        rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1), // Random rating between 3.5 and 5.0
        reviews_count: Math.floor(Math.random() * 500) + 10,
        total_bookings: Math.floor(Math.random() * 1000) + 50
      };
      await Listing.findByIdAndUpdate(listing._id, { telemetry });
    }
    console.log('✅ Listings telemetry updated.');

    // 2. Seed Stats for Volunteers
    const volunteers = await User.find({ role: 'Volunteer / City Lead' });
    console.log(`📊 Updating ${volunteers.length} volunteers with stats...`);

    for (const volunteer of volunteers) {
      const volunteer_stats = {
        active_rescues: Math.floor(Math.random() * 10),
        hours_logged: Math.floor(Math.random() * 200) + 20
      };
      await User.findByIdAndUpdate(volunteer._id, { volunteer_stats });
    }
    console.log('✅ Volunteers stats updated.');

    console.log('🚀 Telemetry seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

seedTelemetry();
