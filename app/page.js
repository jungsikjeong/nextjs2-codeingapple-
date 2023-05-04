import { connectDB } from '@/util/database';
import Link from 'next/link';
import PostList from './postList';

// npm run build했을때의 html파일만을 보여줌 => 스태틱 래더링
// npm run build, 동적으로 유저에게 html을 보여줌 => 다이나믹 랜더링

// 이 페이지는 npm run build했을때 스태틱 랜더링으로 보여줌
// export const dynamic = 'force-static';

// 이 페이지는 npm run build했을때 다이나믹 랜더링으로 보여줌
export const dynamic = 'force-dynamic';

// ISR
export const revalidate = 60;

const Home = async () => {
  let client = await connectDB;
  const db = client.db('forum');
  let result = await db.collection('post').find().toArray();

  result = result.map((data) => {
    data._id = data._id.toString();
    return data;
  });

  return (
    <div className='container'>
      {result.length === 0 ? (
        <h1 className='not-post'>현재 작성된 글이 없습니다.</h1>
      ) : (
        <PostList result={result} />
      )}
    </div>
  );
};

export default Home;
