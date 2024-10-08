import express, { Router, Request, Response } from 'express'
import db from '../../../models'
import { manufacture } from './manufacture'
import { repair } from './repair'
import { reinforce } from './reinforce'
import { upgrade } from './upgrade'

const router: Router = express.Router({ mergeParams: true })

router.get('/', async (req: Request, res: Response) => {
  try {
    const citadel = await db.Citadel.getCitadel(db, req.params.id)
    if (!citadel) {
      return res.status(404).json({ message: 'Citadel not found' })
    }

    await citadel.updateCitadel(db)
    let factory = citadel.factory

    if (!factory) {
      const idleState = await db.State.getOKState()
      await db.Factory.create({
        idCitadel: citadel.id,
        level: 1,
        idState: idleState.id,
        health: 100,
      })
      factory = await db.Factory.findOne({
        where: { idCitadel: citadel.id },
        include: [{ model: db.State, as: 'state' }],
      })
    }

    res.json(factory)
  } catch (error) {
    console.error('Error fetching factory:', error)
    res
      .status(500)
      .json({ message: 'Failed to fetch factory', error: 'An error occurred' })
  }
})

router.post('/manufacture', manufacture)
router.post('/repair', repair)
router.post('/reinforce', reinforce)
router.post('/upgrade', upgrade)

export default router
