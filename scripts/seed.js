// Run: node scripts/seed.js
// Seeds the database with sample bugs for manual testing

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bug-tracker';

const bugSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    severity: String,
    status: String,
  },
  { timestamps: true }
);

const Bug = mongoose.model('Bug', bugSchema);

const sampleBugs = [
  { title: 'Login page crashes on submit', description: 'Happens on Chrome 120', severity: 'Critical', status: 'Open' },
  { title: 'Dashboard loads slowly', description: 'Takes over 5 seconds', severity: 'High', status: 'In Progress' },
  { title: 'Typo in footer text', description: '"Copywright" should be "Copyright"', severity: 'Low', status: 'Resolved' },
  { title: 'Button color wrong on hover', description: 'Should be blue, shows green', severity: 'Medium', status: 'Open' },
  { title: 'API returns 500 on empty search', description: 'Search with blank query fails', severity: 'High', status: 'Open' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  await Bug.deleteMany({});
  const inserted = await Bug.insertMany(sampleBugs);
  console.log(`Seeded ${inserted.length} bugs.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
