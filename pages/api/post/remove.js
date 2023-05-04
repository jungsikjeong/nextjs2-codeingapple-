import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  let session = await getServerSession(req, res, authOptions);

  if (req.method === 'POST') {
    try {
      let client = await connectDB;
      const db = client.db('forum');

      if (session) {
        // 해당 게시물찾기
        const post = await db
          .collection('post')
          .findOne({ _id: new ObjectId(req.query.id) });

        // 해당 게시물 작성자와 로그인된 유저가 일치하는지 확인
        // 일치하면 게시글 삭제시켜줌
        if (session.user.email === post.author) {
          await db
            .collection('post')
            .deleteOne({ _id: new ObjectId(req.query.id) });

          res.status(200).json('삭제완료');
        } else if (session.user.role === 'admin') {
          await db
            .collection('post')
            .deleteOne({ _id: new ObjectId(req.query.id) });

          res.status(200).json('삭제완료');
        } else {
          res.status(400).json('글 작성자가 아닙니다.');
        }
      }
    } catch (error) {
      res.status(500).json('에러발생', error);
    }
  }
}
