'use client';

import Link from 'next/link';
import PostLike from '@/component/PostLike';
import PostDeleteBtnComponent from '@/component/PostDeleteBtnComponent';
import Image from 'next/image';
// import Image from 'next/legacy/image';

const PostList = ({ result, user }) => {
  // const onRemove = (e, id) => {
  //   // fetch('/api/test?name=kim&age=20')서버에 데이터 보낼때 예시, 쿼리스트링
  //   // fetch(`/api/${id}/remove`, { method: 'POST' }).then((data) => {}

  //   const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');

  //   if (confirmDelete) {
  //     fetch(`/api/post/remove?id=${id}`, { method: 'POST' }).then((data) => {
  //       if (data.status === 200) {
  //         e.target.parentElement.parentElement.style.opacity = 0;
  //         setTimeout(() => {
  //           e.target.parentElement.parentElement.style.display = 'none';
  //         }, 1000);
  //       } else if (data.status === 400) {
  //         alert('글 작성자가 아닙니다.');
  //       }
  //     });
  //   }
  // };

  return (
    <>
      {result.map((data) => (
        <div className='list-item' key={data._id}>
          {user && (
            <div className='emoticon-box'>
              <PostLike postId={data._id} session={user} />
              {user.email === data.author.email && (
                <>
                  <Link href={`/edit/${data._id}`}>✏️</Link>
                  <PostDeleteBtnComponent id={data._id} />
                </>
              )}
            </div>
          )}

          <div>
            <h4>
              <Link href={`/detail/${data._id}`}>
                <span>{data.title}</span>

                <span className='user-name'>by {data.author.name}</span>

                <span className='post-like-count'> ･ {data.postLikeCount}</span>
              </Link>
            </h4>
          </div>

          {data.src && (
            <Image
              src={data.src}
              alt='이미지'
              className='list-img'
              width={500}
              height={500}
              priority={true}
            />
          )}

          <p>
            {data.contents.length > 30
              ? data.contents.slice(0, 30) + '...'
              : data.contents}
          </p>
        </div>
      ))}
    </>
  );
};

export default PostList;
