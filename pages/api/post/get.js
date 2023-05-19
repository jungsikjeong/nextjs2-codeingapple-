import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let client = await connectDB;
    const db = client.db('forum');

    let result = await db
      .collection('post')
      .findOne({ _id: new ObjectId(req.query.id) });

    // result = result.map((a) => {
    //   a._id = a._id.toString();
    //   return a;
    // });

    res.status(200).json(result);
  }
}
