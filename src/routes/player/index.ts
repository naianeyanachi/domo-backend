import express, { Router, Request, Response } from 'express'
import db from '../../models'
import { isValidEmail } from '../../utils/email'

const router: Router = express.Router()

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const player = await db.Player.findByPk(req.params.id, {
      include: [
        {
          model: db.Citadel,
          as: 'citadel',
        },
      ],
    })
    if (!player) {
      return res.status(404).json({ message: 'Player not found' })
    }

    res.json(player)
  } catch (error) {
    console.error('Error fetching player:', error)
    res
      .status(500)
      .json({ message: 'Failed to fetch player', error: 'An error occurred' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ message: 'Email is required' })
    } else if (!isValidEmail(req.body.email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    const newPlayer = await db.Player.create({
      email: req.body.email,
      lastLogin: new Date(),
    })
    res.status(201).json(newPlayer)
  } catch (error: unknown) {
    console.error('Error creating player:', error)
    if (error instanceof Error) {
      res
        .status(400)
        .json({ message: 'Failed to create player', error: error.message })
    } else {
      res.status(400).json({
        message: 'Failed to create player',
        error: 'An unknown error occurred',
      })
    }
  }
})

export default router
