const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'manager'],
    default: 'user',
  },
  avatar: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to get public user data
userSchema.methods.toPublicJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    company: this.company,
    role: this.role,
    avatar: this.avatar,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ company: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
