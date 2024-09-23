import express, { Router, Request, Response } from 'express';
import db from '../../../models';
import { manufacture } from './manufacture';

const router: Router = express.Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
  try {
    const citadel = await db.Citadel.getCitadel(db, req.params.id)
    if (!citadel) {
      return res.status(404).json({ message: 'Citadel not found' });
    }

    let factory = await db.Factory.findOne({
      where: { idCitadel: parseInt(citadel.id) },
      include: [{ model: db.State, as: 'state' }]
    });

    if (!factory) {
      const idleState = await db.State.getOKState();
      await db.Factory.create({
        idCitadel: citadel.id,
        level: 1,
        idState: idleState.id,
        health: 100
      });
      factory = await db.Factory.findOne({
        where: { idCitadel: citadel.id },
        include: [{ model: db.State, as: 'state' }]
      });
    }

    res.json(factory);
  } catch (error) {
    console.error('Error fetching factory:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch factory', error: 'An error occurred' });
  }
});

router.post('/manufacture', manufacture);

export default router;
