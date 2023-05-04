import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const page = async () => {
  let session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }

  return (
    <div className='form-container'>
      <h4>회원가입</h4>
      <form action='/api/auth/signup' method='POST' className='post-form'>
        <input type='text' name='name' placeholder='이름' />
        <input type='email' name='email' placeholder='이메일' />
        <input type='password' name='password' placeholder='비밀번호' />
        <button type='submit'>버튼</button>
      </form>
    </div>
  );
};

export default page;
