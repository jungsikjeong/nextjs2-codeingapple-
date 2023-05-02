'use client';

import Link from 'next/link';

const PostList = ({ result }) => {
  const onRemove = (e, id) => {
    // fetch('/api/test?name=kim&age=20')서버에 데이터 보낼때 예시, 쿼리스트링
    // fetch(`/api/${id}/remove`, { method: 'POST' }).then((data) => {

    fetch(`/api/post/remove?id=${id}`, { method: 'POST' }).then((data) => {
      if (data.status === 200) {
        e.target.parentElement.parentElement.style.opacity = 0;
        setTimeout(() => {
          e.target.parentElement.parentElement.style.display = 'none';
        }, 1000);
      }
    });
  };

  return (
    <>
      {result.map((data) => (
        <div className='list-item' key={data._id}>
          <div className='emoticon-box'>
            <Link href={`/edit/${data._id}`}>✏️</Link>
            <span onClick={(e) => onRemove(e, data._id)}>❌</span>
          </div>
          <h4>
            <Link href={`/detail/${data._id}`}>
              <span>{data.title}</span>
            </Link>
          </h4>
          <p>{data.contents}</p>
        </div>
      ))}
    </>
  );
};

export default PostList;
