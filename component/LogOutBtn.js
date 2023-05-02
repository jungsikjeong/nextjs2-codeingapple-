'use client';

import { signOut } from 'next-auth/react';

const LogOutBtn = () => {
  return (
    <button
      onClick={() => {
        signOut();
      }}
    >
      로그아웃
    </button>
  );
};

export default LogOutBtn;
