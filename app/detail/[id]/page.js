// dynamic route
// (props)=>{}; 하고,
// console.log(props); 해주면 유저가 다이나믹라우터 자리에입력한 값이 콘솔에뜸
// 다이나믹라우터란?${id}를뜻함 전체에시=> localhost:3000:/detail/${id}
import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import Link from 'next/link';
import Comment from './Comment';
import PostLike from '../../../component/PostLike';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { notFound } from 'next/navigation';

const Detail = async (props) => {
  const session = await getServerSession(authOptions);

  let client = await connectDB;
  const db = client.db('forum');

  let result = await db
    .collection('post')
    .findOne({ _id: new ObjectId(props.params.id) });

  let postLike = await db
    .collection('postLike')
    .find({ postId: new ObjectId(props.params.id) })
    .toArray();

  if (result === null) {
    return notFound();
  }

  return (
    <div className='container'>
      <h4 className='title mt-2 mb-3 '>상세페이지</h4>

      {result && (
        <div className='list'>
          <div className='list-item'>
            {session && (
              <div className='emoticon-box'>
                <Link href={`/edit/${result._id}`}>✏️</Link>❌
              </div>
            )}

            <h4>
              <span>{result.title}</span>
            </h4>

            <span className='post-like-count'> ･ {postLike.length}</span>
            <p>{result.contents}</p>

            <PostLike postId={props.params.id} session={session} />

            <Comment postId={result._id.toString()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
