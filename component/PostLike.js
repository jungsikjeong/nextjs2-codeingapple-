'use client';

import { useEffect } from 'react';

const PostLike = ({ postId, session }) => {
  const onLikeBtnClick = () => {
    fetch('/api/post/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId,
      }),
    }).then((data) => {
      if (data.status === 200) {
        window.location.reload();
      } else if (data.status === 400) {
        alert('이미 좋아요 누른 게시물입니다.');
      }
    });
  };

  return (
    <>
      {session && (
        <div className='post-like-btn' onClick={() => onLikeBtnClick()}>
          <span>👍</span>
        </div>
      )}
    </>
  );
};

export default PostLike;
