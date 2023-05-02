import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      let client = await connectDB;
      const db = client.db('fourm');

      const result = await db
        .collection('post')
        .deleteOne({ _id: new ObjectId(req.query.id) });

      res.status(200).json('삭제완료');
    } catch (error) {
      res.status(500).json('에러발생', error);
    }
  }
}
