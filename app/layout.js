import Link from 'next/link';
import './globals.css';
import { Inter } from 'next/font/google';
import LoginBtn from '@/component/LoginBtn';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import LogOutBtn from '@/component/LogOutBtn';
import RegisterBtn from '@/component/RegisterBtn';
import WriteBtn from '@/component/WriteBtn';
import { cookies } from 'next/headers';
import DarkMode from '@/component/DarkMode';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HotForum : 당신의 이야기를 실현시키는 곳',
  description: '당신의 이야기를 적어주세요',
  icons: {
    icon: '/icon.png',
  },
};

export default async function RootLayout({ children }) {
  // 서버컴포넌트,서버기능안에서 사용가능, 로그인 유저정보관련된기능
  let session = await getServerSession(authOptions);

  let res = cookies().get('mode');

  return (
    <html lang='en'>
      <body className={res?.value === 'dark' ? 'dark-mode' : ''}>
        <div className='navbar'>
          <Link href='/' className='logo'>
            HotForum 🌶️
          </Link>
          {session && <DarkMode res={res} />}

          {session ? (
            <div className='userInfo-wrap'>
              <span className='user-name'>{session.user.name}</span> &nbsp;
              <WriteBtn /> &nbsp;
              <LogOutBtn />
            </div>
          ) : (
            <>
              <LoginBtn /> <RegisterBtn />
              &nbsp;
              <DarkMode res={res} />
            </>
          )}
        </div>
        {children}
      </body>
    </html>
  );
}
