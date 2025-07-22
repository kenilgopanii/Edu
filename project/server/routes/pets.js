import express from 'express';
import multer from 'multer';
import Pet from '../models/Pet.js';
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

// Get all pets
router.get('/', async (req, res) => {
  try {
    const { type, breed, age, size, location, search } = req.query;
    let query = { status: 'available' };

    // Apply filters
    if (type) query.type = type;
    if (breed) query.breed = new RegExp(breed, 'i');
    if (size) query.size = size;
    if (location) query.location = new RegExp(location, 'i');
    
    if (age) {
      const ageRange = age.split('-');
      if (ageRange.length === 2) {
        query.age = { $gte: parseInt(ageRange[0]), $lte: parseInt(ageRange[1]) };
      }
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { breed: new RegExp(search, 'i') },
        { type: new RegExp(search, 'i') }
      ];
    }

    const pets = await Pet.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(pets);
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ message: 'Error fetching pets' });
  }
});

// Get single pet
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('owner', 'name email phone');
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json(pet);
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({ message: 'Error fetching pet' });
  }
});

// Create new pet
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const petData = {
      ...req.body,
      owner: req.userId,
      images: [] // In a real app, you'd upload to cloud storage and store URLs
    };

    // Convert string booleans to actual booleans
    ['vaccinated', 'neutered', 'goodWithKids', 'goodWithPets'].forEach(field => {
      if (petData[field] === 'true') petData[field] = true;
      if (petData[field] === 'false') petData[field] = false;
    });

    // For demo purposes, we'll use placeholder images
    if (req.files && req.files.length > 0) {
      petData.images = req.files.map((_, index) => 
        `https://images.pexels.com/photos/${1108099 + index}/pexels-photo-${1108099 + index}.jpeg`
      );
    }

    const pet = new Pet(petData);
    await pet.save();

    const populatedPet = await Pet.findById(pet._id)
      .populate('owner', 'name email phone');

    res.status(201).json(populatedPet);
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({ message: 'Error creating pet listing' });
  }
});

// Express interest in a pet
router.post('/:id/interest', auth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if user already expressed interest
    const alreadyInterested = pet.interestedUsers.some(
      interest => interest.user.toString() === req.userId
    );

    if (alreadyInterested) {
      return res.status(400).json({ message: 'You have already expressed interest in this pet' });
    }

    pet.interestedUsers.push({
      user: req.userId,
      date: new Date()
    });

    await pet.save();

    res.json({ message: 'Interest expressed successfully' });
  } catch (error) {
    console.error('Express interest error:', error);
    res.status(500).json({ message: 'Error expressing interest' });
  }
});

export default router;