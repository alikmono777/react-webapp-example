import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/lib/mongodb'
import Place from '@/models/places'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const places = await Place.find()
      return res.status(200).json(places)
    } catch (err) {
      console.error('❌ Ошибка при получении places:', err)
      return res.status(500).json({ error: 'Ошибка сервера при получении places' })
    }
  }
  }
