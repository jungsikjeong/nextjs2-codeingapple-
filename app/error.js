'use client';

const Error = (props) => {
  console.log(props); // error,reset 두가지가들어옴
  return (
    <div>
      <h4>에러남 ㅅㄱ</h4>
      <button onClick={() => reset()}>클릭시 페이지 다시 로드</button>
    </div>
  );
};

export default Error;
