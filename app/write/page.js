'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Loading from '../loading';

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

    if (title === '' || contents === '') {
      return alert('제목과 내용을 모두 입력해주세요!');
    }

    let uploadResult;
    let filename;

    // 이미지를 업로드하면
    if (imageFile !== '') {
      const myUUID = uuidv4();
      const shortenedUUID = myUUID.substr(0, 8); // 처음 8자리만 사용
      filename = encodeURIComponent(`${shortenedUUID}_${imageFile.name}`);

      const imageRes = await fetch('/api/post/image?file=' + filename);
      const imageJson = await imageRes.json();

      const formData = new FormData();
      Object.entries({ ...imageJson.fields, file: imageFile }).forEach(
        ([key, value]) => {
          formData.append(key, value);
        }
      );

      uploadResult = await fetch(imageJson.url, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResult.ok) {
        alert('이미지 전송에 실패했습니다. 다시 시도해주세요');
        return;
      }
    }

    const postRes = await fetch('/api/post/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        contents,
        src: imageFile !== '' ? uploadResult.url + '/' + filename : undefined,
      }),
    });

    if (postRes.status === 200) {
      router.push('/');
    } else if (postRes.status === 400) {
      const errorData = await postRes.json();
      alert(errorData);
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
            alt='미리보기 이미지'
            style={{ marginBottom: '1rem' }}
          />
        )}

        <button type='submit'>글작성</button>
      </form>
    </div>
  );
};

export default Write;
