const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/ProductRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Auth Routes
app.use('/api/auth', authRoutes);

// Product Routes
app.use('/api/products', productRoutes); // ✅ Added product routes

// 🔐 Protected route example
app.post('/api/protected', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const idToken = authHeader.startsWith('Bearer ')
    ? authHeader.split('Bearer ')[1]
    : null;

  if (!idToken) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    res.json({ success: true, uid: decoded.uid });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
