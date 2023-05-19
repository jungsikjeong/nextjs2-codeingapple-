'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const Edit = (props) => {
  const [imageURL, setImageURL] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [existingImageURL, setExistingImageURL] = useState('');

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

    // 기존 이미지가 있고, 이미지를 변경한다면 aws s3에서 기존이미지 삭제
    if (imageURL && imageURL !== existingImageURL) {
      const res = await fetch('/api/post/removeImage?url=' + existingImageURL);

      if (res.status === 500) {
        return alert('이미지 삭제 에러, 이미지를 다시 확인해주세요.');
      }
    }

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

    const postRes = await fetch('/api/post/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        contents,
        _id: props.params.id,
        // src: imageFile !== '' ? uploadResult.url + '/' + filename : (imageURL ? imageURL : ''),
        src:
          imageFile !== ''
            ? uploadResult.url + '/' + filename
            : imageURL
            ? imageURL
            : '',
      }),
    });

    if (postRes.status === 200) {
      router.push('/');
    } else if (postRes.status === 400) {
      const errorData = await postRes.json();
      alert(errorData);
    }
  };

  useEffect(() => {
    (async () => {
      let res = await fetch('/api/post/get?id=' + props.params.id);
      res = await res.json();

      setTitle(res.title);
      setContents(res.contents);

      if (res.src) {
        setImageURL(res.src);
        setExistingImageURL(res.src);
      }
    })();
  }, []);

  return (
    <div className='form-container'>
      <h4 className='title'>수정페이지</h4>
      {title && contents && (
        <form className='post-form' onSubmit={onSubmit}>
          <input
            type='text'
            name='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            type='text'
            name='contents'
            value={contents}
            onChange={(e) => setContents(e.target.value)}
          />

          <input
            type='file'
            accept='image/*'
            onChange={(e) => onFileUpload(e)}
          />

          {imageURL && (
            <img
              src={imageURL}
              alt='미리보기 이미지'
              style={{ marginBottom: '1rem' }}
            />
          )}

          <button type='submit'>글수정</button>
        </form>
      )}
    </div>
  );
};

export default Edit;
