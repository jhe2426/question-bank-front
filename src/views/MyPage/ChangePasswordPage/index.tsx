import React from 'react';

import './style.css';
import MyPagePath from 'src/types/aliases/my-page.alias';
import InputBox from 'src/components/InputBox';

// interface: 비밀번호 변경 페이지 컴포넌트 속성 //
interface Props {
  onPageChange: (page: MyPagePath) => void;
}

// component: 비밀번호 변경 페이지 컴포넌트 //
export default function ChangePasswordPage(props: Props) {
  
  const { onPageChange } = props;

  // render: 비밀번호 변경 페이지 컴포넌트 렌더링 //
  return (
    <div id='change-password-page-container'>
      <div className='input-container'>
      <InputBox type={'password'} label={'현재 비밀번호'} value={''} placeholder={'현재 비밀번호를 입력하세요'} message={''} isErrorMessage onChange={() => {}} onKeyDown={() => {}} />
      <InputBox type={'password'} label={'새 비밀번호'} value={''} placeholder={'특수문자 !@#$%^&*-_? 중 1개 이상을 포함해 입력해주세요'} message={''} isErrorMessage onChange={() => {}} onKeyDown={() => {}} />
      <InputBox type={'password'} label={'새 비밀번호 확인'} value={''} placeholder={'비밀번호를 입력해주세요'} message={''} isErrorMessage onChange={() => {}} onKeyDown={() => {}} />
      </div> 

      <div className='button-container'>
            <div className='button disable fullwidth' >변경하기</div>
      </div>
    </div>
  )
}
