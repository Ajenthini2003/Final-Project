import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Simple test routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    _id: '1',
    name: 'Test User',
    email: req.body.email,
    token: 'test-token-' + Date.now()
  });
});

app.post('/api/auth/signup', (req, res) => {
  res.status(201).json({
    _id: '2',
    name: req.body.name,
    email: req.body.email,
    token: 'test-token-' + Date.now()
  });
});

app.get('/api/plans', (req, res) => {
  res.json([
    { _id: '1', name: 'Basic Plan', price: 999, duration: 'monthly' },
    { _id: '2', name: 'Premium Plan', price: 1999, duration: 'monthly' }
  ]);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   http://127.0.0.1:${PORT}`);
  console.log(`   http://0.0.0.0:${PORT}`);
});