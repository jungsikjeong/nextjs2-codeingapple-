import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import aws from 'aws-sdk';

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
        // 혹은 관리자 계정인지 확인
        // 일치하면 게시글 삭제시켜줌
        if (
          session.user.email === post.author ||
          session.user.role === 'admin'
        ) {
          // 게시글 삭제
          await db
            .collection('post')
            .deleteOne({ _id: new ObjectId(req.query.id) });

          // 해당 게시글의 댓글도 삭제
          await db
            .collection('comment')
            .deleteMany({ postId: new ObjectId(req.query.id) });

          // 해당 게시글의 좋아요도 삭제
          await db
            .collection('postLike')
            .deleteMany({ postId: new ObjectId(req.query.id) });

          // 해당 게시글에 이미지가 있다면 이미지도 삭제
          aws.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
            region: 'ap-northeast-2',
            signatureVersion: 'v4',
          });

          if (post.src !== '' && post.src) {
            const s3 = new aws.S3();

            s3.deleteObject(
              {
                Bucket: process.env.BUCKET_NAME,
                Key: post.src.slice(58),
              },
              (err, data) => {
                if (err) {
                  console.error('이미지삭제에러:', err);
                  console.log(data);
                  res.status(500).json('이미지 삭제 에러');
                } else {
                  console.log('이미지 삭제 성공');
                }
              }
            );
          }

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
