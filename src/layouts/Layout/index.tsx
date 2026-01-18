import React from 'react';
import { Outlet } from 'react-router';

import './style.css';

// component: 공통 레이아웃 컴포넌트 //
export default function Layout() {

    // render: 공통 레이아웃 컴포넌트 렌더링 //
    return (
        <div>
            <Outlet />
        </div>
    )
}
