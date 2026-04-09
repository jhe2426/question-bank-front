import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

import './style.css';
import MyPagePath from 'src/types/aliases/my-page.alias';
import InputBox from 'src/components/InputBox';
import { ResponseDto } from 'src/apis/dto/response';
import { MESSAGE, RESPONSE_CODE } from 'src/constants';
import { PatchUserPasswordRequestDto } from 'src/apis/dto/request/myPage';
import { patchUserPasswordRequest } from 'src/apis';
import { useAuthStore } from 'src/stores';

// interface: 비밀번호 변경 페이지 컴포넌트 속성 //
interface Props {
  onPageChange: (page: MyPagePath) => void;
}

// component: 비밀번호 변경 페이지 컴포넌트 //
export default function ChangePasswordPage(props: Props) {

  // state: accessToken 정보 상태 //
  const { accessToken } = useAuthStore();

  // state: 사용자 입력 정보 상태 //
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordCheck, setNewPasswordCheck] = useState<string>('');

  // state: 사용자 입력 메시지 상태 //
  const [currentPasswordMessage, setCurrentPasswordMessage] = useState<string>('');
  const [newPasswordMessage, setNewPasswordMessage] = useState<string>('');
  const [newPasswordCheckMessage, setNewPasswordCheckMessage] = useState<string>('');

  // state: 새 비밀번호 패턴 일치 상태 //
  const [isNewPasswordPatternMatched, setIsNewPasswordPatternMatched] = useState<boolean>(false);

  // state: 새 비밀번호가 기존 비밀번호와 동일한지 여부 상태 //
  const [isNewPasswordSameAsCurrent, setIsNewPasswordSameAsCurrent] = useState<boolean>(false);

  // variable: RESPONSE CODE 구조 분해 상수 //
      const { 
        AUTHENTICATION_FAILED, DATABASE_ERROR, PASSWORD_INCOREECT, NEW_PASSWORD_SAME_AS_CURRENT, SUCCESS
      } = RESPONSE_CODE;

  // variable: 변경하기 버튼 횔성화 //
  const isChangeButtonActive = currentPassword && newPassword && newPasswordCheck && isNewPasswordPatternMatched && !isNewPasswordSameAsCurrent;

  // variable: 변경하기 버튼 클래스 //
  const changePasswordButtonClass = `button ${isChangeButtonActive ? 'primary' : 'disable'} fullwidth`;

  // reference: InputBox 요소 참조 //
  const newPasswordInputBoxRef = useRef<HTMLInputElement | null>(null);
  const newPasswordCheckInputBoxRef = useRef<HTMLInputElement | null>(null);

  // function: 공통적으로 쓰일 입력 정보 빈 값 체크 함수 //
  const clearErrorMessageIfEmpty = (value: string, setMessage: (messge: string) => void) => {
    if (value === '') {
        setMessage('');
        return true;
    }
    
    return false;
  };

  // function: patch user password response 처리 함수 //
  const patchUserPasswordResponse = (responseBody: ResponseDto | null) => {
    const message = 
      !responseBody ? MESSAGE.SERVER_ERROR :
      responseBody.code === DATABASE_ERROR ? MESSAGE.SERVER_ERROR :
      responseBody.code === AUTHENTICATION_FAILED ? MESSAGE.AUTHENTICATION_FAILED :
      responseBody.code === PASSWORD_INCOREECT ? '현재 비밀번호가 일치하지 않습니다' :
      responseBody.code === NEW_PASSWORD_SAME_AS_CURRENT ? '기존 비밀번호와 다른 비밀번호를 입력해주세요' : '';

      const isSuccessed = responseBody !== null && responseBody.code === SUCCESS;
      if (!isSuccessed) {
          if (responseBody && responseBody.code === PASSWORD_INCOREECT) {
            setCurrentPasswordMessage(message);
            return;
          }
          
          alert(message);
          return;
      }

      alert('정상적으로 비밀번호가 변경됐습니다');
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordCheck('');
  };

  // event handler: 현재 비밀번호 변경 이벤트 처리 //
  const onCurrentPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCurrentPassword(value);

    if (clearErrorMessageIfEmpty(value, setCurrentPasswordMessage)) return;
  };

  // event handler: 새 비밀번호 변경 이벤트 처리 //
  const onNewPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNewPassword(value);

    if (clearErrorMessageIfEmpty(value, setNewPasswordMessage)) return;

    if (currentPassword === value) {
      setNewPasswordMessage('현재 비밀번호와 다른 비밀번호를 입력해주세요');
      setIsNewPasswordSameAsCurrent(true);
      return;
    }

    const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*\-_?])[a-zA-Z0-9!@#$%^&*\-_?]{8,20}$/;
    const isMatch = regexp.test(value);
    const message = isMatch ? '' : '영대소문자 + 숫자 + 특수문자(!@#$%^&*-_?)를 혼용하여 8 ~ 20자 입력해주세요';
    setNewPasswordMessage(message);
    setIsNewPasswordPatternMatched(isMatch);
  };

  // event handler: 새 비밀번호 확인 변경 이벤트 처리 //
  const onNewPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNewPasswordCheck(value);
  };

  // event handler: 변경하기 버튼 클릭 이벤트 처리 //
  const onChangeClickHandler = () => {

    if (!accessToken) return;
    
    if (!currentPassword) setCurrentPasswordMessage('비밀번호를 입력해주세요');
    if (!newPassword) setNewPasswordMessage('새 비밀번호를 입력해주세요');
    if (!newPasswordCheck) setNewPasswordCheckMessage('비밀번호 확인을 입력하세요');

    if (!isChangeButtonActive) return;

    const requestBody: PatchUserPasswordRequestDto = {
      currentPassword,
      newPassword
    };
    patchUserPasswordRequest(requestBody, accessToken).then(patchUserPasswordResponse);
  };

  // event handler: 현재 비밀번호 입력창에서 엔터 시 호출 //
  const onCurrentPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!newPasswordInputBoxRef.current || event.key !=='Enter') return;

    if (!currentPassword) {
      setCurrentPasswordMessage('현재 비밀번호를 입력하세요');
      return;
    }

    newPasswordInputBoxRef.current.focus();
  };

  // event handler: 새 비밀번호 입력창에서 엔터 시 호출 //
  const onNewPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!newPasswordCheckInputBoxRef.current || event.key !=='Enter') return;

    if (!newPassword) {
      setNewPasswordMessage('새 비밀번호를 입력하세요');
      return;
    }

    newPasswordCheckInputBoxRef.current.focus();
  };

  // event handler: 새 비밀번호 확인 입력창에서 엔터 시 호출 //
  const onNewPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!newPasswordCheckInputBoxRef.current || event.key !=='Enter') return;

    if (!newPasswordCheck) {
      setNewPasswordCheckMessage('비밀번호 확인을 입력하세요');
      return;
    }

    onChangeClickHandler();
  };

  // effect: 현재 비밀번호 변경 시 실행할 함수 //
  useEffect(() => {
    setCurrentPasswordMessage('');
  }, [currentPassword]);

  // effect: 새로운 비밀번호 또는 새로운 비밀번호 확인의 값이 변경될 시 실행할 함수 //
  useEffect(() => {
    if(clearErrorMessageIfEmpty(newPasswordCheck, setNewPasswordCheckMessage)) return;

    if (isNewPasswordSameAsCurrent) setIsNewPasswordSameAsCurrent(false);

    const isMatch = newPassword === newPasswordCheck;
    const massage = isMatch ? '' : '비밀번호가 일치하지 않습니다';
    setNewPasswordCheckMessage(massage);
    setIsNewPasswordPatternMatched(isMatch);    
  }, [newPassword, newPasswordCheck]);

  // render: 비밀번호 변경 페이지 컴포넌트 렌더링 //
  return (
    <div id='change-password-page-container'>
      <div className='input-container'>
      <InputBox type={'password'} label={'현재 비밀번호'} value={currentPassword} placeholder={'현재 비밀번호를 입력하세요'} message={currentPasswordMessage} isErrorMessage onChange={onCurrentPasswordChangeHandler} onKeyDown={onCurrentPasswordKeyDownHandler} />
      <InputBox ref={newPasswordInputBoxRef} type={'password'} label={'새 비밀번호'} value={newPassword} placeholder={'특수문자 !@#$%^&*-_? 중 1개 이상을 포함해 입력해주세요'} message={newPasswordMessage} isErrorMessage onChange={onNewPasswordChangeHandler} onKeyDown={onNewPasswordKeyDownHandler} />
      <InputBox ref={newPasswordCheckInputBoxRef} type={'password'} label={'새 비밀번호 확인'} value={newPasswordCheck} placeholder={'비밀번호를 입력해주세요'} message={newPasswordCheckMessage} isErrorMessage onChange={onNewPasswordCheckChangeHandler} onKeyDown={onNewPasswordCheckKeyDownHandler} />
      </div> 

      <div className='button-container'>
            <div className={changePasswordButtonClass} onClick={onChangeClickHandler}>변경하기</div>
      </div>
    </div>
  )
}
