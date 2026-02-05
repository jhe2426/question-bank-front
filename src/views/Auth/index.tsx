import React, { ChangeEvent, useState } from 'react';

import './style.css';
import InputBox from 'src/components/InputBox';
import SignIn from './SignIn';
import SignUp from './SignUp';

// component: 로그인 회원가입 화면 컴포넌트 //
export default function Auth() {

    // state: 페이지 상태 //
    const [page, setPage] = useState<'sign-in' | 'sign-up'>('sign-up');
    

    // render: 로그인 회원가입 화면 컴포넌트 렌더링 //
    return (
        <div id="auth-wrapper">
            <div className="auth-box">
                {page === 'sign-in' ? <SignIn /> : <SignUp />}
            </div>
        </div>
    )
}
