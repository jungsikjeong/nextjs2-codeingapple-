'use client';

import { useEffect, useState } from 'react';

const Comment = ({ postId, user }) => {
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [isComment, setIsComment] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeCommentInput = (e) => {
    setComment(e.target.value);
  };

  const onRemove = async (e, id) => {
    // fetch('/api/test?name=kim&age=20')서버에 데이터 보낼때 예시, 쿼리스트링
    // fetch(`/api/${id}/remove`, { method: 'POST' }).then((data) => {}

    const res = await fetch(`/api/comment/remove?id=${id}`, {
      method: 'POST',
    });

    const data = await res.json();

    if (res.status === 200) {
      e.target.parentElement.parentElement.style.opacity = 0;
      setTimeout(() => {
        e.target.parentElement.parentElement.style.display = 'none';
      }, 1000);
    } else if (res.status === 400) {
      alert(data);
    }
  };

  const onSubmit = () => {
    setLoading(true);
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
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    fetch(`/api/comment/list?id=${postId}`)
      .then((response) => response.json())
      .then((data) => {
        setCommentList(data);
      });
  }, [isComment]);

  return (
    <div className='comment-wrap'>
      <div style={{ marginBottom: '.5rem' }}>댓글 목록</div>

      {commentList &&
        commentList.map((data) => (
          <div key={data._id} className='comment-list'>
            <p className='comment-item'>
              {data.content} &nbsp; by- &nbsp;
              <span className='comment-name'>{data.authorName}</span>
              {user?.email === data.author && (
                <span
                  className='comment-remove'
                  onClick={(e) => onRemove(e, data._id)}
                >
                  ❌
                </span>
              )}
            </p>
          </div>
        ))}

      <div className='comment-input-wrap'>
        <input
          type='text'
          value={comment}
          onChange={(e) => onChangeCommentInput(e)}
          className='comment-input'
        />
        <button onClick={onSubmit} style={{ width: '25%' }}>
          {loading ? (
            <div className='square'>
              <div className='spin'></div>
            </div>
          ) : (
            <>댓글작성</>
          )}
        </button>
      </div>
    </div>
  );
};

export default Comment;
