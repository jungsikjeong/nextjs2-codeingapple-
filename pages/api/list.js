import { connectDB } from '@/util/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let client = await connectDB;
    const db = client.db('fourm');

    let result = await db.collection('post').find().toArray();

    result = result.map((a) => {
      a._id = a._id.toString();
      return a;
    });

    res.status(200).json(result);
  }
}
