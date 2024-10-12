const mongoose = require('mongoose');

async function connectDB() {
    try {
      await mongoose.connect('mongodb://localhost:27017/train_tickets', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
      throw error;
    }
  }


module.exports = connectDB ;
