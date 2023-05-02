import { connectDB } from '@/util/database';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, password } = req.body;

    let client = await connectDB;
    const db = client.db('fourm');

    try {
      const user = db.find('user').findById(userId);

      if (user) {
        res.status(404).json('이미 유저가 존재합니다.');
      }

      await db.collection('user').insertOne({ userId, password });

      res.redirect(302, '/');
    } catch (error) {
      console.log(error);
      res.status(400).json('에러발생', error);
    }
  }
}
