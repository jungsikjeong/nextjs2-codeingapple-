'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DarkMode({ res }) {
  const router = useRouter();

  const onClick = () => {
    if (res.value === 'dark') {
      document.cookie = 'mode=light; max-age=' + 3600 * 24 * 400;
      router.refresh();
    } else {
      document.cookie = 'mode=dark; max-age=' + 3600 * 24 * 400;
      router.refresh();
    }
  };

  useEffect(() => {
    let cookie = ('; ' + document.cookie).split(`; mode=`).pop().split(';')[0];

    if (cookie == '') {
      document.cookie = 'mode=light; max-age=' + 3600 * 24 * 400;
    }
  }, []);

  return (
    <>
      {res.value === 'dark' ? (
        <span onClick={onClick} className='moon'>
          {' '}
          🌙
        </span>
      ) : (
        <span onClick={onClick} className='sun'>
          {' '}
          ☀️
        </span>
      )}
    </>
  );
}
