'use client';
import { useRouter } from 'next/navigation';

const PostDeleteBtnComponent = ({ id }) => {
  const router = useRouter();
  const onRemove = (e, id) => {
    // fetch('/api/test?name=kim&age=20')서버에 데이터 보낼때 예시, 쿼리스트링
    // fetch(`/api/${id}/remove`, { method: 'POST' }).then((data) => {}

    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');

    if (confirmDelete) {
      fetch(`/api/post/remove?id=${id}`, { method: 'POST' }).then((data) => {
        if (data.status === 200) {
          alert('게시글이 삭제되었습니다.');
          router.push('/');
        } else if (data.status === 400) {
          alert('글 작성자가 아닙니다.');
        }
      });
    }
  };

  return (
    <>
      <span onClick={(e) => onRemove(e, id)}>❌</span>
    </>
  );
};

export default PostDeleteBtnComponent;
