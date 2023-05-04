import { connectDB } from '@/util/database';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    try {
      let db = (await connectDB).db('forum');

      if (name === '' || email === '' || password === '') {
        return res.status(400).json('모든 칸을 입력해주세요');
      }

      const user = await db.collection('user_cred').findOne({ email: email });
      if (user) {
        return res.status(400).json('이미 가입된 email입니다.');
      }

      let hash = await bcrypt.hash(req.body.password, 10);
      const newBody = {
        name,
        email,
        password: hash,
        role: 'normal',
      };

      await db.collection('user_cred').insertOne(newBody);

      res.redirect(302, '/');
    } catch (error) {
      console.log('error:', error);
    }
  }
}
