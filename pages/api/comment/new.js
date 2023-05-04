import { connectDB } from '@/util/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === 'POST') {
    try {
      const db = (await connectDB).db('forum');

      const { comment: content, postId } = req.body;

      // 로그인된 유저만 댓글 작성할 수 있음
      if (session) {
        // 게시글 찾고
        const post = await db
          .collection('post')
          .findOne({ _id: new ObjectId(postId) });
        // 게시글 없으면 댓글 작성도 못하게 에러발생시킴
        if (!post) {
          return res.status(404).json('게시글을 찾을 수 없습니다.');
        }

        if (content === '') {
          return res.status(400).json('댓글을 입력해주세요');
        }

        const newBody = {
          postId: new ObjectId(postId),
          content,
          author: session.user.email,
          authorName: session.user.name,
        };

        await db.collection('comment').insertOne(newBody);

        return res.status(200).json('댓글 작성 완료');
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json('에러', error);
    }
  }
}
