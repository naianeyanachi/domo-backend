import express, { Router, Request, Response } from 'express'
import db from '../../../models'
import { build } from './build'

const router: Router = express.Router({ mergeParams: true })

router.get('/', async (req: Request, res: Response) => {
  try {
    const citadel = await db.Citadel.getCitadel(db, req.params.id)
    if (!citadel) {
      return res.status(404).json({ message: 'Citadel not found' })
    }

    await citadel.updateCitadel(db)
    let machineGunTurret = citadel.machineGunTurret

    if (!machineGunTurret) {
      return res.status(404).json({ message: 'Machine gun turret is not built' })
    }

    res.json(machineGunTurret)
  } catch (error) {
    console.error('Error fetching machine gun turret:', error)
    res.status(500).json({
      message: 'Failed to fetch machine gun turret',
      error: 'An error occurred',
    })
  }
})

router.post('/build', build)

export default router
