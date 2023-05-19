import aws from 'aws-sdk';

export default async function handler(req, res) {
  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: 'ap-northeast-2',
    signatureVersion: 'v4',
  });

  const s3 = new aws.S3();

  s3.deleteObject(
    {
      Bucket: process.env.BUCKET_NAME,
      Key: req.query.url.slice(58),
    },
    (err, data) => {
      if (err) {
        console.error('이미지삭제에러:', err);
        console.log(data);
        res.status(500).json('이미지 삭제 에러');
      } else {
        res.status(200).json('이미지 삭제 완료');
      }
    }
  );
}
