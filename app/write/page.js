'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Write = () => {
  const [imageURL, setImageURL] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');

  const router = useRouter();

  const onFileUpload = async (e) => {
    e.preventDefault();
    if (!e.target.files) return;

    const file = e.target.files[0];

    if (file) {
      let image = window.URL.createObjectURL(file);

      setImageURL(image);
      setImageFile(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // 이미지도 업로드하게된다면
    if (imageFile !== '') {
      const filename = encodeURIComponent(imageFile.name);

      let res = await fetch('/api/post/image?file=' + filename);
      res = await res.json();

      //S3 업로드
      const formData = new FormData();
      Object.entries({ ...res.fields, file: imageFile }).forEach(
        ([key, value]) => {
          formData.append(key, value);
        }
      );

      let uploadResult = await fetch(res.url, {
        method: 'POST',
        body: formData,
      });

      if (uploadResult.ok) {
        const writeResult = await fetch('/api/post/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            contents,
            src: uploadResult.url + '/' + filename,
          }),
        });

        // 글작성 성공시
        if (writeResult.status === 200) {
          router.push('/');

          return;
        }
        // 글작성 에러시
        if (writeResult.status === 400) {
          const data = await writeResult.json();

          alert(data);
          return;
        }
      } else {
        alert('이미지 전송에 실패했습니다. 다시 시도해주세요');
        return;
      }
    } else {
      // 이미지없이 글만 작성한다면
      const res = await fetch('/api/post/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          contents,
        }),
      });

      // 글작성 성공시
      if (res.status === 200) {
        router.push('/');
      }
      // 에러시
      if (res.status === 400) {
        const data = await res.json();

        alert(data);
      }
    }
  };

  return (
    <div className='form-container'>
      <h4 className='title'>글작성페이지</h4>

      <form className='post-form' onSubmit={onSubmit}>
        <input
          type='text'
          value={title}
          placeholder='글제목'
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          type='text'
          value={contents}
          placeholder='글내용'
          onChange={(e) => setContents(e.target.value)}
        />

        <input type='file' accept='image/*' onChange={(e) => onFileUpload(e)} />

        {imageURL && (
          <img
            src={imageURL}
            alt='미리보기이미지'
            style={{ marginBottom: '1rem' }}
          />
        )}

        <button type='submit'>글작성</button>
      </form>
    </div>
  );
};

export default Write;
