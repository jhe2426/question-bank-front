import axios, { AxiosError, AxiosResponse } from 'axios';
import { ResponseDto } from './response';
import { ApprovalCodeVerifyRequestDto, IdCheckRequestDto, PhoneNumberAuthRequestDto, PhoneNumberAuthVerifyRequestDto, SignInRequestDto, SignUpRequestDto } from './request/auth';
import { GetUniversityListResponseDto, SignInResponseDto } from './response/auth';

// variable: URL 상수 //
const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

const AUTH_MODULE_URL = `${API_DOMAIN}/api/v1/auth`;

const SIGN_IN_URL = `${AUTH_MODULE_URL}/sign-in`;
const GET_UNIVERSITY_LIST_API_URL = `${AUTH_MODULE_URL}/universities`;
const ID_CHECK_URL = `${AUTH_MODULE_URL}/id-check`;
const PHONE_NUMBER_AUTH_URL = `${AUTH_MODULE_URL}/phone-number/auth-code`;
const PHONE_NUMBER_AUTH_VERIFY_URL = `${AUTH_MODULE_URL}/phone-number/auth-code/verify`;
const APPROVAL_CODE_VERIFY_URL = `${AUTH_MODULE_URL}/approval-code/verify`;
const SIGN_UP_URL = `${AUTH_MODULE_URL}/sign-up`;

// function: response 성공 처리 함수 //
const responseSuccessHandler = <T = ResponseDto>(response: AxiosResponse<T>) => {
    const { data } = response;
    return data;
};

// function: response 실패 처리 함수 //
const responseErrorHandler = (error: AxiosError<ResponseDto>) => {
    if (!error.response) return null;
    const { data } = error.response;
    return data;
};

// function: sign in API 요청 함수 //
export const signInRequest = async (requestBody: SignInRequestDto) => {
    const responseBody = await axios.post(SIGN_IN_URL, requestBody)
        .then(responseSuccessHandler<SignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: id check API 요청 함수 //
export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
    const responseBody = await axios.post(ID_CHECK_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 전화번호 인증 API 요청 함수 //
export const phoneNumberAuthRequest = async (requestBody: PhoneNumberAuthRequestDto) => {
    const responseBody = await axios.post(PHONE_NUMBER_AUTH_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 전화번호 인증 확인 API 요청 함수 //
export const phoneNumberAuthVerifyRequest = async (requestBody: PhoneNumberAuthVerifyRequestDto) => {
    const responseBody = await axios.post(PHONE_NUMBER_AUTH_VERIFY_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};
 
// function: get university list 요청 함수 //
export const getUniversityListRequest = async () => {
    const responseBody = await axios.get(GET_UNIVERSITY_LIST_API_URL)
        .then(responseSuccessHandler<GetUniversityListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 승인번호 확인 API 요청 함수 //
export const approvalCodeVerifyRequest = async (requestBody: ApprovalCodeVerifyRequestDto) => {
    const responseBody = await axios.post(APPROVAL_CODE_VERIFY_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: sign up API 요청 함수 //
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const responseBody = await axios.post(SIGN_UP_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};