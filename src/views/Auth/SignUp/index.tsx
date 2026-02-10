import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';

import './style.css';
import InputBox from 'src/components/InputBox';
import Gender from 'src/types/aliases/gender.alias';
import { approvalCodeVerifyRequest, getUniversityListRequest, idCheckRequest, phoneNumberAuthRequest, phoneNumberAuthVerifyRequest, signUpRequest } from 'src/apis/dto';
import { GetUniversityListResponseDto } from 'src/apis/dto/response/auth';
import { ResponseDto } from 'src/apis/dto/response';
import { University } from 'src/types/interfaces';
import { ApprovalCodeVerifyRequestDto, IdCheckRequestDto, PhoneNumberAuthRequestDto, PhoneNumberAuthVerifyRequestDto, SignUpRequestDto } from 'src/apis/dto/request/auth';
import AuthPage from 'src/types/aliases/auth-page.alias';

// interface: 회원가입 컴포넌트 속성 //
interface Props {
    onPageChange: (page: AuthPage) => void;
}

// component: 회원가입 컴포넌트 //
export default function SignUp(props: Props) {

    const { onPageChange } = props;

    // state: 사용자 입력 정보 상태 //
    const [userName, setUserName] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [userPassword, setUserPassword] = useState<string>('');
    const [userPasswordCheck, setUserPasswordCheck] = useState<string>('');
    const [userPhoneNumber, setUserPhoneNumber] = useState<string>('');
    // state: 사용자 인증번호 상태 //
    const [userAuthCode, setUserAuthCode] = useState<string>('');
    const [userBirthDate, setUserBirthDate] = useState<string>('');
    const [userAddress, setUserAddress] = useState<string>('');
    const [userUniversity, setUserUniversity] = useState<University>({universityId:1, universityName:'기타'});
    // state: 사용자 승인번호 상태 //
    const [userApprovalCode, setUserApprovalCode] = useState<string>('');
    const [userGender, setUserGender] = useState<Gender | ''>('');

    // state: 사용자 입력 메시지 상태 //
    const [userNameMessage, setUserNameMessage] = useState<string>('');
    const [userIdMessage, setUserIdMessage] = useState<string>('');
    const [userPasswordMessage, setUserPasswordMessage] = useState<string>('');
    const [userPasswordCheckMessage, setUserPasswordCheckMessage] = useState<string>('');
    const [userPhoneNumberMessage, setUserPhoneNumberMessage] = useState<string>('');
    const [userAuthCodeMessage, setUserAuthCodeMessage] = useState<string>('');
    const [userBirthDateMessage, setUserBirthDateMessage] = useState<string>('');
    const [userAddressMessage, setUserAddressMessage] = useState<string>('');
    const [userApprovalCodeMessage, setUserApprovalCodeMessage] = useState<string>('');

    // state: 사용자 정보 메세지 에러 상태 //
    const [isUserIdMessageError, setIsUserIdMessageError] = useState<boolean>(false);
    const [isUserPhoneNumberMessageError, setIsUserPhoneNumberMessageError] = useState<boolean>(false);
    const [isUserAuthCodeMessageError, setIsUserAuthCodeMessageError] = useState<boolean>(false);
    const [isUserApprovalCodeMessageError, setIsUserApprovalCodeMessageError] = useState<boolean>(false);

    // state: 사용자 성별 에러 상태 //
    const [isUserGenderError, setIsUserGenderError] = useState<boolean>(false);

    // state: 사용자 입력 유효성 및 중복 확인 상태 //
    const [isUserIdChecked, setIsUserIdChecked] = useState<boolean>(false);
    const [isUserPasswordChecked, setIsUserPasswordChecked] = useState<boolean>(false);
    const [isUserPhoneNumberSend, setIsUserPhoneNumberSend] = useState<boolean>(false);
    const [isUserAuthCodeChecked, setIsUserAuthCodeChecked] = useState<boolean>(false);
    const [isUserApprovalCodeChecked, setIsUserApprovalCodeChecked] = useState<boolean>(false);

    // state: 사용자 입력 패턴 일치 상태 //
    const [isUserNamePatternMatched, setIsUserNamePatternMatched] = useState<boolean>(false);
    const [isUserIdPatternMatched, setIsUserIdPatternMatched] = useState<boolean>(false);
    const [isUserPasswordPatternMatched, setIsUserPasswordPatternMatched] = useState<boolean>(false);
    const [isUserPhoneNumberPatternMatched, setIsUserPhoneNumberPatternMatched] = useState<boolean>(false);
    const [isUserBirthDatePatternMatched, setIsUserBirthDatePatternMatched] = useState<boolean>(false);

    // state: 전화번호 인증 재전송 상태 //
    const [isPhoneNumberRetryError, setIsPhoneNumberRetryError] = useState<boolean>(false);
    
    // state: 대학교 리스트 상태 //
    const [userUniversityList, setUserUniversityList] = useState<University[]>([]);

    // state: 대학교 선택 셀럭터 오픈 여부 상태 //
    const [showUniversitySelector, setShowUniversityShowSelector] = useState<boolean>(false);

    // variable: 중복 확인 버튼 활성화 //
    const isUserIdCheckButtonActive = userId !== '' && isUserIdPatternMatched && !isUserApprovalCodeChecked;

    // variable: 전화번호 인증 버튼 활성화 //
    const isUserPhoneNumberAuthButtonActive = userPhoneNumber !== '' && isUserPhoneNumberPatternMatched && !isUserAuthCodeChecked;

    // variable: 전화번호 인증 확인 버튼 활성화 //
    const isUserAuthCodeButtonActive = userAuthCode !== '' && userAuthCode.length == 4 && !isUserAuthCodeChecked;

    // variable: 승인번호 확인 버튼 활성화 //
    const isUserApprovalCodeButtonActive = userApprovalCode !== '' && !isUserApprovalCodeChecked && isUserIdChecked;

    // variable: 회원가입 버튼 활성화 //
    const isFormFilled = 
        userName && userId && userPassword && userPasswordCheck && userPhoneNumber && userAuthCode && userBirthDate &&
        userAddress && userApprovalCode && userGender;
    const isVerified = 
        isUserIdChecked && isUserPasswordChecked && isUserPhoneNumberSend && isUserAuthCodeChecked && 
        isUserApprovalCodeChecked
    const isValidated =
        isUserNamePatternMatched && isUserIdPatternMatched && isUserPasswordPatternMatched && isUserPhoneNumberPatternMatched &&
        isUserBirthDatePatternMatched;
    const isSignUpButtonActive = isFormFilled && isVerified && isValidated;

    // variable: 전화번호 인증 버튼 재전송 모드 //
    const isPhoneNumberEditMode = isUserPhoneNumberSend && !isUserAuthCodeChecked;

    // variable: 전화번호 인증 버튼 이름 클래스 //
    const phoneNumberButtonClass = isPhoneNumberEditMode ? '수정' : '전화번호 인증';

    // variable: 사용자 성별 아이콘 클래스 //
    const  femaleIconClass = userGender === '여성' ? 'check-icon active': 'check-icon';
    const  maleIconClass = userGender === '남성' ? 'check-icon active': 'check-icon';

    // variable: 사용자 성별 메시지 클래스 //
    const genderMessageClass = `message ${isUserGenderError ? 'error' : ''}`;

    // variable: 회원가입 버튼 클래스 //
    const signUpButtonClass = `button ${isSignUpButtonActive ? 'primary' : 'disable'} fullwidth`;

    // reference: 대학교 셀렉터 컨테이너 요소 참조 //
    const selectorRef = useRef<HTMLDivElement>(null);

    // function: 사용자 전화번호 입력 포멧 변경 함수 //
    const formatPhoneNumber = (value: string) => {
        const phoneNumber = value.replace(/[^\d]/g, '');

        if (phoneNumber.length <= 3) {
            return phoneNumber;
        }

        if (phoneNumber.length <= 7) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        }

        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
    };

    // function: 사용자 생년월일 검증 함수 //
    const validateBirth = (birth: string) => {
        if (!/^[0-9]{8}$/.test(birth)) return false;

        const year = Number(birth.substring(0, 4));
        const month = Number(birth.substring(4, 6));
        const day = Number(birth.substring(6, 8));

        if (month < 1 || month > 12 || day < 1 || day > 31) return false;

        const date = new Date(year, month - 1, day);

        return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
    };

    // function: 공통적으로 쓰일 입력 정보 빈 값 체크 함수 //
    const clearErrorMessageIfEmpty = (value: string, setMessage: (messge: string) => void) => {
        if (value === '') {
            setMessage('');
            return true;
        }
        
        return false;
    };

    // function: 다음 포스트 코드 팝업 오픈 함수 //
    const open = useDaumPostcodePopup();

    // function: 다음 포스트 코드 완료 처리 함수 //
    const daumPostCompleteHandler = (data: Address) => {
        const { address } = data;
        setUserAddress(address);
        setUserAddressMessage('');
    };

    // function: id check response 처리 함수 //
    const idCheckResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다' :
            responseBody.code === 'EUI' ? '이미 사용중인 아이디입니다' :
            responseBody.code == 'VF' ? '아이디를 영문, 숫자를 혼용하여 3 ~ 15자 입력해주세요' : '사용 가능한 아이디입니다';

        const isSuccess = responseBody !== null && responseBody.code === 'SU';
        setUserIdMessage(message);
        setIsUserIdMessageError(!isSuccess);
        setIsUserIdChecked(isSuccess);
    };

    // function: 전화번호 인증 response 처리 함수 //
    const phoneNumberAuthResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다' : 
            responseBody.code === 'RE' ? '서버에 문제가 있습니다' :
            responseBody.code === 'EUP' ? '이미 사용중인 전화번호입니다' :
            responseBody.code === 'AR' ? '이미 인증번호가 발송되었습니다' :
            responseBody.code === 'SSF' ? '서버에 문제가 있습니다' : '인증번호가 전송되었습니다';
        
        const isSuccess = responseBody !== null && responseBody.code === 'SU';
        const isAlreadySent = responseBody?.code === 'AR';

        setUserPhoneNumberMessage(message);
        setIsUserPhoneNumberMessageError(!isSuccess);
        setIsUserPhoneNumberSend(isSuccess || isAlreadySent);
        if (responseBody?.code === 'AR') {
            setIsPhoneNumberRetryError(true);
        }
    }; 

    // function: 전화번호 인증 확인 response body 처리 함수 //
    const phoneNumberAuthVerifyResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다' : 
            responseBody.code === 'RE' ? '서버에 문제가 있습니다' :
            responseBody.code === 'PAF' ? '인증번호가 일치하지 않습니다' : '인증번호가 확인되었습니다';

        const isSuccess = responseBody !== null && responseBody.code === 'SU';
        setUserAuthCodeMessage(message);
        setIsUserAuthCodeMessageError(!isSuccess);
        setIsUserAuthCodeChecked(isSuccess);

        if (isSuccess) {
            setUserPhoneNumberMessage('');
            setIsUserPhoneNumberMessageError(false);
            setIsPhoneNumberRetryError(false);
        }
    };

    // function: 승인번호 확인 response body 처리 함수 //
    const approvalCodeVerifyResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다' :
            responseBody.code === 'EUI' ? '이미 사용중인 아이디입니다. 아이디를 변경 후 다시 시도해주세요' :
            responseBody.code === 'AAF' ? '승인번호가 일치하지 않습니다' : 
            responseBody.code === 'AU' ? '이미 사용된 승인번호입니다' : '승인번호가 확인되었습니다';
        
        const isSuccess = responseBody !== null && responseBody.code === 'SU';
        setUserApprovalCodeMessage(message);
        setIsUserApprovalCodeMessageError(!isSuccess);
        setIsUserApprovalCodeChecked(isSuccess);
    };

    // function: get university list response 처리 함수 //
    const getUniversityListResponse = (responseBody: GetUniversityListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { universities } = responseBody as GetUniversityListResponseDto;
        setUserUniversityList(universities);
    };

    // function: sign up response 처리 함수 //
    const signUpResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다' :
            responseBody.code === 'RE' ? '서버에 문제가 있습니다' :
            responseBody.code === 'EUI' ? '이미 사용중인 아이디입니다' :
            responseBody.code === 'EUP' ? '이미 사용중인 전화번호입니다' :
            responseBody.code === 'PAF' ? '전화번호 인증에 실패했습니다' :
            responseBody.code === 'AAF' ? '승인번호 인증에 실패했습니다' : '';

        const isSuccess = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccess) {
            if (responseBody && responseBody.code === 'EUI') {
                setUserIdMessage(message);
                setIsUserIdMessageError(true);
                return;
            }
            if (responseBody && responseBody.code === 'EUP') {
                setUserPhoneNumberMessage(message);
                setIsUserPhoneNumberMessageError(true);
                return;
            }
            if (responseBody && responseBody.code === 'PAF') {
                setUserAuthCodeMessage(message);
                setIsUserAuthCodeMessageError(true);
                return;
            }
            if (responseBody && responseBody.code === 'AAF') {
                setUserApprovalCodeMessage(message);
                setIsUserApprovalCodeMessageError(true);
                return;
            }

            alert(message);
            return;
        }

        alert('정상적으로 회원가입이 처리됐습니다');
        onPageChange('sign-in');
    };

    // event handler: 사용자 이름 변경 이벤트 처리 //
    const onUserNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserName(value);

        if (clearErrorMessageIfEmpty(value, setUserNameMessage)) return;

        const regexp = /^[가-힣]{2,6}$/;
        const isMatch = regexp.test(value);
        const message = isMatch ? '' : '이름은 2자 이상, 6자 이하 한글로 입력해주세요';
        setUserNameMessage(message);
        setIsUserNamePatternMatched(isMatch);
    };

    // event handler: 사용자 아이디 변경 이벤트 처리 //
    const onUserIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserId(value);

        if (clearErrorMessageIfEmpty(value, setUserIdMessage)) return;

        const regexp = /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]{3,15}$/;
        const isMatch = regexp.test(value);
        const message = isMatch ? '' : '영문, 숫자를 혼용하여 3 ~ 15자 입력해주세요';
        setUserIdMessage(message);
        setIsUserIdMessageError(!isMatch);
        setIsUserIdPatternMatched(isMatch);
        setIsUserIdChecked(false);
    };
    
    // event handler: 사용자 비밀번호 변경 이벤트 처리 //
    const onUserPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserPassword(value);

        if (clearErrorMessageIfEmpty(value, setUserPasswordMessage)) return;

        const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*-_?])[a-zA-Z0-9!@#$%^&*-_?]{8,20}$/;
        const isMatch = regexp.test(value);
        const message = isMatch ? '' : '영대소문자 + 숫자 + 특수문자(!@#$%^&*-_?)를 혼용하여 8 ~ 20자 입력해주세요';
        setUserPasswordMessage(message);
        setIsUserPasswordPatternMatched(isMatch);
    };

    // event handler: 사용자 비밀번호 확인 변경 이벤트 처리 //
    const onUserPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserPasswordCheck(value);
    };
    
    // event handler: 사용자 전화번호 변경 이벤트 처리 //
    const onUserPhoneNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        
        const onlyNumber = value.replace(/[^\d]/g, '');

        if (onlyNumber.length > 11) return;

        const formattedValue = formatPhoneNumber(onlyNumber);
        setUserPhoneNumber(formattedValue);

        if (clearErrorMessageIfEmpty(onlyNumber, setUserPhoneNumberMessage)) return;
        
        const regexp = /^010-\d{4}-\d{4}$/;
        const isMatch = regexp.test(value);
        const message = isMatch ? '' : '전화번호 11자 입력해주세요';
        
        setUserPhoneNumberMessage(message);
        setIsUserPhoneNumberMessageError(!isMatch);
        setIsUserPhoneNumberPatternMatched(isMatch);
        setIsUserPhoneNumberSend(false);
    };

    // event handler: 사용자 인증번호 변경 이벤트 처리 //
    const onUserAuthCodeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
    
        if (value.length > 4) return;

        setUserAuthCode(value);

        setUserAuthCodeMessage('');
        setIsUserAuthCodeMessageError(false);
        setIsUserAuthCodeChecked(false);

        if (isPhoneNumberRetryError) {
            setUserPhoneNumberMessage('');
            setIsUserPhoneNumberMessageError(false);
            setIsPhoneNumberRetryError(false);
        }
    };

    // event handler: 사용자 생년월일 변경 이벤트 처리 //
    const onUserBirthDateChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        const onlyNumber = value.replace(/[^\d]/g, '');
        if (onlyNumber.length > 8) return;

        setUserBirthDate(onlyNumber);

        if (clearErrorMessageIfEmpty(onlyNumber, setUserBirthDateMessage)) return;

        const isMatch = validateBirth(onlyNumber);

        const message = isMatch ? '' : '생년월일 8자 입력해주세요';
        setUserBirthDateMessage(message);
        setIsUserBirthDatePatternMatched(isMatch);
    };

    // event handler: 사용자 주소 변경 이벤트 처리 //
    const onUserAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserAddress(value);
    };

    // event handler: 사용자 대학교 선택 이벤트 처리 //
    const onUniversitySelectHandler = (universitiy: University) => {
        setUserUniversity(universitiy);
        setShowUniversityShowSelector(false);
    };

    // event handler: 사용자 인증번호 변경 이벤트 처리 //
    const onUserApprovalCodeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserApprovalCode(value);

        setUserApprovalCodeMessage('');
        setIsUserApprovalCodeMessageError(false);
        setIsUserApprovalCodeChecked(false);
    };    

    // event handler: 성별 변경 이벤트 처리 //
    const onGenderChangeHandler= (gender: Gender) => {
        setUserGender(gender);
        setIsUserGenderError(false);
    };

    // event handler: 대학교 셀렉터 오픈 이벤트 처리 //
    const onUniversitySelectorClickHandler = () => {
        setShowUniversityShowSelector(!showUniversitySelector);
    };


    // event handler: 중복 확인 버튼 클릭 이벤트 처리 //
    const onCheckUserIdClickHandler = () => {
        if (!isUserIdCheckButtonActive) return;

        const requestBody: IdCheckRequestDto = { userId };

        idCheckRequest(requestBody).then(idCheckResponse);
    };

    // event handler: 전화번호 인증 버튼 클릭 이벤트 처리 //
    const onSendAuthCodeClickHandler = () => {
        if (!isUserPhoneNumberAuthButtonActive) return;

        if (isPhoneNumberEditMode) {
            setIsUserPhoneNumberSend(false);
            setUserAuthCode('');
            setUserPhoneNumberMessage('');
            setIsUserPhoneNumberMessageError(false);
            setUserAuthCodeMessage('');
            setIsUserAuthCodeMessageError(false);
            return;
        }

        const phoneNumberWithoutHyphen = userPhoneNumber.replace(/[^\d]/g, '');

        const requestBody: PhoneNumberAuthRequestDto = { phoneNumber: phoneNumberWithoutHyphen };
        phoneNumberAuthRequest(requestBody).then(phoneNumberAuthResponse);
    };

    // event handler: 전화번호 인증 확인 버튼 클릭 이벤트 처리 //
    const onAuthCodeCheckClickHandler = () => {
        if (!isUserAuthCodeButtonActive) return;

        const phoneNumberWithoutHyphen = userPhoneNumber.replace(/[^\d]/g, '');

        const requestBody: PhoneNumberAuthVerifyRequestDto = {
            phoneNumber: phoneNumberWithoutHyphen,
            authCode: userAuthCode
        };
        
        phoneNumberAuthVerifyRequest(requestBody).then(phoneNumberAuthVerifyResponse);
    };  

    // event handler: 주소 검색 버튼 클릭 이벤트 처리 //
    const onSearchAddressClickHandler = () => {
        const width = 500;
        const height = 500;

        const left = window.screenLeft +  (window.innerWidth / 2) - (width / 2);
        const top = Math.ceil((window.screen.height - height) / 2);

        open({ 
            onComplete: daumPostCompleteHandler,
            width,
            height,
            left,
            top 
        });
    };

    // event handler: 승인번호 확인 버튼 클릭 이벤트 처리 //
    const onApprovalCodeCheckClickHandler = () => {
        if (!isUserApprovalCodeButtonActive) return;

        const requestBody: ApprovalCodeVerifyRequestDto = {
            userId,
            approvalCode: userApprovalCode
        };

        approvalCodeVerifyRequest(requestBody).then(approvalCodeVerifyResponse);
    };

    // event handler: 회원가입 버튼 클릭 이벤트 처리 //
    const onSignUpClickHandler = () => {
        if (!userName) setUserNameMessage('이름을 입력해주세요');
        if (!userPassword) setUserPasswordMessage('비밀번호를 입력해주세요');
        if (!userAddress) setUserAddressMessage('주소를 입력해주세요');
        if (!isUserIdChecked) {
            setUserIdMessage('아이디 중복 확인해주세요');
            setIsUserIdMessageError(true);
        }
        if (!isUserPhoneNumberSend) {
            setUserPhoneNumberMessage('전화번호 인증을 해주세요');
            setIsUserPhoneNumberMessageError(true);
        }
        if (!isUserAuthCodeChecked) {
            setUserAuthCodeMessage('인증번호 확인해주세요');
            setIsUserAuthCodeMessageError(true);
        }
        if (!isUserApprovalCodeChecked) {
            setUserApprovalCodeMessage('승인번호 확인해주세요');
            setIsUserApprovalCodeMessageError(true);
        }
        if (!userBirthDate) setUserBirthDateMessage('생년월일 8자를 입력해주세요');
        if (!userGender) setIsUserGenderError(true);
        if (!isSignUpButtonActive) return;
        
        const phoneNumberWithoutHyphen = userPhoneNumber.replace(/[^\d]/g, '');

        const requestBody: SignUpRequestDto = {
            userId,
            password: userPassword,
            phoneNumber: phoneNumberWithoutHyphen,
            approvalCode: userApprovalCode,
            name: userName,
            birthDate: userBirthDate,
            address: userAddress,
            universityId: userUniversity.universityId,
            gender: userGender
        };
        signUpRequest(requestBody).then(signUpResponse);
    };
    
    // effect: 컴포넌트 로드 시 실행할 함수 //
    useEffect(() => {
        getUniversityListRequest().then(getUniversityListResponse);
    }, []);

    // effect: 사용자 비밀번호 또는 비밀번호 확인이 변경될 시 실행할 함수 //
    useEffect(() => {
        if (clearErrorMessageIfEmpty(userPasswordCheck, setUserPasswordCheckMessage)) return;

        const isMatch = userPasswordCheck === userPassword;
        const message = isMatch ? '' : '비밀번호가 일치하지 않습니다';
        setUserPasswordCheckMessage(message);
        setIsUserPasswordChecked(isMatch);
    }, [userPassword, userPasswordCheck]);

    // effect: 대학교 셀렉터 컨테이너 상태가 변경될 시 실행할 함수 //
    useEffect(() => {
        const onOutsidClickHanlder= (event: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
                setShowUniversityShowSelector(false);
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
                <InputBox label={'이름'} type={'text'} value={userName} placeholder={'이름을 입력해주세요'} onChange={onUserNameChangeHandler} message={userNameMessage} isErrorMessage />
                
                <InputBox label={'아이디'} type={'text'} value={userId} placeholder={'아이디를 입력해주세요'} onChange={onUserIdChangeHandler} message={userIdMessage} buttonName={'중복확인'} onButtonClick={onCheckUserIdClickHandler} isErrorMessage={isUserIdMessageError} isButtonActive={isUserIdCheckButtonActive} readOnly={isUserApprovalCodeChecked} />

                <InputBox label={'비밀번호'} type={'password'} value={userPassword} placeholder={'특수문자 !@#$%^&*-_? 중 1개 이상을 포함해 입력해주세요'} onChange={onUserPasswordChangeHandler} message={userPasswordMessage} isErrorMessage />

                <InputBox label={'비밀번호 확인'} type={'password'} value={userPasswordCheck} placeholder={'비밀번호를 입력해주세요'} onChange={onUserPasswordCheckChangeHandler} message={userPasswordCheckMessage} isErrorMessage />

                <InputBox label={'전화번호'} type={'text'} value={userPhoneNumber} placeholder={'-빼고 입력해주세요'} onChange={onUserPhoneNumberChangeHandler} message={userPhoneNumberMessage} buttonName={phoneNumberButtonClass} onButtonClick={onSendAuthCodeClickHandler} isErrorMessage={isUserPhoneNumberMessageError} isButtonActive={isUserPhoneNumberAuthButtonActive} readOnly={isUserPhoneNumberSend}/>

                <InputBox label={'인증번호'} type={'text'} value={userAuthCode} placeholder={'인증번호 4자리를 입력해주세요'} onChange={onUserAuthCodeChangeHandler} message={userAuthCodeMessage} buttonName={'인증 확인'} onButtonClick={onAuthCodeCheckClickHandler} isErrorMessage={isUserAuthCodeMessageError} isButtonActive={isUserAuthCodeButtonActive} readOnly={isUserAuthCodeChecked}/>

                <InputBox label={'생년월일'} type={'text'} value={userBirthDate} placeholder={'생년월일 8자리 입력해주세요 (예: 19871009)'} onChange={onUserBirthDateChangeHandler} message={userBirthDateMessage} isErrorMessage />

                <InputBox label={'주소'} type={'text'} value={userAddress} placeholder={'주소를 입력해주세요'} onChange={onUserAddressChangeHandler} message={userAddressMessage} buttonName={'주소검색'} onButtonClick={onSearchAddressClickHandler} isErrorMessage isButtonActive={true} readOnly/>

                <div className='university-selector-container'>
                    <div className='label'>대학교 선택</div>

                    {showUniversitySelector ? 
                    <div ref={selectorRef} className='selector open' onClick={onUniversitySelectorClickHandler}>
                        <div className='selected-item'>{userUniversity ? userUniversity.universityName : '기타'}</div>
                        <div className='arrow-up-button'></div>
                        <div className='selector-box'>
                            {userUniversityList.map((university, index) => 
                            <div key={index} className='selector-option' onClick={() => onUniversitySelectHandler(university)}>{university.universityName}</div>
                            )}
                    </div>
                    </div> :
                    <div className='selector close' onClick={onUniversitySelectorClickHandler}>
                        <div className='selected-item'>{userUniversity ? userUniversity.universityName : '기타'}</div>
                        <div className='arrow-down-button'></div>
                    </div>
                    }
                </div>

                <InputBox label={'승인번호'} type={'text'} value={userApprovalCode} placeholder={'승인번호를 입력해주세요'} onChange={onUserApprovalCodeChangeHandler} message={userApprovalCodeMessage} buttonName={'승인번호 확인'} onButtonClick={onApprovalCodeCheckClickHandler} isErrorMessage={isUserApprovalCodeMessageError} isButtonActive={isUserApprovalCodeButtonActive} readOnly={isUserApprovalCodeChecked} />    

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
                        <div className={genderMessageClass}>{isUserGenderError ? '성별을 선택해주세요' : ''}</div>
                    </div>
                </div>
            </div>

            <div className='button-container'>
                <div className={signUpButtonClass} onClick={onSignUpClickHandler}>회원가입</div>
                <div className='link' onClick={() => onPageChange('sign-in')}>로그인</div>
            </div>
        </div>
    )
}
