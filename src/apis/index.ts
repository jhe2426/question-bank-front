import axios, { AxiosError, AxiosResponse } from 'axios';
import { ResponseDto } from './dto/response';
import { ApprovalCodeVerifyRequestDto, IdCheckRequestDto, PhoneNumberAuthRequestDto, PhoneNumberAuthVerifyRequestDto, SignInRequestDto, SignUpRequestDto } from './dto/request/auth';
import { GetUniversityListResponseDto, RefreshAccessTokenResponseDto, SignInResponseDto } from './dto/response/auth';
import { useAuthStore } from 'src/stores';
import { AUTH_ABSOLUTE_PATH } from 'src/constants';
import { Cookies } from 'react-cookie';

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
const REFRESH_ACCESS_TOKEN_URL = `${AUTH_MODULE_URL}/refresh`;
const LOGOUT_URL = `${AUTH_MODULE_URL}/logout`;

// variable: refresh 토큰을 사용하여 access Token 발급 진행 여부 //
let isRefreshing = false;

// variable: refresh 토큰 발급 중에 들어오는 다른 요청들의 콜백 함수 저장 //
let refreshQueue: ((token: string) => void)[] = [];

// variable: cookie instance //
const cookies = new Cookies();

// function: axios instance 함수 //
const api = axios.create({
    baseURL: API_DOMAIN,
    withCredentials: true
});

// function: api response interceptor 함수 //
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequet = error.config;

        const authStoreAccessToken = useAuthStore.getState().accessToken;
        const { clearAuth, setAccessToken } = useAuthStore.getState();
 
        if (!originalRequet || !authStoreAccessToken || error.response?.status !== 401) return Promise.reject(error);

        // 리프레쉬 요청 자체에서 401에 대해서는 로그아웃 진행
        if (originalRequet.url?.includes(REFRESH_ACCESS_TOKEN_URL)) {
            clearAuth();
            window.location.href = AUTH_ABSOLUTE_PATH;
            return Promise.reject(error);
        }

        // 이미 리프레쉬 요청 중이면 다른 요청에 대해서 새로 발급한 액세스 토큰을 담아서 요청
        if (isRefreshing) {
            return new Promise((resolve) => {
                refreshQueue.push((newToken: string) => {
                    originalRequet.headers.Authorization = `Bearer ${newToken}`;
                    resolve(api(originalRequet));
                });
            });
        }

        isRefreshing = true;

        try {
            const csrfToken = cookies.get('csrfToken');
            if (!csrfToken) throw new Error('No CSRF Token');

            const response = await refreshAccessTokenRequest(csrfToken);

            if (response !== null && response.code !== 'SU') {
                throw new Error('');
            }
            
            const { accessToken } =  response as RefreshAccessTokenResponseDto;
            setAccessToken(accessToken);

            refreshQueue.forEach((cb) => cb(accessToken));
            refreshQueue = [];

            originalRequet.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequet);
        } catch (e) {
            refreshQueue = [];
            clearAuth();
            window.location.href = AUTH_ABSOLUTE_PATH;
            return Promise.reject(e);
        } finally {
            isRefreshing = false;
        }
    }

);

// function: Authorization Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } })

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
    const responseBody = await api.post(SIGN_IN_URL, requestBody)
        .then(responseSuccessHandler<SignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: id check API 요청 함수 //
export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
    const responseBody = await api.post(ID_CHECK_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 전화번호 인증 API 요청 함수 //
export const phoneNumberAuthRequest = async (requestBody: PhoneNumberAuthRequestDto) => {
    const responseBody = await api.post(PHONE_NUMBER_AUTH_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 전화번호 인증 확인 API 요청 함수 //
export const phoneNumberAuthVerifyRequest = async (requestBody: PhoneNumberAuthVerifyRequestDto) => {
    const responseBody = await api.post(PHONE_NUMBER_AUTH_VERIFY_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};
 
// function: get university list 요청 함수 //
export const getUniversityListRequest = async () => {
    const responseBody = await api.get(GET_UNIVERSITY_LIST_API_URL)
        .then(responseSuccessHandler<GetUniversityListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 승인번호 확인 API 요청 함수 //
export const approvalCodeVerifyRequest = async (requestBody: ApprovalCodeVerifyRequestDto) => {
    const responseBody = await api.post(APPROVAL_CODE_VERIFY_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: sign up API 요청 함수 //
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const responseBody = await api.post(SIGN_UP_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: refresh access token API 요청 함수 //
export const refreshAccessTokenRequest = async (csrfToken: string) => {
    const responseBody = await axios.post(REFRESH_ACCESS_TOKEN_URL, {}, 
            { 
                headers: { 'X-CSRF-TOKEN': csrfToken },
                withCredentials: true
            }
        )
        .then(responseSuccessHandler<RefreshAccessTokenResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: logout API 요청 함수 //
export const logoutRequest = async (accessToken: string) => {
    const responesBody = await api.post(LOGOUT_URL, {}, bearerAuthorization(accessToken)) 
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responesBody;
};