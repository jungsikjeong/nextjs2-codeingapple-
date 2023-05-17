'use client';

import Link from 'next/link';

const PostList = ({ result, user }) => {
  const onRemove = (e, id) => {
    // fetch('/api/test?name=kim&age=20')서버에 데이터 보낼때 예시, 쿼리스트링
    // fetch(`/api/${id}/remove`, { method: 'POST' }).then((data) => {}

    fetch(`/api/post/remove?id=${id}`, { method: 'POST' }).then((data) => {
      if (data.status === 200) {
        e.target.parentElement.parentElement.style.opacity = 0;
        setTimeout(() => {
          e.target.parentElement.parentElement.style.display = 'none';
        }, 1000);
      } else if (data.status === 400) {
        alert('글 작성자가 아닙니다.');
      }
    });
  };

  return (
    <>
      {result.map((data) => (
        <div className='list-item' key={data._id}>
          {user?.email === data?.author && (
            <div className='emoticon-box'>
              <Link href={`/edit/${data._id}`}>✏️</Link>
              <span onClick={(e) => onRemove(e, data._id)}>❌</span>
            </div>
          )}

          <div>
            <h4>
              <Link href={`/detail/${data._id}`}>
                <span>{data.title}</span>
                <span className='post-like-count'> ･ {data.postLikeCount}</span>
              </Link>
            </h4>
          </div>

          {data.src && <img src={data.src} alt='이미지' className='list-img' />}

          <p>{data.contents}</p>
        </div>
      ))}
    </>
  );
};

export default PostList;
