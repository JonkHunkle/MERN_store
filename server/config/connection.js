import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
dotenv.config()
mongoose.set('strictQuery', false);
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/antiqueStore',
  { useNewUrlParser: true, useUnifiedTopology: true }
  );
export default mongoose.connection;
