import React, { useState } from 'react';

import './style.css';
import MyPagePath from 'src/types/aliases/my-page.alias';

// interface: 학습기록 화면 변경 페이지 컴포넌트 속성 //
interface Props {
    onPageChange: (page: MyPagePath) => void;
}

// component: 학습기록 화면 컴포넌트 //
export default function StudyHistory(props: Props) {

    // state: 틀린문제 기출시험 상세 결과 오픈 여부 상태 //
    const [isPastExamDetailOpen, setIsPastExamDetailOpen] = useState<boolean> (false);

    // variable: 틀린문제 아이콘 클래스 //
    const incorrectClass = isPastExamDetailOpen ? 'past-exam-incorrect-up-arrow-icon' : 'past-exam-incorrect-icon';

    // event handler: 틀린문제 기출시험 상세 결과 오픈 이벤트 처리 //
    const onPastExamDetailClickHandler = () => {
        setIsPastExamDetailOpen(!isPastExamDetailOpen);
    };

    // render: 학습기록 화면 렌더링 //
    return (
        <div id='study-history-container'>
            <div className='study-history-table'>
                <div className='tr'>
                    <div className='th study-history-number'>번호</div>
                    <div className='th study-history-date'>날짜</div>
                    <div className='th study-history-source-type'>문제 유형</div>
                    <div className='th study-history-score'>점수</div>
                    <div className='th study-history-incorrect'>틀린 문제</div>
                    <div className='th study-history-total'>전체 문제</div>
                    <div className='th study-history-exam-result'>합격 여부</div>
                </div>

                <div className='study-history-row'>
                    <div className='tr'>
                        <div className='td study-history-number'>번호</div>
                        <div className='td study-history-date'>날짜</div>
                        <div className='td study-history-source-type'>문제 유형</div>
                        <div className='td study-history-score'>점수</div>
                        <div className='td study-history-incorrect' onClick={onPastExamDetailClickHandler}>
                            <div className={incorrectClass}></div>
                        </div>
                        <div className='td study-history-total'>
                            <div className='total-question-icon'></div>
                        </div>
                        <div className='td study-history-exam-result fail'>불합격</div>
                    </div>
                
                    <div className={`past-exam-result-detail-wrapper ${isPastExamDetailOpen ? 'open' : ''}`}>
                        <div className='past-exam-result-detail'>
                            <div className='unit-score-card'>
                                <div className='unit-score-card-header'>
                                    <div className='title'>과목명</div>
                                </div>

                                <div className='unit-score-item'>
                                    <div className='unit-name'>데이터 이해</div>
                                    <div className='unit-score-badge pass'>0/10</div>
                                </div>

                                <div className='unit-score-item'>
                                    <div className='unit-name'>데이터 분석 기획</div>
                                    <div className='unit-score-badge fail'>0/10</div>
                                </div>

                                <div className='unit-score-item'>
                                    <div className='unit-name'>데이터 분석</div>
                                    <div className='unit-score-badge fail'>0/30</div>
                                </div>
                                    
                            </div>

                            <div className='incorrect-question-button'>틀린 문제 보러가기</div>
                        </div>
                    </div> 
                
                </div>



                <div className='study-history-row'>
                    <div className='tr'>
                        <div className='td study-history-number'>번호</div>
                        <div className='td study-history-date'>날짜</div>
                        <div className='td study-history-source-type'>문제 유형</div>
                        <div className='td study-history-score'>점수</div>
                        <div className='td study-history-incorrect'>
                            <div className='incorrect-icon'></div>
                        </div>
                        <div className='td study-history-total'>
                            <div className='total-question-icon'></div>
                        </div>
                        <div className='td study-history-exam-result fail'>불합격</div>


                    </div>
                </div>



                <div className='study-history-row'>
                    <div className='tr'>
                        <div className='td study-history-number'>번호</div>
                        <div className='td study-history-date'>날짜</div>
                        <div className='td study-history-source-type'>문제 유형</div>
                        <div className='td study-history-score'>점수</div>
                        <div className='td study-history-incorrect'>
                            <div className='incorrect-icon'></div>
                        </div>
                        <div className='td study-history-total'>
                            <div className='total-question-icon'></div>
                        </div>
                        <div className='td study-history-exam-result fail'>불합격</div>


                    </div>
                
                </div>



                <div className='study-history-row'>
                    <div className='tr'>
                        <div className='td study-history-number'>번호</div>
                        <div className='td study-history-date'>2025-04-04</div>
                        <div className='td study-history-source-type'>모의고사 3단원 - 상</div>
                        <div className='td study-history-score'>점수</div>
                        <div className='td study-history-incorrect'>
                            <div className='incorrect-icon'></div>
                        </div>
                        <div className='td study-history-total'>
                            <div className='total-question-icon'></div>
                        </div>
                        <div className='td study-history-exam-result pass'>합격</div>
                    </div>
                
                </div>
                


                
            </div>

            <div className='pagination-container'>
                <div className='pagination-box'>
                    <div className='pagination-button left'></div>
                    <div className='pagination'>
                        <div className='page'>1</div>
                        <div className='page'>2</div>
                        <div className='page'>3</div>
                        <div className='page'>4</div>
                        <div className='page'>5</div>
                        <div className='page'>6</div>
                        <div className='page'>7</div>
                        <div className='page'>8</div>
                        <div className='page'>9</div>
                        <div className='page'>10</div>
                    </div>
                    <div className='pagination-button right'></div>
                </div>
            </div>
        </div>
    )
}
