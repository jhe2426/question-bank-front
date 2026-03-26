import React, { useEffect } from 'react';

import './style.css';

// interface: 페이지네이션 컴포넌트 속성 //
interface Props {
    currentPage: number;
    totalPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

// component: 페이지네이션 컴포넌트 //
export default function Pagination({
    currentPage, totalPage,
    setCurrentPage
}: Props) {

    // variable: 이전 페이지 버튼 문자열 //
    const preButtonClass = currentPage <= 1 ? 'pagination-button left disable' : 'pagination-button left';
    // variable: 다음 페이지 버튼 문자열 //
    const nextButtonClass = currentPage === totalPage ? 'pagination-button right disable' : 'pagination-button right';

    // event handler: 이전 페이지 클릭 이벤트 처리 //
    const onPrePageClickHandler = () => {
        if (currentPage <= 1) return;
        setCurrentPage(currentPage - 1);
        window.scrollTo(0, 0);
    };

    // event handler: 다음 페이지 클릭 이벤트 처리 //
    const onNextPageClickHandler = () => {
        if (currentPage === totalPage) return;
        setCurrentPage(currentPage + 1);
        window.scrollTo(0, 0);
    };

    // render: 페이지네이션 컴포넌트 렌더링 //
    return (
        <div id='pagination'>
            <div className={preButtonClass} onClick={onPrePageClickHandler}></div>
            <div className='page'>{currentPage}/{totalPage}</div>
            <div className={nextButtonClass} onClick={onNextPageClickHandler}></div>
        </div>
    )
}