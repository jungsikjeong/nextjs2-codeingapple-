const page = () => {
  return (
    <div className='form-container'>
      <h4>회원가입</h4>
      <form action='/api/post/new' method='POST' className='post-form'>
        <input type='text' name='title' placeholder='아이디' />
        <input type='text' name='contents' placeholder='비밀번호' />
        <button type='submit'>버튼</button>
      </form>
    </div>
  );
};

export default page;
