const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/adminModel');

// load env variables
dotenv.config();

const newAdmin = {
  name: 'Admin',
  email: 'admin@shield.com',
  password: 'admin123'
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shieldagency');

    const existing = await Admin.findOne({ email: newAdmin.email });
    if (existing) {
      console.log('Admin already exists with email', newAdmin.email);
    } else {
      await Admin.create(newAdmin);
      console.log('Admin created:', newAdmin.email, '/', newAdmin.password);
    }
  } catch (err) {
    console.error('Error creating admin:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();

