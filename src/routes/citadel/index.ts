import express, { Router, Request, Response } from 'express';
import db from '../../models';
import collector from './collector';
import factory from './factory';

const router: Router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const citadel = await db.Citadel.getCitadel(db, req.params.id)
    if (!citadel) {
      return res.status(404).json({ message: 'Citadel not found' });
    }

    await citadel.updateCitadel(db);
    const updatedCitadel = await db.Citadel.getCitadel(db, req.params.id)

    res.json(updatedCitadel);
  } catch (error) {
    console.error('Error fetching citadel:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch citadel', error: 'An error occurred' });
  }
});

router.use('/:id/collector', collector);
router.use('/:id/factory', factory);

router.post('/', async (req: Request, res: Response) => {
  try {
    const newCitadel = await db.Citadel.create(req.body);
    const idleState = await db.State.getOKState();
    await db.Collector.create({
      idCitadel: newCitadel.id,
      level: 1,
      idState: idleState.id,
      health: 100
    });
    await db.Factory.create({
      idCitadel: newCitadel.id,
      level: 1,
      idState: idleState.id,
      health: 100
    });
    const citadel = await db.Citadel.getCitadel(db, newCitadel.id)
    res.status(201).json(citadel);
  } catch (error: unknown) {
    console.error('Error creating citadel:', error);
    if (error instanceof Error) {
      res
        .status(400)
        .json({ message: 'Failed to create citadel', error: error.message });
    } else {
      res
        .status(400)
        .json({
          message: 'Failed to create citadel',
          error: 'An unknown error occurred'
        });
    }
  }
});

export default router;
