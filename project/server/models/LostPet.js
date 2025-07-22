import mongoose from 'mongoose';

const lostPetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other']
  },
  breed: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'large', 'extra-large']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  lastSeen: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    required: true,
    enum: ['lost', 'found']
  },
  contactInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    }
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('LostPet', lostPetSchema);