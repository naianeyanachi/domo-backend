import express, { Router, Request, Response } from 'express';
import db from '../../../models'

const router: Router = express.Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
  try {
    const citadel = await db.Citadel.findByPk(req.params.id);
    if (!citadel) {
      return res.status(404).json({ message: 'Citadel not found' });
    }

    let collector = await db.Collector.findOne({
      where: { idCitadel: parseInt(citadel.id) },
      include: [{ model: db.State, as: 'state' }]
    });

    if (!collector) {
      const idleState = await db.State.getOKState();
      await db.Collector.create({
        idCitadel: citadel.id,
        level: 1,
        idState: idleState.id,
        health: 100,
      })
      collector = await db.Collector.findOne({
        where: { idCitadel: citadel.id },
        include: [{ model: db.State, as: 'state' }]
      });
    }

    res.json(collector);
  } catch (error) {
    console.error('Error fetching collector:', error);
    res.status(500).json({ message: 'Failed to fetch collector', error: 'An error occurred' });
  }
});

router.post('/start', async (req: Request, res: Response) => {
  try {
    const citadel = await db.Citadel.findByPk(req.params.id);
    if (!citadel) {
      return res.status(404).json({ message: 'Citadel not found' });
    }

    let collector = await db.Collector.findOne({
      where: { idCitadel: parseInt(citadel.id) },
      include: [{ model: db.State, as: 'state' }]
    });

    if (!collector) {
      const idleState = await db.State.getOKState();
      await db.Collector.create({
        idCitadel: citadel.id,
        level: 1,
        idState: idleState.id,
        health: 100,
      })
      collector = await db.Collector.findOne({
        where: { idCitadel: citadel.id },
        include: [
          { model: db.State, as: 'state' },
          { model: db.Citadel, as: 'citadel' }
        ]
      });
    }

    await collector.collect(db, citadel)
    await collector.start(db, citadel)
    const updatedCitadel = await db.Citadel.findByPk(req.params.id, {
      include: [
        { model: db.Collector, as: 'collector' },
        { model: db.Factory, as: 'factory' },
      ]
    })

    return res.json(updatedCitadel);

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