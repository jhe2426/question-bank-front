import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

import './style.css';
import InputBox from 'src/components/InputBox';
import { useNavigate } from 'react-router';
import { SignInRequestDto } from 'src/apis/dto/request/auth';
import { ResponseDto } from 'src/apis/dto/response';
import { SignInResponseDto } from 'src/apis/dto/response/auth';
import { useAuthStroe } from 'src/stores';
import { MAIN_ABSOLUTE_PATH } from 'src/constants';
import { signInRequest } from 'src/apis/dto';
import AuthPage from 'src/types/aliases/auth-page.alias';

// interface: 로그인 컴포넌트 속성 //
interface Props {
    onPageChange: (page: AuthPage) => void;
}

// component: 로그인 컴포넌트 //
export default function SignIn(props: Props) {

    const { onPageChange } = props;

    // state: 유저 아이디 상태 //
    const [userId, setUserId] = useState<string>('');
    // state: 유저 비밀번호 상태 //
    const [userPassword, setUserPassword] = useState<string>('');
    // state: 유저 아이디 메세지 상태
    const [userIdMessage, setUserIdMessage] = useState<string>('');
    // state: 유저 비밀번호 메세지 상태
    const [userPasswordMessage, setUserPasswordMessage] = useState<string>('');

    // state: 로그인 유저 정보 상태 //
    const { setAccessToken } = useAuthStroe();

    // reference: 유저 비밀번호 InputBox 요소 참조 //
    const userPasswordInputBoxRef = useRef<HTMLInputElement | null>(null);

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: sign in response 처리 함수 //
    const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다' :
            responseBody.code === 'ROF' ? '서버에 문제가 있습니다' :
            responseBody.code === 'AE' ? '승인번호 사용기간이 지났습니다' :
            responseBody.code === 'SF' ? '로그인 정보가 일치하지 않습니다' : '';

        const isSuccess = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccess) {
            setUserPasswordMessage(message);
            return;
        }

        const { accessToken } = responseBody as SignInResponseDto;
        setAccessToken(accessToken);

        navigator(MAIN_ABSOLUTE_PATH);
    };

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

        const requestBody: SignInRequestDto = {
            userId, userPassword
        };
        signInRequest(requestBody).then(signInResponse);
    };

    // event handler: 아이디 입력창에서 엔터 시 호출 //
    const onUserIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (!userPasswordInputBoxRef.current || event.key !== 'Enter') return;

        if (!userId) {
            setUserIdMessage('아이디를 입력하세요');
            return;
        }

        userPasswordInputBoxRef.current.focus();
    };

    // event handler: 비밀번호 입력창에서 엔터 시 호출 //
    const onUserPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (!userPasswordInputBoxRef.current || event.key !== 'Enter') return;

        if (!userPassword) {
            setUserPasswordMessage('비밀번호를 입력하세요');
            return;
        }

        onLoginButtonClick();
    };

    // effect: 아이디 혹은 비밀번호 변경 시 실행할 함수 //
    useEffect(() => {
        setUserIdMessage('');
        setUserPasswordMessage('');
    }, [userId, userPassword]);

    // render: 로그인 컴포넌트 렌더링 //
    return (
        <div id='auth-login-container'>
            <div className='header'>Login</div>

            <div className='input-container'>
                <InputBox type={'text'} label={'아이디'} value={userId} placeholder={'아이디를 입력해주세요'} message={userIdMessage} isErrorMessage onChange={onUserIdChangeHandler} onKeyDown={onUserIdKeyDownHandler} />
                <InputBox ref={userPasswordInputBoxRef} type={'password'} label={'비밀번호'} value={userPassword} placeholder={'비밀번호를 입력해주세요'} message={userPasswordMessage} isErrorMessage onChange={onUserPasswordChangeHandler} onKeyDown={onUserPasswordKeyDownHandler} />
            </div>

            <div className='button-container'>
                <div className='button primary fullwidth' onClick={onLoginButtonClick}>로그인</div>
                <div className='link' onClick={() => onPageChange('sign-up')}>회원가입</div>
            </div>
        </div>
    )
}
