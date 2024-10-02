import { Request, Response } from 'express'
import db from '../../../models'
import { WEATHER_FORECAST } from '../../../models/structure'

export const build = async (req: Request, res: Response) => {
  try {
    const citadel = await db.Citadel.getCitadel(db, req.params.id)
    if (!citadel) {
      return res.status(404).json({ message: 'Citadel not found' })
    }

    await citadel.updateCitadel(db)

    if (!citadel.build[WEATHER_FORECAST]) {
      return res
        .status(400)
        .json({ message: 'Weather forecast cannot be built' })
    }

    const idleState = await db.State.getOKState()
    await db.WeatherForecast.create({
      idCitadel: citadel.id,
      level: 1,
      idState: idleState.id,
    })

    const updatedCitadel = await db.Citadel.getCitadel(db, req.params.id)
    return res.json(updatedCitadel)
  } catch (error: unknown) {
    console.error('Error starting factory:', error)
    if (error instanceof Error) {
      res
        .status(400)
        .json({ message: 'Failed to start factory', error: error.message })
    } else {
      res.status(400).json({
        message: 'Failed to start factory',
        error: 'An unknown error occurred',
      })
    }
  }
}
