import { connectDB } from '@/util/database';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, contents } = req.body;

    if (title === '') {
      return res.status(500).json('제목을 작성해주세요.');
    }

    const newBody = { title: title, contents: contents };
    let client = await connectDB;
    const db = client.db('fourm');

    try {
      const result = await db.collection('post').insertOne(newBody);
      res.redirect(302, '/');
    } catch (error) {
      res.status(400).json('에러발생', error);
      console.log(error);
    }
  }
}
