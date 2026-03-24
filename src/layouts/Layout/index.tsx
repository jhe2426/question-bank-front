import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import './style.css';
import { logoutRequest, refreshAccessTokenRequest } from 'src/apis';
import { useAuthStore } from 'src/stores';
import { useCookies } from 'react-cookie';
import { RefreshAccessTokenResponseDto } from 'src/apis/dto/response/auth';
import { ResponseDto } from 'src/apis/dto/response';
import { AUTH_ABSOLUTE_PATH, MAIN_ABSOLUTE_PATH } from 'src/constants';

// component: 공통 레이아웃 컴포넌트 //
export default function Layout() {

    // state: 경로 상태 //
    const { pathname } = useLocation();

    // state: cookie 상태 //
    const[cookies] = useCookies();

    // state: accessToken 정보 상태 //
    const { accessToken, setAccessToken, clearAuth } = useAuthStore();

    // variable: csrf token //
    const csrfToken = cookies['csrfToken'];

    // variable: 메인 클래스 //
    const mainClass = pathname.startsWith(MAIN_ABSOLUTE_PATH) ? '' : 'small-margin';

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: refresh access token response 처리 함수 //
    const refreshAccessTokenResponse = (responseBody: RefreshAccessTokenResponseDto | ResponseDto | null) => {
        const isSuccess = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccess) {
            navigator(AUTH_ABSOLUTE_PATH);
            return;
        }
        
        const { accessToken } = responseBody as RefreshAccessTokenResponseDto;
        setAccessToken(accessToken);
    };

    // function: logout response 처리 함수 //
    const logoutResponse = (responseBody: ResponseDto | null) => {
        const isSuccess = responseBody !== null && responseBody.code === 'SU';
        if (isSuccess) {
            clearAuth();
            navigator(AUTH_ABSOLUTE_PATH);
        }
    };

    // event handler: 로그아웃 클릭 이벤트 처리 //
    const onLogoutClickHandler = () => {
        if (accessToken == null) {
            navigator(AUTH_ABSOLUTE_PATH);
            return;
        }
        
        logoutRequest(accessToken).then(logoutResponse);
    };

    // effect: 컴포넌트 로드 시 실행할 함수 //
    useEffect(() => {

        if(accessToken) return;
        

        if(!accessToken && !csrfToken) {
            navigator(AUTH_ABSOLUTE_PATH);
            return;
        }

        if (!accessToken && csrfToken) {
            refreshAccessTokenRequest(csrfToken).then(refreshAccessTokenResponse);
        }
    }, []);

    // render: 공통 레이아웃 컴포넌트 렌더링 //
    return (
        <div id='layout-wrapper'>
            <div id='top-bar'>
                <div className='navigation-list'>
                    <div>마이페이지</div>
                    <div onClick={onLogoutClickHandler}>로그아웃</div>
                </div>
            </div>
            
            <div id='main' className={mainClass}>
                <div className='header-box'>
                    <div className='header'>ADSP 문제은행 시스템</div>
                </div>
                <Outlet />
            </div>
        </div>
    )
}
