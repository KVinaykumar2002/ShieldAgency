const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Admin = require('./models/adminModel');
const Guard = require('./models/guardModel');
const Service = require('./models/serviceModel');
const Testimonial = require('./models/testimonialModel');
const JobOpening = require('./models/jobModel');
const Certification = require('./models/certificationModel');
const GalleryItem = require('./models/galleryItemModel');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const guards = JSON.parse(fs.readFileSync(`${__dirname}/_data/guards.json`, 'utf-8'));
const services = JSON.parse(fs.readFileSync(`${__dirname}/_data/services.json`, 'utf-8'));
const testimonials = JSON.parse(fs.readFileSync(`${__dirname}/_data/testimonials.json`, 'utf-8'));
const jobs = JSON.parse(fs.readFileSync(`${__dirname}/_data/jobs.json`, 'utf-8'));
const certifications = JSON.parse(fs.readFileSync(`${__dirname}/_data/certifications.json`, 'utf-8'));
const galleryItems = JSON.parse(fs.readFileSync(`${__dirname}/_data/gallery.json`, 'utf-8'));

// Import into DB
const importData = async () => {
  try {
    // Create default admin credentials in database
    const defaultAdmin = {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@shield.com',
      password: process.env.ADMIN_PASSWORD || 'admin123'
    };
    
    // Check if admin exists, if not create one
    const existingAdmin = await Admin.findOne({ email: defaultAdmin.email });
    if (!existingAdmin) {
      await Admin.create(defaultAdmin);
      console.log('Default admin created...');
    } else {
      console.log('Admin already exists...');
    }
    
    await Guard.create(guards);
    await Service.create(services);
    await Testimonial.create(testimonials);
    await JobOpening.create(jobs);
    await Certification.create(certifications);
    await GalleryItem.create(galleryItems);
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    // Note: Admin deletion is commented out for safety
    // Uncomment if you really want to delete all admins
    // await Admin.deleteMany();
    await Guard.deleteMany();
    await Service.deleteMany();
    await Testimonial.deleteMany();
    await JobOpening.deleteMany();
    await Certification.deleteMany();
    await GalleryItem.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === 'import') {
  importData();
} else if (process.argv[2] === 'destroy') {
  deleteData();
} else {
    console.log('Please use "import" or "destroy" as an argument.');
    process.exit();
}