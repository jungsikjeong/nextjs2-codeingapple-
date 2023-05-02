const Write = () => {
  return (
    <div className='form-container'>
      <h4 className='title'>글작성페이지</h4>
      <form action='/api/post/new' method='POST' className='post-form'>
        <input type='text' name='title' placeholder='글제목' />
        <textarea type='text' name='contents' placeholder='글내용' />
        <button type='submit'>글작성</button>
      </form>
    </div>
  );
};

export default Write;
