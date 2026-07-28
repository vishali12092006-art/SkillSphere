require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const MatchRequest = require('./models/MatchRequest');
const Session = require('./models/Session');
const Review = require('./models/Review');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillsphere');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      MatchRequest.deleteMany({}),
      Session.deleteMany({}),
      Review.deleteMany({}),
    ]);
    console.log('Cleared existing data.');

    // 1. Create Users (Admin + Demo Users)
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@skillsphere.com',
      password: 'password123',
      role: 'admin',
      city: 'San Francisco',
      bio: 'Platform administrator keeping SkillSphere safe and vibrant.',
    });

    const user1 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@example.com',
      password: 'password123',
      city: 'Berlin',
      bio: 'Full-stack engineer with 6+ years experience in React & Node. Passionate about learning conversational Spanish and jazz piano.',
      experienceLevel: 'Advanced',
      availability: 'Flexible',
      skillsTeach: [
        { name: 'React.js', category: 'Technology', level: 'Expert' },
        { name: 'Node.js & Express', category: 'Technology', level: 'Advanced' },
        { name: 'TypeScript', category: 'Technology', level: 'Intermediate' },
      ],
      skillsLearn: [
        { name: 'Spanish Conversation', category: 'Language', level: 'Beginner' },
        { name: 'Jazz Piano', category: 'Music', level: 'Beginner' },
      ],
      averageRating: 4.9,
      reviewCount: 3,
    });

    const user2 = await User.create({
      name: 'Marcus Chen',
      email: 'marcus@example.com',
      password: 'password123',
      city: 'Toronto',
      bio: 'UI/UX Designer and Figma enthusiast. Love creating clean design systems and learning frontend development.',
      experienceLevel: 'Intermediate',
      availability: 'Weekends',
      skillsTeach: [
        { name: 'UI/UX Design', category: 'Design', level: 'Expert' },
        { name: 'Figma Systems', category: 'Design', level: 'Advanced' },
      ],
      skillsLearn: [
        { name: 'React.js', category: 'Technology', level: 'Beginner' },
        { name: 'Python Basics', category: 'Technology', level: 'Beginner' },
      ],
      averageRating: 4.8,
      reviewCount: 2,
    });

    const user3 = await User.create({
      name: 'Sofia Alvarez',
      email: 'sofia@example.com',
      password: 'password123',
      city: 'Madrid',
      bio: 'Native Spanish speaker and language coach. Eager to master UI Design principles and modern web development.',
      experienceLevel: 'Expert',
      availability: 'Evenings',
      skillsTeach: [
        { name: 'Spanish Conversation', category: 'Language', level: 'Expert' },
        { name: 'Business Spanish', category: 'Language', level: 'Advanced' },
      ],
      skillsLearn: [
        { name: 'UI/UX Design', category: 'Design', level: 'Beginner' },
      ],
      averageRating: 5.0,
      reviewCount: 4,
    });

    const user4 = await User.create({
      name: 'David Kim',
      email: 'david@example.com',
      password: 'password123',
      city: 'Seattle',
      bio: 'Data Scientist passionate about Python, ML models, and digital photography.',
      experienceLevel: 'Advanced',
      availability: 'Weekdays',
      skillsTeach: [
        { name: 'Python Basics', category: 'Technology', level: 'Expert' },
        { name: 'Machine Learning', category: 'Technology', level: 'Advanced' },
      ],
      skillsLearn: [
        { name: 'Digital Photography', category: 'Arts', level: 'Beginner' },
      ],
      averageRating: 4.7,
      reviewCount: 1,
    });

    console.log('Users created successfully.');

    // 2. Create Match Requests
    const req1 = await MatchRequest.create({
      sender: user2._id,
      receiver: user1._id,
      skillRequested: 'React.js',
      message: 'Hi Elena! I would love to learn React from you in exchange for UI/UX & Figma design sessions.',
      status: 'accepted',
    });

    const req2 = await MatchRequest.create({
      sender: user1._id,
      receiver: user3._id,
      skillRequested: 'Spanish Conversation',
      message: 'Hola Sofia! Looking to practice my conversational Spanish.',
      status: 'accepted',
    });

    const req3 = await MatchRequest.create({
      sender: user4._id,
      receiver: user2._id,
      skillRequested: 'UI/UX Design',
      message: 'Hey Marcus, I can teach you Python in exchange for UI design basics!',
      status: 'pending',
    });

    console.log('Match requests created.');

    // 3. Create Sessions
    const sess1 = await Session.create({
      matchRequest: req1._id,
      requester: user2._id,
      receiver: user1._id,
      skill: 'React.js',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days in future
      status: 'upcoming',
    });

    const sess2 = await Session.create({
      matchRequest: req2._id,
      requester: user1._id,
      receiver: user3._id,
      skill: 'Spanish Conversation',
      meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days in past
      status: 'completed',
    });

    console.log('Sessions created.');

    // 4. Create Reviews
    await Review.create({
      reviewer: user1._id,
      reviewedUser: user3._id,
      session: sess2._id,
      rating: 5,
      comment: 'Sofia is an amazing teacher! Very patient, engaging, and gave great actionable tips for fluent pronunciation.',
    });

    console.log('Reviews created.');
    console.log('\n--- Database Seeding Complete! ---');
    console.log('Demo Accounts:');
    console.log('Admin: admin@skillsphere.com / password123');
    console.log('User 1: elena@example.com / password123');
    console.log('User 2: marcus@example.com / password123');
    console.log('User 3: sofia@example.com / password123');
    console.log('User 4: david@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
