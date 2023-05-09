import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  let session = await getServerSession(req, res, authOptions);

  try {
    if (req.method === 'POST') {
      if (session) {
        const db = (await connectDB).db('forum');
        const isLike = await db
          .collection('postLike')
          .findOne({ likeUser: session.user.name });
        if (isLike) {
          return res.status(400).json('이미 좋아요 누른 게시글입니다.');
        }
        const post = await db
          .collection('post')
          .updateOne(
            { _id: new ObjectId(req.body.postId) },
            { $inc: { postLikeCount: +1 } }
          );
        const newPost = await db
          .collection('post')
          .updateOne({ _id: new ObjectId(req.body.postId) }, { $set: post });
        const result = await db.collection('postLike').insertOne({
          likeUser: req.body.userName,
          postId: new ObjectId(req.body.postId),
        });
        res.status(200).json('좋아요 성공');
      } else if (!session || session === null) {
        res.status(400).json({ message: '로그인이 필요합니다.' });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json('error:', error);
  }
}
