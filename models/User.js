import mongoose from 'mongoose';
import { roles } from '../utils/constants';

const { String } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String, required: true, enum: [roles.USER, roles.ADMIN, roles.ROOT], default: roles.USER,
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
