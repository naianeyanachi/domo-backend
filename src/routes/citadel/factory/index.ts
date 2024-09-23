import express, { Router, Request, Response } from 'express';
import db from '../../../models';

const router: Router = express.Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
  try {
    const citadel = await db.Citadel.findByPk(req.params.id);
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

router.post('/start', async (req: Request, res: Response) => {
  try {
    const citadel = await db.Citadel.findByPk(req.params.id, {
      include: [{ model: db.Factory, as: 'factory' }]
    });
    if (!citadel) {
      return res.status(404).json({ message: 'Citadel not found' });
    }

    await citadel.updateCitadel(db);

    const factory = citadel.factory;
    await factory.start(db, citadel);

    const updatedCitadel = await db.Citadel.findByPk(req.params.id, {
      include: [
        { model: db.Collector, as: 'collector' },
        { model: db.Factory, as: 'factory' }
      ]
    });

    return res.json(updatedCitadel);
  } catch (error: unknown) {
    console.error('Error starting factory:', error);
    if (error instanceof Error) {
      res
        .status(400)
        .json({ message: 'Failed to start factory', error: error.message });
    } else {
      res
        .status(400)
        .json({
          message: 'Failed to start factory',
          error: 'An unknown error occurred'
        });
    }
  }
});

export default router;
