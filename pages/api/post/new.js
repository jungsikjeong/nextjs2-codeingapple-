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
        author: {
          email: session.user.email,
          name: session.user.name, // 작성자의 이름을 추가
        },
        postLikeCount: 0,
        src: src ? src : '',
        createdAt: new Date(),
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
