import axios, { AxiosError, AxiosResponse } from 'axios';
import { PostExamResponseDto, ResponseDto } from './dto/response';
import { ApprovalCodeVerifyRequestDto, IdCheckRequestDto, PhoneNumberAuthRequestDto, PhoneNumberAuthVerifyRequestDto, SignInRequestDto, SignUpRequestDto } from './dto/request/auth';
import { GetUniversityListResponseDto, RefreshAccessTokenResponseDto, SignInResponseDto } from './dto/response/auth';
import { useAuthStore } from 'src/stores';
import { AUTH_ABSOLUTE_PATH } from 'src/constants';
import { Cookies } from 'react-cookie';
import { GetPastExamRoundListResponseDto } from './dto/response/pastExam';
import { GetMockExamQuestionListResponseDto, GetUnitAndChapterListResponseDto } from './dto/response/mockExam';
import { GetKillerExamQuestionListResponseDto } from './dto/response/killerExam';
import { GetIncorrectQuestionListResponseDto } from './dto/response/incorrectQuestions';
import { PostKillerExamGradingRequestDto } from './dto/request/killerExam';
import { PostPastExamGradingRequestDto } from './dto/request/pastExam';
import { PostMockExamGradingRequestDto } from './dto/request/mockExam';
import { PostIncorrectQuestionGradingRequestDto } from './dto/request/incorrectQuestions';
import { GetExamResultListResponseDto } from './dto/response/examResult';
import { PatchUserPasswordRequestDto } from './dto/request/myPage';
import { GetLearningRecordListResponseDto } from './dto/response/myPage';

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

const MOCK_EXAM_MODULE_URL = `${API_DOMAIN}/api/v1/mock-exam`;
const GET_UNIT_AND_CHAPTER_LIST_URL =`${MOCK_EXAM_MODULE_URL}/units-with-chapters`;
const GET_MOCK_EXAM_QUESTION_LIST_URL = (chapterId: number | string, difficulty: string, hasExplanation: boolean) => 
    `${MOCK_EXAM_MODULE_URL}/${chapterId}/${difficulty}/${hasExplanation}`;
const POST_MOCK_EXAM_GRADING_URL = `${MOCK_EXAM_MODULE_URL}/grading`;

const KILLER_EXAM_MODULE_URL = `${API_DOMAIN}/api/v1/killer-exam`;
const GET_KILLER_EXAM_QUESTION_LIST_URL = `${KILLER_EXAM_MODULE_URL}`;
const POST_KILLER_EXAM_GRADING_URL = `${KILLER_EXAM_MODULE_URL}/grading`;

const PAST_EXAM_MODULE_URL = `${API_DOMAIN}/api/v1/past-exam`;
const GET_PAST_EXAM_ROUND_LIST_URL = `${PAST_EXAM_MODULE_URL}`;
const GET_PAST_EXAM_QUESTION_LIST_URL = (pastExamId: number | string) => `${PAST_EXAM_MODULE_URL}/${pastExamId}`;
const POST_PAST_EXAM_GRADING_URL = `${PAST_EXAM_MODULE_URL}/grading`;

const INCORRECT_QUESTIONS_MODULE_URL =`${API_DOMAIN}/api/v1/incorrect-questions`;
const GET_INCORRECT_QUESTION_LIST_URL = (sourceType: string) => `${INCORRECT_QUESTIONS_MODULE_URL}/${sourceType}`;
const POST_INCORRECT_QUESTION_GRADING_URL = `${INCORRECT_QUESTIONS_MODULE_URL}/grading`;

const EXAM_RESULT_MODULE_URL = `${API_DOMAIN}/api/v1/exam-result`;
const GET_EXAM_RESULT_LIST_URL = (groupId: number, filter: string) => `${EXAM_RESULT_MODULE_URL}/${groupId}/${filter}`;

const MY_PAGE_MODULE_URL = `${API_DOMAIN}/api/v1/my-page`;
const PATCH_USER_PASSWORD_URL = `${MY_PAGE_MODULE_URL}/change-password`;
const GET_LEARNING_RECORD_LIST_URL = `${MY_PAGE_MODULE_URL}/learning-records`;

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

        if (originalRequet.url?.includes(SIGN_IN_URL)) return Promise.reject(error);

        // description: 리프레쉬 요청 자체에서 401에 대해서는 로그아웃 진행 //
        if (originalRequet.url?.includes(REFRESH_ACCESS_TOKEN_URL)) {
            clearAuth();
            window.location.href = AUTH_ABSOLUTE_PATH;
            return Promise.reject(error);
        }

        // description: 이미 리프레쉬 요청 중이면 다른 요청에 대해서 새로 발급한 액세스 토큰을 담아서 요청 //
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

// function: get unit and chapter list API 요청 함수 //
export const getUnitAndChapterListRequest = async (accessToken: string) => {
    const responseBody = await api.get(GET_UNIT_AND_CHAPTER_LIST_URL, bearerAuthorization(accessToken))
        .then(responseSuccessHandler<GetUnitAndChapterListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get past exam round list API 요청 함수 //
export const getPastExamRoundListRequest = async (accessToken: string) => {
    const responseBody = await api.get(GET_PAST_EXAM_ROUND_LIST_URL, bearerAuthorization(accessToken))
        .then(responseSuccessHandler<GetPastExamRoundListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get past exam question list API 요청 함수 //
export const getPastExamQuestionListRequest = async (accessToken: string, pastExamId: number | string) => {
    const responseBody = await api.get(GET_PAST_EXAM_QUESTION_LIST_URL(pastExamId), bearerAuthorization(accessToken))
        .then(responseSuccessHandler<GetPastExamRoundListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get killer exam question list API 요청 함수 //
export const getKillerExamQuestionListRequest = async (accessToken: string) => {
    const responseBody = await api.get(GET_KILLER_EXAM_QUESTION_LIST_URL, bearerAuthorization(accessToken))
        .then(responseSuccessHandler<GetKillerExamQuestionListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get mock exam question list API 요청 함수 //
export const getMockExamQuestionListRequest = async (accessToken: string, chapterId: number, difficulty: string, hasExplanation: boolean) => {
    const responseBody = await api.get(GET_MOCK_EXAM_QUESTION_LIST_URL(chapterId, difficulty, hasExplanation), bearerAuthorization(accessToken))
        .then(responseSuccessHandler<GetMockExamQuestionListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get incorrect question list API 요청 함수 //
export const getIncorrectQuestionListRequest = async (accessToken: string, sourceType: string) => {
    const responseBody = await api.get(GET_INCORRECT_QUESTION_LIST_URL(sourceType), bearerAuthorization(accessToken))
        .then(responseSuccessHandler<GetIncorrectQuestionListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: post killer exam grading API 요청 함수 //
export const postKillerExamGradingRequest = async (requestBody: PostKillerExamGradingRequestDto, accessToken: string) => {
    const responseBody = await api.post(POST_KILLER_EXAM_GRADING_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseSuccessHandler<PostExamResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: post past exam grading API 요청 함수 //
export const postPastExamGradingRequest = async (requestBody: PostPastExamGradingRequestDto, accessToken: string) => {
    const responseBody = await api.post(POST_PAST_EXAM_GRADING_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseSuccessHandler<PostExamResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: post mock exam grading API 요청 함수 //
export const postMockExamGradingRequest = async (requestBody: PostMockExamGradingRequestDto, accessToken: string) => {
    const responseBody = await api.post(POST_MOCK_EXAM_GRADING_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseSuccessHandler<PostExamResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: post incorrect question grading API 요청 함수 //
export const postIncorrectQuestionGradingReuqest = async (requestBody: PostIncorrectQuestionGradingRequestDto, accessToken: string) => {
    const responseBody = await api.post(POST_INCORRECT_QUESTION_GRADING_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseSuccessHandler<PostExamResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get exam result list API 요청 함수 //
export const getExamResultListRequest = async (accessToken: string, groupId: number, filter: string) => {
    const responseBody = await api.get(GET_EXAM_RESULT_LIST_URL(groupId, filter), bearerAuthorization(accessToken))
        .then(responseSuccessHandler<GetExamResultListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: patch user password API 요청 함수 //
export const patchUserPasswordRequest = async (requestBody: PatchUserPasswordRequestDto, accessToken: string) => {
    const responseBody = await api.patch(PATCH_USER_PASSWORD_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get learning record list API 요청 함수 //
export const getLearningRecordListRequest = async (accessToken: string) => {
    const responseBody = await api.get(GET_LEARNING_RECORD_LIST_URL, bearerAuthorization(accessToken))
        .then(responseSuccessHandler<GetLearningRecordListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}