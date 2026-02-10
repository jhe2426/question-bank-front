import React from 'react';
import { Outlet } from 'react-router';

import './style.css';

// component: 공통 레이아웃 컴포넌트 //
export default function Layout() {

    // render: 공통 레이아웃 컴포넌트 렌더링 //
    return (
        <div id='layout-wrapper'>
            <div id='top-bar'>
                <div className='navigation-list'>
                    <div>마이페이지</div>
                    <div>로그아웃</div>
                </div>
            </div>
            
            <div id='main'>
                <div className='header-box'>
                    <div className='header'>ADSP 문제은행 시스템</div>
                </div>
                <Outlet />
            </div>
        </div>
    )
}
