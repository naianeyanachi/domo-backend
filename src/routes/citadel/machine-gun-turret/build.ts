import { Request, Response } from 'express'
import db from '../../../models'
import { StructureType } from '../../../models/structure'

export const build = async (req: Request, res: Response) => {
  try {
    const citadel = await db.Citadel.getCitadel(db, req.params.id)
    if (!citadel) {
      return res.status(404).json({ message: 'Citadel not found' })
    }

    await citadel.updateCitadel(db)

    if (!citadel.build[StructureType.MACHINE_GUN_TURRET]) {
      return res
        .status(400)
        .json({ message: 'Machine gun turret cannot be built' })
    }

    const idleState = await db.State.getOKState()
    await db.MachineGunTurret.create({
      idCitadel: citadel.id,
      level: 1,
      idState: idleState.id,
    })

    const updatedCitadel = await db.Citadel.getCitadel(db, req.params.id)
    return res.json(updatedCitadel)
  } catch (error: unknown) {
    console.error('Error building machine gun turret:', error)
    if (error instanceof Error) {
      res.status(400).json({
        message: 'Failed to build machine gun turret',
        error: error.message,
      })
    } else {
      res.status(400).json({
        message: 'Failed to build machine gun turret',
        error: 'An unknown error occurred',
      })
    }
  }
}
