import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

const Edit = async (props) => {
  let client = await connectDB;
  const db = client.db('fourm');

  let result = await db
    .collection('post')
    .findOne({ _id: new ObjectId(props.params.id) });

  return (
    <div className='form-container'>
      <h4 className='title mb-5'>수정페이지</h4>
      <form action='/api/post/edit' method='POST' className='post-form '>
        <input type='text' name='title' defaultValue={result.title} />
        <textarea type='text' name='contents' defaultValue={result.contents} />
        <input
          name='_id'
          defaultValue={result._id.toString()}
          style={{ display: 'none' }}
        />

        <button type='submit'>글수정</button>
      </form>
    </div>
  );
};

export default Edit;
