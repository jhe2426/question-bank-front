import React, { ChangeEvent, useEffect, useState } from 'react';

import './style.css';
import InputBox from 'src/components/InputBox';

// component: 로그인 컴포넌트 //
export default function SignIn() {

    // state: 유저 아이디 상태 //
    const [userId, setUserId] = useState<string>('');
    // state: 유저 비밀번호 상태 //
    const [userPassword, setUserPassword] = useState<string>('');
    // state: 유저 아이디 메세지 상태
    const [userIdMessage, setUserIdMessage] = useState<string>('');
    // state: 유저 비밀번호 메세지 상태
    const [userPasswordMessage, setUserPasswordMessage] = useState<string>('');

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

    // event handler: 로그인 버튼 클릭 이벤트 처리 //
    const onLoginButtonClick = () => {
        if (!userId) setUserIdMessage('아이디를 입력하세요');
        if (!userPassword) setUserPasswordMessage('비밀번호를 입력하세요');

        if (!userId || !userPassword) return;

        // todo: 로그인 처리 로직 //
    };

    // effect: 아이디 혹은 비밀번호 변경 시 실행할 함수 //
    useEffect(() => {
        setUserIdMessage('');
        setUserPasswordMessage('');
    }, [userId, userPassword]);

    // render: 로그인 컴포넌트 렌더링 //
    return (
        <div id="auth-login-container">
            <div className="header">Login</div>

            <div className="input-container">
                <InputBox type={'text'} label={'아이디'} value={userId} placeholder={'아이디를 입력해주세요'} message={userIdMessage} isErrorMessage onChange={onUserIdChangeHandler} />
                <InputBox type={'password'} label={'비밀번호'} value={userPassword} placeholder={'비밀번호를 입력해주세요'} message={userPasswordMessage} isErrorMessage onChange={onUserPasswordChangeHandler} />
            </div>

            <div className="button-container">
                <div className="button primary fullwidth" onClick={onLoginButtonClick}>로그인</div>
                <div className="link">회원가입</div>
            </div>
        </div>
    )
}
