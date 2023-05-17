import { connectDB } from '@/util/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  let session = await getServerSession(req, res, authOptions);
  const { title, contents, src } = req.body;

  if (req.method === 'POST') {
    if (session) {
      if (title === '') {
        return res.status(400).json('제목을 작성해주세요.');
      }

      if (contents === '') {
        return res.status(400).json('내용을 작성해주세요.');
      }

      const newBody = {
        title,
        contents,
        author: session.user.email,
        postLikeCount: 0,
        src: src ? src : '',
      };

      try {
        const db = (await connectDB).db('forum');

        const result = await db.collection('post').insertOne(newBody);
        res.redirect(302, '/');
      } catch (error) {
        res.status(500).json('에러발생', error);
        console.log('error:', error);
      }
    }
  }
}
