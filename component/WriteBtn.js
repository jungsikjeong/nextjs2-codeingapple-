import Link from 'next/link';

const WriteBtn = () => {
  return (
    <Link href='/write'>
      <button>글작성</button>
    </Link>
  );
};

export default WriteBtn;
