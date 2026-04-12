import mongoose from 'mongoose';
import { Listing } from './backend/models/Listing.js';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const seedListings = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const ownerId = new mongoose.Types.ObjectId('67098e9b6a09880012345678'); // Just a dummy ID that looks real

        const sampleListings = [
            {
                ownerId,
                type: 'clinic',
                name: 'Blue Cross Animal Hospital',
                location: { address: 'Colaba Main Road', city: 'Mumbai', coords: { type: 'Point', coordinates: [72.8258, 18.9220] } },
                services: ['Surgery', 'Vaccination', 'Dentistry'],
                price: 500,
                imageUrl: '/image/1.jpeg',
                telemetry: { rating: 4.8, reviews_count: 120, years_experience: 12 }
            },
            {
                ownerId,
                type: 'clinic',
                name: 'Pawfect Health Center',
                location: { address: 'Bandra West', city: 'Mumbai', coords: { type: 'Point', coordinates: [72.8339, 19.0522] } },
                services: ['Wellness Exam', 'Grooming', 'Pharmacy'],
                price: 400,
                imageUrl: '/image/ Dog.jpeg', // Fixed the space in name if possible or just use existing
                telemetry: { rating: 4.5, reviews_count: 85, years_experience: 8 }
            },
            {
                ownerId,
                type: 'ngo',
                name: 'Save A Life Shelter',
                location: { address: 'Andheri East', city: 'Mumbai', coords: { type: 'Point', coordinates: [72.8697, 19.1136] } },
                services: ['Rescue', 'Adoption', 'Sterilization'],
                price: 0,
                imageUrl: '/image/ Dog.jpeg',
                telemetry: { rating: 4.9, reviews_count: 240, years_experience: 15 }
            },
            {
                ownerId,
                type: 'clinic',
                name: 'Happy Paws Vet',
                location: { address: 'Salt Lake Sector V', city: 'Kolkata', coords: { type: 'Point', coordinates: [88.4339, 22.5735] } },
                services: ['Internal Medicine', 'X-Ray'],
                price: 600,
                imageUrl: '/image/1.jpeg',
                telemetry: { rating: 4.2, reviews_count: 45, years_experience: 6 }
            },
            {
                ownerId,
                type: 'ngo',
                name: 'Kolkata Animal Rescue',
                location: { address: 'New Town', city: 'Kolkata', coords: { type: 'Point', coordinates: [88.4667, 22.5833] } },
                services: ['Ambulance', 'Feeding'],
                price: 0,
                imageUrl: '/image/thumb.jpeg',
                telemetry: { rating: 4.7, reviews_count: 150, years_experience: 10 }
            },
            {
                ownerId,
                type: 'clinic',
                name: 'Vets For Pets',
                location: { address: 'Indiranagar', city: 'Bangalore', coords: { type: 'Point', coordinates: [77.6413, 12.9719] } },
                services: ['Emergency Care', 'Laboratory'],
                price: 750,
                imageUrl: '/image/1.jpeg',
                telemetry: { rating: 4.6, reviews_count: 92, years_experience: 9 }
            },
            {
                ownerId,
                type: 'ngo',
                name: 'Compassion Trust',
                location: { address: 'Koramangala', city: 'Bangalore', coords: { type: 'Point', coordinates: [77.6208, 12.9352] } },
                services: ['Education', 'Advocacy'],
                price: 0,
                imageUrl: '/image/ Dog.jpeg',
                telemetry: { rating: 4.4, reviews_count: 67, years_experience: 5 }
            },
            {
                ownerId,
                type: 'clinic',
                name: 'Pet Healing Clinic',
                location: { address: 'Gurgaon Sector 45', city: 'Delhi NCR', coords: { type: 'Point', coordinates: [77.0689, 28.4595] } },
                services: ['Cardiology', 'Oncology'],
                price: 900,
                imageUrl: '/image/1.jpeg',
                telemetry: { rating: 4.3, reviews_count: 38, years_experience: 14 }
            },
            {
                ownerId,
                type: 'ngo',
                name: 'Friendicos',
                location: { address: 'Defence Colony', city: 'Delhi', coords: { type: 'Point', coordinates: [77.2343, 28.5746] } },
                services: ['ABC Program', 'Spay/Neuter'],
                price: 0,
                imageUrl: '/image/thumb.jpeg',
                telemetry: { rating: 5.0, reviews_count: 1200, years_experience: 40 }
            },
            {
                ownerId,
                type: 'clinic',
                name: 'Advance Pet Care',
                location: { address: 'Banjara Hills', city: 'Hyderabad', coords: { type: 'Point', coordinates: [78.4357, 17.4156] } },
                services: ['Microchipping', 'Travel Paperwork'],
                price: 450,
                imageUrl: '/image/ami.jpeg',
                telemetry: { rating: 4.1, reviews_count: 55, years_experience: 7 }
            },
            {
                ownerId,
                type: 'clinic',
                name: 'City Animal Care',
                location: { address: 'Gachibowli', city: 'Hyderabad', coords: { type: 'Point', coordinates: [78.3489, 17.44] } },
                services: ['Vaccination', 'Consultation'],
                price: 350,
                imageUrl: '/image/1.jpeg',
                telemetry: { rating: 4.4, reviews_count: 72, years_experience: 11 }
            }
        ];

        // Clear existing listings to avoid duplicates for this task
        await Listing.deleteMany({});
        
        await Listing.insertMany(sampleListings);
        console.log('Successfully seeded 11 listings!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding:', error);
        process.exit(1);
    }
};

seedListings();
