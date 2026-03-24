import React from 'react';

import '../style.css';
// component: 시험 화면 컴포넌트 //
export default function Exam() {

    // render: 시험 화면 컴포넌트 렌더링 //
    return (
        <div className='test-wrapper'>

            <div className='test-top'>
                <div className='test-title'>43회 기출문제</div>
            </div>

            <div className='test-main'>

                <div className='test-content'>
                    <div className='question-list'>
                        <div className='question-item'>                    
                            <div className='question-header'>
                                <div className='question-number'>01.</div>
                                <div className='question-text'>다음 중 빅데이터 분석의 특성에 대한 설명으로 옳지 않은 것은?</div>
                            </div>

                            <div className='option-list'>
                                <div className='option-item'>
                                    <div className='option-icon number1'></div>
                                    <div className='option-text'>가치 있는 정보 활용을 위해 데이터 처리 및 분석 속도가 중요하다.</div>
                                </div>

                                <div className='option-item'>
                                    <div className='option-icon number2'></div>
                                    <div className='option-text'>빅데이터 분석에는 정형 데이터뿐만 아니라 비정형, 반정형 데이터를 포함한다.</div>
                                </div>

                                <div className='option-item'>
                                    <div className='option-icon number3'></div>
                                    <div className='option-text'>방대한 데이터에서 노이즈 및 오류 제거를 통해 활용 데이터에 대한 품질과 신뢰성 제고가 요구된다.</div>
                                </div>

                                <div className='option-item'>
                                    <div className='option-icon number4'></div>
                                    <div className='option-text'>데이터 크기가 커질수록 더 많은 분석을 수행하는 것이 경쟁우위 확보의 원천이다.</div>
                                </div>
                            </div>
                        </div>

                        <div className='question-item'>                    
                            <div className='question-header'>
                                <div className='question-number'>02.</div>
                                <div className='question-text'>다음 중 빅데이터 시대의 위기 요인과 사례가 잘못 연결된 것은?</div>
                            </div>

                            <div className='option-list'>
                                <div className='option-item'>
                                    <div className='option-icon number1'></div>
                                    <div className='option-text'>데이터 오용 - 상업적 목적으로 데이터를 크롤링하여 개인정보 수집</div>
                                </div>

                                <div className='option-item'>
                                    <div className='option-icon number2'></div>
                                    <div className='option-text'>책임 원칙 훼손 - 특정 집단에 속했다고 취업이 안됨</div>
                                </div>

                                <div className='option-item'>
                                    <div className='option-icon number3'></div>
                                    <div className='option-text'>사생활 침해 - 여행 사실을 페이스북에 올린 사람의 집을 도둑이 노리는 사례 발생</div>
                                </div>

                                <div className='option-item'>
                                    <div className='option-icon number4'></div>
                                    <div className='option-text'>책임 원칙 훼손 - 범죄 예측 프로그램 때문에 범행을 저지르기 전에 체포, 자신의 신용도와 무관하게 부당한 대출 거부</div>
                                </div>
                            </div>
                        </div>

                        <div className='question-item'>                    
                            <div className='question-header'>
                                <div className='question-number'>03.</div>
                                <div className='question-text'>데이터베이스 관리시스템에 대한 설명으로 옳지 않은 것은?</div>
                            </div>

                            <div className='option-list'>
                                <div className='option-item'>
                                    <div className='option-icon number1'></div>
                                    <div className='option-text'>데이터베이스 관리로 모든 데이터 문제를 해결할 수 있다.</div>
                                </div>

                                <div className='option-item'>
                                    <div className='option-icon number2'></div>
                                    <div className='option-text'>데이터베이스 관리시스템은 다수 사용자가 데이터베이스에 접근하여 데이터베이스의 정의, 조작, 제어 등 데이터베이스 관리를 지원하는 소프트웨어이다. </div>
                                </div>

                                <div className='option-item'>
                                    <div className='option-icon number3'></div>
                                    <div className='option-text'>데이터베이스 관리시스템은 데이터의 중복을 제어하고, 중앙 집중식 통제를 통해 데이터의 일관성을 유지한다.</div>
                                </div>

                                <div className='option-item'>
                                    <div className='option-icon number4'></div>
                                    <div className='option-text'>데이터베이스 관리시스템에 장애가 발생하면 전체시스템의 업무처리가 중단되는 단점이 있다.</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='test-pagination'>
                        <div className='pagination-button left'></div>
                        <div className='page'>1/17</div>
                        <div className='pagination-button right'></div>
                    </div>
                </div>

                <div className='test-sidebar'>

                    <div className='test-sidebar-top'>

                        <div className='timer-box'>
                            <div className='timer-icon'></div>
                            <div className='timer-content'>
                                <div className='timer-title'>제한 시간 90분</div>
                                <div className='timer-time'>
                                    <div className='text'>남은 시간</div>
                                    <div className='time'>89분 05초</div>
                                </div>
                            </div>
                        </div>

                        <div className='answer-sheet'>

                            <div className='answer-header'>답안 표기란</div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='answer-list'>
                                <div className='answer-row'>
                                    <div className='answer-number'>1</div>
                                    <div className='answer-options'>
                                        <div className='answer-option number1'></div>
                                        <div className='answer-option number2'></div>
                                        <div className='answer-option number3'></div>
                                        <div className='answer-option number4'></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                    
                    <div className='submit-button'>답안 제출</div>

                </div>
            </div>

        </div>
    )
}
