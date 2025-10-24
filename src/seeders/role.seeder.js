// seeders/roleSeeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Role } from '../models/index.js';

dotenv.config();

const roles = [
  {
    name: 'admin',
    permissions: {
      project: ['create', 'edit', 'delete', 'view'],
      task: ['create', 'edit', 'delete', 'view'],
      member: ['add', 'remove', 'view']
    }
  },
  {
    name: 'manager',
    permissions: {
      project: ['edit', 'view'],
      task: ['create', 'edit', 'view'],
      member: ['add', 'view']
    }
  },
  {
    name: 'developer',
    permissions: {
      task: ['create', 'edit', 'view'],
      project: ['view'],
      member: ['view']
    }
  }
];

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const existing = await Role.find();
    if (existing.length > 0) {
      console.log('Roles already exist. Skipping seeding.');
    } else {
      await Role.insertMany(roles);
      console.log('✅ Roles seeded successfully!');
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Failed to seed roles:', err.message);
    process.exit(1);
  }
};

seedRoles();
