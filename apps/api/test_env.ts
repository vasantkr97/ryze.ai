import dotenv from 'dotenv';

console.log('Current directory:', process.cwd());
const result = dotenv.config();
console.log('Dotenv result:', result);
console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL);
