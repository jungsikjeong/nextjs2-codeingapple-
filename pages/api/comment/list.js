import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = (await connectDB).db('forum');

    const result = await db
      .collection('comment')
      .find({ postId: new ObjectId(req.query.id) })
      .toArray();

    res.status(200).json(result);
  }
}
