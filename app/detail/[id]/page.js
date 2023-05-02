// dynamic route
// (props)=>{}; 하고,
// console.log(props); 해주면 유저가 다이나믹라우터 자리에입력한 값이 콘솔에뜸
// 다이나믹라우터란?${id}를뜻함 전체에시=> localhost:3000:/detail/${id}
import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import Link from 'next/link';

const Detail = async (props) => {
  let client = await connectDB;
  const db = client.db('fourm');

  let result = await db
    .collection('post')
    .findOne({ _id: new ObjectId(props.params.id) });

  return (
    <div className='container'>
      <h4 className='title mt-2 mb-5  '>상세페이지</h4>

      <div className='list'>
        <div className='list-item'>
          <div className='emoticon-box'>
            <Link href={`/edit/${result._id}`}>✏️</Link>❌
          </div>
          <h4>
            <span>{result.title}</span>
          </h4>
          <p>{result.contents}</p>
        </div>
      </div>
    </div>
  );
};

export default Detail;
