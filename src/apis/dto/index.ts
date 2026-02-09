import axios, { AxiosError, AxiosResponse } from 'axios';
import { ResponseDto } from './response';
import { SignInRequestDto } from './request/auth';
import { GetUniversityListResponseDto, SignInResponseDto } from './response/auth';

// variable: URL 상수 //
const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

const AUTH_MODULE_URL = `${API_DOMAIN}/api/v1/auth`;

const SIGN_IN_URL = `${AUTH_MODULE_URL}/sign-in`;
const GET_UNIVERSITY_LIST_API_URL = `${AUTH_MODULE_URL}/universities`;

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

// function: get university list 요청 함수 //
export const getUniversityListRequest = async () => {
    const responseBody = await axios.get(GET_UNIVERSITY_LIST_API_URL)
        .then(responseSuccessHandler<GetUniversityListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};