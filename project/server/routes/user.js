import express from 'express';
import Pet from '../models/Pet.js';
import LostPet from '../models/LostPet.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user's pets
router.get('/pets', auth, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.userId })
      .sort({ createdAt: -1 });
    
    res.json(pets);
  } catch (error) {
    console.error('Get user pets error:', error);
    res.status(500).json({ message: 'Error fetching user pets' });
  }
});

// Get user's lost pet reports
router.get('/lost-pets', auth, async (req, res) => {
  try {
    const lostPets = await LostPet.find({ reporter: req.userId })
      .sort({ createdAt: -1 });
    
    res.json(lostPets);
  } catch (error) {
    console.error('Get user lost pets error:', error);
    res.status(500).json({ message: 'Error fetching user lost pets' });
  }
});

export default router;