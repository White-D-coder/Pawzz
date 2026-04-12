import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Listing } from './models/Listing.js';
import { Booking } from './models/Booking.js';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB for seeding...");

  await User.deleteMany({});
  await Listing.deleteMany({});
  await Booking.deleteMany({});

  const user = await User.create({
    email: 'vetadmin@pawzz.in',
    role: 'Vet Clinic',
    profile: {
      name: 'Dr. Admin',
      phone: '9876543210'
    }
  });

  const doctors = [
    {
      ownerId: user._id,
      type: 'clinic',
      name: 'Dr. Sharma Vet Clinic',
      location: { address: '123 Pet Avenue', city: 'Indore', coords: { type: 'Point', coordinates: [75.8577, 22.7196] } },
      services: ['Vaccination', 'Surgery', 'Consultation'],
      phone: '111-222-3333',
      email: 'sharma.vet@pawzz.in',
      verification_status: 'approved'
    },
    {
      ownerId: user._id,
      type: 'clinic',
      name: 'Paws & Purrs Hospital (Dr. Gupta)',
      location: { address: '456 Bark Street', city: 'Mumbai', coords: { type: 'Point', coordinates: [72.8777, 19.0760] } },
      services: ['Grooming', 'Dental Care', 'Emergency'],
      phone: '444-555-6666',
      email: 'gupta@paws.in',
      verification_status: 'approved'
    },
    {
      ownerId: user._id,
      type: 'ngo',
      name: 'Street Dog Rescue Center',
      location: { address: '789 Hope Lane', city: 'Delhi', coords: { type: 'Point', coordinates: [77.2090, 28.6139] } },
      services: ['Adoption', 'Shelter', 'First Aid'],
      phone: '777-888-9999',
      email: 'rescue@hope.org',
      verification_status: 'approved'
    }
  ];

  await Listing.insertMany(doctors);
  console.log("Seeded " + doctors.length + " vet doctors/NGOs!");

  process.exit();
}
seed().catch(console.error);
