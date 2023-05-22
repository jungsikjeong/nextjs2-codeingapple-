import { connectDB } from '@/util/database';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

// 아이디,비밀번호로 회원가입
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.githubID,
      clientSecret: process.env.githubPW,
    }),

    CredentialsProvider({
      //1. 로그인페이지 폼 자동생성해주는 코드
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      //2. 로그인요청시 실행되는코드
      //직접 DB에서 아이디,비번 비교하고
      //아이디,비번 맞으면 return 결과, 틀리면 return null 해야함
      async authorize(credentials) {
        let db = (await connectDB).db('forum');
        let user = await db
          .collection('user_cred')
          .findOne({ email: credentials.email });

        if (!user) {
          console.log('해당 이메일은 없음');
          return null;
        }
        const pwcheck = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!pwcheck) {
          console.log('비번틀림');
          return null;
        }
        return user;
      },
    }),
  ],

  //3. jwt 써놔야 잘됩니다 + jwt 만료일설정
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, //하루
  },

  callbacks: {
    //4. jwt 만들 때 실행되는 코드, JWT에 기입할 정보
    //user변수는 DB의 유저정보담겨있고 token.user에 뭐 저장하면 jwt에 들어갑니다.
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = {};
        token.user.name = user.name;
        token.user.email = user.email;
        token.user.role = user.role;
        // DB에 저장된 유저가 일반 유저인지, 어드민인지도 토큰에 보낼 수 있음
      }
      return token;
    },
    //5. 유저 세션이 조회될 때 마다 실행되는 코드
    // 컴포넌트 안에서 보여줄 유저 정보, 토큰에있는 유저들을 컴포넌트 안에서 보여준다고 생각하면됨
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  // 세션이아니라 JWT면 이 코드는 삭제해도됨
  adapter: MongoDBAdapter(connectDB),
};
export default NextAuth(authOptions);
