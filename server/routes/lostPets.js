import express from 'express';
import multer from 'multer';
import LostPet from '../models/LostPet.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all lost/found pets
router.get('/', async (req, res) => {
  try {
    const { status, type, location, search } = req.query;
    let query = {};

    // Apply filters
    if (status) query.status = status;
    if (type) query.type = type;
    if (location) query.location = new RegExp(location, 'i');

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { breed: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') }
      ];
    }

    const lostPets = await LostPet.find(query)
      .populate('reporter', 'name')
      .sort({ createdAt: -1 });

    res.json(lostPets);
  } catch (error) {
    console.error('Get lost pets error:', error);
    res.status(500).json({ message: 'Error fetching lost pets' });
  }
});

// Create new lost/found pet report
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const lostPetData = {
      ...req.body,
      reporter: req.userId,
      images: [] // In a real app, you'd upload to cloud storage and store URLs
    };

    // Handle nested contactInfo object
    if (req.body['contactInfo[name]']) {
      lostPetData.contactInfo = {
        name: req.body['contactInfo[name]'],
        phone: req.body['contactInfo[phone]'],
        email: req.body['contactInfo[email]']
      };
      
      // Clean up the flat properties
      delete lostPetData['contactInfo[name]'];
      delete lostPetData['contactInfo[phone]'];
      delete lostPetData['contactInfo[email]'];
    }

    // For demo purposes, we'll use placeholder images
    if (req.files && req.files.length > 0) {
      lostPetData.images = req.files.map((_, index) => 
        `https://images.pexels.com/photos/${1108099 + index}/pexels-photo-${1108099 + index}.jpeg`
      );
    }

    const lostPet = new LostPet(lostPetData);
    await lostPet.save();

    const populatedLostPet = await LostPet.findById(lostPet._id)
      .populate('reporter', 'name');

    res.status(201).json(populatedLostPet);
  } catch (error) {
    console.error('Create lost pet error:', error);
    res.status(500).json({ message: 'Error creating lost pet report' });
  }
});

export default router;