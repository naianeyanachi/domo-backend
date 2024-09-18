import express, { Router, Request, Response } from 'express';
import Citadel from '../models/citadel';
import db from '../models'

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Get all citadels' });
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const citadel = await Citadel(db.sequelize).findByPk(req.params.id);
    if (!citadel) {
      return res.status(404).json({ message: 'Citadel not found' });
    }
    res.json(citadel);
  } catch (error) {
    console.error('Error fetching citadel:', error);
    res.status(500).json({ message: 'Failed to fetch citadel', error: 'An error occurred' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const newCitadel = await Citadel(db.sequelize).create(req.body);
    res.status(201).json(newCitadel);
  } catch (error: unknown) {
    console.error('Error creating citadel:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: 'Failed to create citadel', error: error.message });
    } else {
      res.status(400).json({ message: 'Failed to create citadel', error: 'An unknown error occurred' });
    }
  }
});

router.put('/:id', (req: Request, res: Response) => {
  res.json({ message: `Update citadel with ID ${req.params.id}` });
});

router.delete('/:id', (req: Request, res: Response) => {
  res.json({ message: `Delete citadel with ID ${req.params.id}` });
});

export default router;