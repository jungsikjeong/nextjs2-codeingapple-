import { connectDB } from '@/util/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  let session = await getServerSession(req, res, authOptions);
  const { title, contents } = req.body;
  let newBody = {};

  if (session) {
    newBody = { title, contents, author: session.user.email };
  }
  if (req.method === 'POST') {
    if (title === '') {
      return res.status(500).json('제목을 작성해주세요.');
    }

    let client = await connectDB;
    const db = client.db('forum');

    try {
      const result = await db.collection('post').insertOne(newBody);
      res.redirect(302, '/');
    } catch (error) {
      res.status(400).json('에러발생', error);
      console.log(error);
    }
  }
}
