import express, { Router, Request, Response } from 'express';
import db from '../models'

const router: Router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const citadel = await db.Citadel.findByPk(req.params.id, {
      include: [
        { model: db.Collector, as: 'collector' },
        { model: db.Factory, as: 'factory' },
      ]
    });
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
    const newCitadel = await db.Citadel.create(req.body);
    const idleState = await db.State.getOKState();
    await db.Collector.create({
      idCitadel: newCitadel.id,
      level: 1,
      idState: idleState.id,
      health: 100,
    })
    await db.Factory.create({
      idCitadel: newCitadel.id,
      level: 1,
      idState: idleState.id,
      health: 100,
    })
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

export default router;