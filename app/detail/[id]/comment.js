'use client';

import { useEffect, useState } from 'react';

const Comment = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [isComment, setIsComment] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeCommentInput = (e) => {
    setComment(e.target.value);
  };

  const onSubmit = () => {
    fetch('/api/comment/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment,
        postId,
      }),
    }).then((data) => {
      if (data.status === 200) {
        setIsComment((prev) => !prev);
        setComment('');
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/comment/list?id=${postId}`)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setCommentList(data);
      });
  }, [isComment]);

  return (
    <div className='comment-wrap'>
      <div style={{ marginBottom: '.5rem' }}>댓글 목록</div>

      {loading ? (
        <div className='loading'>Loading...</div>
      ) : (
        <>
          {commentList &&
            commentList.map((data) => (
              <div key={data._id} className='comment-list'>
                <p className='comment-item'>
                  {data.content} &nbsp; by- &nbsp;
                  <span className='comment-name'>{data.authorName}</span>
                </p>
              </div>
            ))}
        </>
      )}

      <div className='comment-input-wrap'>
        <input
          type='text'
          value={comment}
          onChange={(e) => onChangeCommentInput(e)}
          className='comment-input'
        />
        <button onClick={onSubmit} style={{ width: '25%' }}>
          댓글작성
        </button>
      </div>
    </div>
  );
};

export default Comment;
