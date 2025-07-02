const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require('./routes/UserRoutes');

app.use(express.json());
app.use('/api/user', userRoutes); 

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log('🚀 Server running');
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
