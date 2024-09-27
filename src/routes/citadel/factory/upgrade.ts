import { Request, Response } from 'express'
import db from '../../../models'

export const upgrade = async (req: Request, res: Response) => {
  try {
    const citadel = await db.Citadel.getCitadel(db, req.params.id)
    if (!citadel) {
      return res.status(404).json({ message: 'Citadel not found' })
    }

    await citadel.updateCitadel(db)
    await citadel.factory.upgrade(db)

    const updatedCitadel = await db.Citadel.getCitadel(db, req.params.id)
    return res.json(updatedCitadel)
  } catch (error: unknown) {
    console.error('Error upgrading factory:', error)
    if (error instanceof Error) {
      res
        .status(400)
        .json({ message: 'Failed to upgrade factory', error: error.message })
    } else {
      res.status(400).json({
        message: 'Failed to upgrade factory',
        error: 'An unknown error occurred',
      })
    }
  }
}
