const User = require('../models/User');

const seedAdmin = async () => {
  try {
    // Check if an admin user already exists
    const adminExists = await User.findOne({ role: 'Admin' });

    if (adminExists) {
      console.log('Admin already exists.');
      return;
    }

    // If no admin exists, create one from .env variables
    const adminData = {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      phoneNumber: process.env.ADMIN_PHONE_NUMBER,
      role: 'Admin'
    };
    
    // The 'pre.save' hook in User.js will hash the password automatically
    await User.create(adminData);
    console.log('Admin user created successfully.');

  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
};

module.exports = seedAdmin;