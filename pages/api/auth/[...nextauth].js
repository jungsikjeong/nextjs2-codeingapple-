import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.githubID,
      clientSecret: process.env.githubPW,
    }),
  ],
  secret: process.env.secretKey,
};
export default NextAuth(authOptions);
