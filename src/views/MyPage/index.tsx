import React, { useState } from 'react';

import './style.css';
import MyPagePath from 'src/types/aliases/my-page.alias';
import ChangePasswordPage from './ChangePasswordPage';

// component: 학습기록, 비밀번호 변경 화면 컴포넌트 //
export default function MyPage() {
    
    // state: 페이지 상태 //
    const [page, setPage] = useState<MyPagePath> ('change-password');

    // variable: 네비게이션 클래스 //
    const studyHistoyNavigationClass = page === 'study-history' ? 'navigation active' : 'navigation';
    const changePasswordNavigationClass = page === 'change-password' ? 'navigation active' : 'navigation';

    // event handler: 페이지 변경 이벤트 처리 //
    const onPageChangeHandler = (page: MyPagePath) => {
        setPage(page);
    };
    
    // render: 학습기록, 비밀번호 변경 화면 렌더링 //
    return (
        <div id='mypage-wrapper'>
            <div className='mypage-sidebar'>
                <div className='title-box'>
                    <div className='title'>마이페이지</div>
                    <div className='navigation-list'>
                        <div className={studyHistoyNavigationClass} onClick={() => onPageChangeHandler('study-history')}>학습 기록</div>
                        <div className={changePasswordNavigationClass} onClick={() => onPageChangeHandler('change-password')}>비밀번호 변경</div>
                    </div> 
                </div>

            </div>

            <div className='mypage-content'>
                {page === 'study-history' ?
                <div></div> :
                <ChangePasswordPage onPageChange={onPageChangeHandler} />
                }
            </div>
        </div>
    )
}
