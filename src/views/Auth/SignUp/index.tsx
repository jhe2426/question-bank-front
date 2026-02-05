import React, { useEffect, useRef, useState } from 'react';

import './style.css';
import InputBox from 'src/components/InputBox';
import Gender from 'src/types/aliases/gender.alias';

// component: 회원가입 컴포넌트 //
export default function SignUp() {

    // state: 대학교 선택 셀럭터 오픈 여부 상태 //
    const [showUniversitySelector, setUniversityShowSelector] = useState<boolean>(false);

    // state: 성별 상태 //
    const [gender, setGender] = useState<Gender | ''>('');

    // state: 성별 메시지 상태 //
    const [isGenderError, setIsGenderError] = useState<boolean>(false);

    // variable: 성별 아이콘 클래스 //
    const  femaleIconClass = gender === '여성' ? 'check-icon active': 'check-icon';
    const  maleIconClass = gender === '남성' ? 'check-icon active': 'check-icon';

    // variable: 성별 메시지 클래스 //
    const genderMessageClass = `message ${isGenderError ? 'error' : ''}`;

    // reference: 대학교 셀렉터 컨테이너 요소 참조 //
    const selectorRef = useRef<HTMLDivElement>(null);

    // event handler: 대학교 셀렉터 오픈 이벤트 처리 //
    const onUniversitySelectorClickHandler = () => {
        setUniversityShowSelector(!showUniversitySelector);
    };

    // event handler: 성별 변경 이벤트 처리 //
    const onGenderChangeHandler= (gender: Gender) => {
        setGender(gender);
        setIsGenderError(false);
    };

    // effect: 대학교 셀렉터 컨테이너 상태가 변경될 시 실행할 함수 //
    useEffect(() => {
        const onOutsidClickHanlder= (event: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
                setUniversityShowSelector(false);
            }
        };

        if  (!showUniversitySelector) return;

        document.addEventListener('mousedown', onOutsidClickHanlder);
        
    }, [showUniversitySelector]);


    // render: 회원가입 컴포넌트 렌더링 //
    return (
        <div id='auth-sign-up-container'>
            <div className='header'>회원가입</div>
            <div className='input-container'>
                <InputBox label={'이름'} type={'text'} value={''} placeholder={'이름을 입력해주세요'} onChange={() => {}} message={''} isErrorMessage />
                
                <InputBox label={'아이디'} type={'text'} value={''} placeholder={'아이디를 입력해주세요'} onChange={() => {}} message={''} buttonName={'중복확인'} onButtonClick={() => {}} isErrorMessage isButtonActive={false} />

                <InputBox label={'비밀번호'} type={'password'} value={''} placeholder={'특수문자 !@#$%^&*-_? 중 1개 이상을 포함해 입력해주세요'} onChange={() => {}} message={''} isErrorMessage />

                <InputBox label={'비밀번호 확인'} type={'password'} value={''} placeholder={'비밀번호를 입력해주세요'} onChange={() => {}} message={''} isErrorMessage />

                <InputBox label={'전화번호'} type={'text'} value={''} placeholder={'-빼고 입력해주세요'} onChange={() => {}} message={''} buttonName={'전화번호 인증'} onButtonClick={() => {}} isErrorMessage isButtonActive={false} />

                <InputBox label={'인증번호'} type={'text'} value={''} placeholder={'인증번호 4자리를 입력해주세요'} onChange={() => {}} message={''} buttonName={'인증 확인'} onButtonClick={() => {}} isErrorMessage isButtonActive={false} />

                <InputBox label={'생년월일'} type={'text'} value={''} placeholder={'생년월일 8자리 입력해주세요 (예: 19871009)'} onChange={() => {}} message={''} isErrorMessage />

                <InputBox label={'주소'} type={'text'} value={''} placeholder={'주소를 입력해주세요'} onChange={() => {}} message={''} buttonName={'주소검색'} onButtonClick={() => {}} isErrorMessage isButtonActive={true} readOnly/>

                <div className='university-selector-container'>
                    <div className='label'>대학교 선택</div>

                    {showUniversitySelector ? 
                    <div className='selector open'>
                        <div className='selected-item'>기타</div>
                        <div className='arrow-up-button' onClick={onUniversitySelectorClickHandler}></div>
                        <div ref={selectorRef} className='selector-box'>
                            <div className='selector-option'>기타</div>
                            <div className='selector-option'>가야대학교</div>
                            <div className='selector-option'>가야대학교</div>
                            <div className='selector-option'>가천대학교</div>
                            <div className='selector-option'>가톨릭관동대학교</div>
                            <div className='selector-option'>가톨릭꽃동네대학교</div>
                            <div className='selector-option'>가톨릭대학교</div>
                            <div className='selector-option'>가톨릭상지대학교</div>
                            <div className='selector-option'>감리교신학대학교</div>
                    </div>
                    </div> :
                    <div className='selector close' onClick={onUniversitySelectorClickHandler}>
                        <div className='selected-item'>기타</div>
                        <div className='arrow-down-button'></div>
                    </div>
                    }
                </div>

                <InputBox label={'승인번호'} type={'text'} value={''} placeholder={'승인번호를 입력해주세요'} onChange={() => {}} message={''} buttonName={'승인번호 확인'} onButtonClick={() => {}} isErrorMessage isButtonActive={false} />    

                <div className='gender-selector-container'>
                    <div className='label'>성별</div>
                    <div className="gender-selector-box">
                        <div className='gender-options'>
                            <div className='gender-option' onClick={() => onGenderChangeHandler('여성')}>
                                <div className='gender-text'>여성</div>
                                <div className={femaleIconClass}></div>
                            </div>
                            <div className='gender-option' onClick={() => onGenderChangeHandler('남성')}>
                                <div className='gender-text'>남성</div>
                                <div className={maleIconClass}></div>
                            </div>
                        </div>
                        <div className={genderMessageClass}>{isGenderError ? '성별을 선택해주세요' : ''}</div>
                    </div>
                </div>
            </div>

            <div className='button-container'>
                <div className='button disable fullwidth'>회원가입</div>
                <div className='link'>로그인</div>
            </div>
        </div>
    )
}
