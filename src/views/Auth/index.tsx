import React, { ChangeEvent, useState } from 'react';

import './style.css';
import InputBox from 'src/components/InputBox';

// component: 로그인 회원가입 화면 컴포넌트 //
export default function Auth() {

    // state: 유저 아이디 상태 //
    const [userId, setUserId] = useState<string>('');
    // state: 유저 비밀번호 상태 //
    const [userPassword, setUserPassword] = useState<string>('');

    // event handler: 유저 아이디 변경 이벤트 처리 //
    const onUserIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserId(value);
    };

    // event handler: 유저 비밀번호 변경 이벤트 처리 //
    const onUserPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserPassword(value);
    };

    // render: 로그인 회원가입 화면 컴포넌트 렌더링 //
    return (
        <div id="auth-wrapper">
            <div className="auth-box">
                <div id="auth-login-container">

                    <div className="header">Login</div>

                    <div className="input-container">
                        <InputBox type={'text'} label={'아이디'} value={userId} placeholder={'아이디를 입력해주세요'} message={''} onChange={onUserIdChangeHandler} />
                        <InputBox type={'password'} label={'비밀번호'} value={userPassword} placeholder={'비밀번호를 입력해주세요'} message={''} onChange={onUserPasswordChangeHandler} />
                    </div>

                    <div className="button-container"></div>
                    
                </div>
            </div>
        </div>
    )
}
