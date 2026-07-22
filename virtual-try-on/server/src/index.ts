import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tryonRouter from './routes/tryon.js'; // Ensure file extension handles NodeNext modules

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Register your AI generation middleware routing tree
app.use('/api/tryon', tryonRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running smoothly' });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Try-On Backend listening on http://localhost:${PORT}`);
});