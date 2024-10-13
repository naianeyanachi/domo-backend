import express, { Router, Request, Response } from 'express'
import db from '../../../models'

const router: Router = express.Router({ mergeParams: true })

router.get('/', async (req: Request, res: Response) => {
  try {
    const citadel = await db.Citadel.findOne({
      where: {
        idPlayer: req.params.id,
      },
      order: [['createdAt', 'DESC']],
    })
    if (!citadel) {
      return res.status(404).json({ message: 'Hordes not found' })
    }
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const offset = (page - 1) * limit
    const hordes = await db.Horde.findAll({
      where: {
        idCitadel: citadel.id,
      },
      order: [['datetime', 'DESC']],
      include: [
        {
          model: db.HordeLog,
          as: 'logs',
          include: [
            {
              model: db.Structure,
              as: 'structure',
            },
            {
              model: db.State,
              as: 'stateFrom',
            },
            {
              model: db.State,
              as: 'stateTo',
            },
          ],
        },
      ],
      limit,
      offset,
    })
    res.json(hordes)
  } catch (error) {
    console.error('Error fetching hordes:', error)
    res
      .status(500)
      .json({ message: 'Failed to fetch hordes', error: 'An error occurred' })
  }
})

router.get('/:idHorde', async (req: Request, res: Response) => {
  try {
    const horde = await db.Horde.findByPk(req.params.idHorde, {
      order: [['datetime', 'DESC']],
      include: [
        {
          model: db.HordeEnemy,
          as: 'enemies',
          include: [
            {
              model: db.Enemy,
              as: 'enemy',
            },
          ],
        },
        {
          model: db.HordeLog,
          as: 'logs',
          include: [
            {
              model: db.Structure,
              as: 'structure',
            },
            {
              model: db.State,
              as: 'stateFrom',
            },
            {
              model: db.State,
              as: 'stateTo',
            },
          ],
        },
      ],
    })
    if (!horde) {
      return res.status(404).json({ message: 'Horde not found' })
    }
    res.json(horde)
  } catch (error) {
    console.error('Error fetching hordes:', error)
    res
      .status(500)
      .json({ message: 'Failed to fetch hordes', error: 'An error occurred' })
  }
})

export default router
