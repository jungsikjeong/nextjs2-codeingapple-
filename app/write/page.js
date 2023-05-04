import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

const Write = async () => {
  let session = await getServerSession(authOptions);
  return (
    <>
      {session ? (
        <div className='form-container'>
          <h4 className='title'>글작성페이지</h4>
          <form action='/api/post/new' method='POST' className='post-form'>
            <input type='text' name='title' placeholder='글제목' />
            <textarea type='text' name='contents' placeholder='글내용' />
            <button type='submit'>글작성</button>
          </form>
        </div>
      ) : (
        <div style={{ marginTop: '5rem' }}>
          <h4 className='title'>로그인이 필요합니다.</h4>
        </div>
      )}
    </>
  );
};

export default Write;
