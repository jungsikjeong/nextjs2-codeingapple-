import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, contents, _id } = req.body;

    const newBody = { title, contents };

    try {
      const db = (await connectDB).db('fourm');

      const result = await db
        .collection('post')
        .updateOne({ _id: new ObjectId(_id) }, { $set: newBody });

      res.redirect(302, '/');
    } catch (error) {
      console.log('error발생', error);
    }
  }
}
