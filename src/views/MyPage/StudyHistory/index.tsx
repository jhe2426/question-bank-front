import React, { useEffect, useRef, useState } from 'react';

import './style.css';
import MyPagePath from 'src/types/aliases/my-page.alias';
import { GetLearningRecordListResponseDto } from 'src/apis/dto/response/myPage';
import { ResponseDto } from 'src/apis/dto/response';
import { GRADING_VIEW_ABSOLUTE_PATH, MESSAGE, RESPONSE_CODE } from 'src/constants';
import { usePagination } from 'src/hooks';
import { useAuthStore } from 'src/stores';
import { getLearningRecordListRequest, getUnitGradingResultListRequest } from 'src/apis';
import { useNavigate } from 'react-router';
import { LearningRecord, UnitGradingResult } from 'src/types/interfaces';
import GetUnitGradingResultListResponseDto from 'src/apis/dto/response/myPage/get-unit-grading-result-list.response.dto';

// interface: 학습기록 테이블 레코드 컴포넌트 속성 //
interface TableItemProps {
    accessToken: string | null;
    index: number;
    learningRecord: LearningRecord;
}

// component: 학습기록 테이블 레코드 컴포넌트 //
function TableItem({ accessToken, index, learningRecord }: TableItemProps) {

    const { groupId, solvedDate, detailedType, totalScore } = learningRecord;

    // state: 틀린문제 기출시험 상세 결과 오픈 여부 상태 //
    const [isPastExamDetailOpen, setIsPastExamDetailOpen] = useState<boolean> (false);

    // state: 기출문제 단원별 시험 결과 리스트 //
    const [unitGradingResultList, setUnitGradingResultList] = useState<UnitGradingResult[]>([]);

    // state: 기출문제 과락 여부 상태 //
    const [hasPastExamFailUnit, setHasPastExamFailUnit] = useState<boolean>(false);

    // variable: 문제 유형이 기출문제인지 판별 //
    const isPastExam = detailedType?.includes('기출문제') && !detailedType?.includes('기출문제 오답');

    // variable: 합격 여부 텍스트 // 
    const examResultText = !isPastExam ? '-' : totalScore >= 60 ? '합격' : '불합격';

    // variable: 틀린문제 아이콘 클래스 //
    const incorrectClass = !isPastExam ? 'incorrect-icon' : isPastExamDetailOpen ? 'past-exam-incorrect-up-arrow-icon' : 'past-exam-incorrect-icon';

    // variable: 합격 여부 클래스 //
    const examResultClass = !isPastExam ? 'td study-history-exam-result' : !hasPastExamFailUnit && totalScore >= 60 ? 'td study-history-exam-result pass' : 'td study-history-exam-result fail';

    // variable: RESPONSE CODE 구조 분해 상수 //
    const {  
        AUTHENTICATION_FAILED, DATABASE_ERROR, NO_PERMISSION, NOT_EXIST_GROUP_ID, SUCCESS
    } = RESPONSE_CODE;

    // reference: 대학교 셀렉터 컨테이너 요소 참조 //
    const rowRef = useRef<HTMLDivElement>(null);
    
    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: get unit grading result list response 처리 함수 //
    const getUnitGradingResultListResponse = (responseBody: GetUnitGradingResultListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? MESSAGE.SERVER_ERROR :
            responseBody.code === DATABASE_ERROR ?  MESSAGE.SERVER_ERROR :
            responseBody.code === AUTHENTICATION_FAILED ? MESSAGE.AUTHENTICATION_FAILED :
            responseBody.code === NO_PERMISSION ? MESSAGE.NO_PERMISSION :
            responseBody.code === NOT_EXIST_GROUP_ID ? '존재하지 않는 그룹 번호입니다' : '';

        const isSuccess = responseBody !== null && responseBody.code === SUCCESS;
        if (!isSuccess) {
            alert(message);
            return;
        }

        const { unitGradingResults } = responseBody as GetUnitGradingResultListResponseDto;
        setUnitGradingResultList(unitGradingResults);
        setHasPastExamFailUnit(unitGradingResults.some(result => !result.passed));
    }

    // event handler: 틀린 문제 보기 아이콘 클릭 이벤트 처리 //
    const onIncorrectQuestionsClick = () => {
        if (isPastExam) {
            const nextOpen = !isPastExamDetailOpen;
            setIsPastExamDetailOpen(!isPastExamDetailOpen);
            if (nextOpen) {
                if (accessToken == null) return;
                getUnitGradingResultListRequest(accessToken, groupId).then(getUnitGradingResultListResponse);
            }
            return;
        }
        if (totalScore >= 100) {
            alert('틀린 문제가 존재하지않습니다');
            return;
        }
        navigator(GRADING_VIEW_ABSOLUTE_PATH(groupId, 'incorrect'));
    }
    
    // event handler: 틀린 문제 버튼 클릭 이벤트 처리 // 
    const onIncorrectQuestionsButtonCliciki = () => {
        if (totalScore >= 100) {
            alert('틀린 문제가 존재하지않습니다');
            return;
        }
        navigator(GRADING_VIEW_ABSOLUTE_PATH(groupId, 'incorrect'));
    };

    // event handler: 전체 문제 보기 아이콘 클릭 이벤트 처리 //
    const onAllQuestionsClick = () => {
        navigator(GRADING_VIEW_ABSOLUTE_PATH(groupId, 'all'));
    };
    
    // effect:  틀린문제 기출시험 상세 결과 오픈 상태가 변경 될 시 실행할 함수 //
    useEffect(() => {    
        const onOutsideClickHandler = (event: MouseEvent) => {
            if (rowRef.current && !rowRef.current.contains(event.target as Node)) {
                setIsPastExamDetailOpen(false);
            }
        };

        if (!isPastExamDetailOpen) return;

        document.addEventListener('mousedown', onOutsideClickHandler);

        return () => {
            document.removeEventListener('mousedown', onOutsideClickHandler);
        };

    }, [isPastExamDetailOpen]);


    // effect: 컴포넌트 로드 시 실행할 함수 //
    useEffect(() => {
        if (accessToken == null) return;

        if (isPastExam) {
            getUnitGradingResultListRequest(accessToken, groupId).then(getUnitGradingResultListResponse);
        }
    }, []);

    // render: 학습기록 테이블 레코드 컴포넌트 렌더링 //
    return (
            <div className='study-history-row' ref={rowRef}> 
                <div className='tr'>
                    <div className='td study-history-number'>{index}</div>
                    <div className='td study-history-date'>{solvedDate}</div>
                    <div className='td study-history-source-type'>{detailedType}</div>
                    <div className='td study-history-score'>{totalScore}</div>
                    <div className='td study-history-incorrect'>
                        <div className={incorrectClass} onClick={onIncorrectQuestionsClick}></div>
                    </div>
                    <div className='td study-history-total'>
                        <div className='total-question-icon' onClick={onAllQuestionsClick}></div>
                    </div>
                    <div className={examResultClass}>{examResultText}</div>
                </div>
            
                {isPastExam ?
                <div className={`past-exam-result-detail-wrapper ${isPastExamDetailOpen ? 'open' : ''}`}>
                    <div className='past-exam-result-detail'>
                        <div className='unit-score-card'>
                            <div className='unit-score-card-header'>
                                <div className='title'>과목명</div>
                            </div>

                            {unitGradingResultList.map((unitGradingResult, index) => (
                                <div className='unit-score-item' key={index}>
                                    <div className='unit-name'>{unitGradingResult.unitName}</div>
                                    <div className={unitGradingResult.passed ? 'unit-score-badge pass' : 'unit-score-badge fail'}>{unitGradingResult.correctCount}/{unitGradingResult.unitId === 3 ? '30' : '10'}</div>
                                </div>
                            ))
                            
                            }   
                                
                        </div>
                        <div className='incorrect-question-button' onClick={onIncorrectQuestionsButtonCliciki}>틀린 문제 보러가기</div>
                    </div>
                </div> : <></>
                }
            </div>
    )
}

// interface: 학습기록 화면 변경 페이지 컴포넌트 속성 //
interface Props {
    onPageChange: (page: MyPagePath) => void;
}

// component: 학습기록 화면 컴포넌트 //
export default function StudyHistory(props: Props) {

    // variable: 페이지당 문제 수 //
    const LEARNING_RECORD_COUNT_PER_PAGE = 8;

    // state: accessToken 정보 상태 //
    const { accessToken } = useAuthStore();

    // state: 학습기록 리스트 //
    const [learningRecordList, setLearningRecordList] = useState<LearningRecord[] | null>(null);

    // state: 페이지네이션 상태 //
    const {
        currentPage, setCurrentPage, currentSection, setCurrentSection, totalSection, 
        pageList, viewList,
        setTotalList
    } = usePagination<LearningRecord>(LEARNING_RECORD_COUNT_PER_PAGE);

    // variable: RESPONSE CODE 구조 분해 상수 //
    const { 
    AUTHENTICATION_FAILED, DATABASE_ERROR, SUCCESS
    } = RESPONSE_CODE;

    // variable: learningRecordList가 null 또는 비어있는지 확인 //
    const isLearningRecordListEmpty = learningRecordList === null || learningRecordList.length === 0;

    // variable: 이전 섹션 버튼 문자열 //
    const preButtonClass = currentSection <= 1 ? 'pagination-button left disable' : 'pagination-button left';
    // variable: 다음 섹션 버튼 문자열 //
    const nextButtonClass = currentSection === totalSection ? 'pagination-button right disable' : 'pagination-button right';

    // function: 페이지 클래스 //
    const pageClass = (page: number) => currentPage === page ? 'page active' : 'page';

    // function: get learning record list response 처리 함수 //
    const getLearningRecordListResponse = (responseBody: GetLearningRecordListResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? MESSAGE.SERVER_ERROR :
            responseBody.code === DATABASE_ERROR ? MESSAGE.SERVER_ERROR :
            responseBody.code === AUTHENTICATION_FAILED ? MESSAGE.AUTHENTICATION_FAILED : '';

        const isSuccess = responseBody !== null && responseBody.code === SUCCESS;
        if (!isSuccess) {
            alert(message);
            return;
        }
        
        const { learningRecords } = responseBody as GetLearningRecordListResponseDto;
        setTotalList(learningRecords);
        setLearningRecordList(learningRecords);

    };

    // event handler: 페이지 변경 이벤트 처리 //
     const onPageClickHandler = (page: number) => {
        setCurrentPage(page);
    };
    
    // event handler: 이전 섹션 클릭 이벤트 처리 //
    const onPreSectionClickHandler = () => {
        if (currentSection <= 1) return;
        setCurrentSection(currentSection - 1);
        setCurrentPage((currentSection - 1) * 10);
    };
  
    // event handler: 다음 섹션 클릭 이벤트 처리 //
    const onNextSectionClickHandler = () => {
        if (currentSection === totalSection) return;
        setCurrentSection(currentSection + 1);
        setCurrentPage(currentSection * 10 + 1);
    };

    // effect: accessToken이 변경될 시 실행할 함수 //
    useEffect(() => {
        if (accessToken == null) return;

        getLearningRecordListRequest(accessToken).then(getLearningRecordListResponse);
    }, [accessToken])

    // render: 학습기록 화면 컴포넌트 렌더링 //
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

                <div>{isLearningRecordListEmpty}</div>
                {isLearningRecordListEmpty ? 
                <div className='empty-message'>아직 학습한 기록이 없습니다</div> :
                (viewList.map((learningRecord, index) => <TableItem key={index} accessToken={accessToken} index={(currentPage - 1) * LEARNING_RECORD_COUNT_PER_PAGE + index + 1} learningRecord={learningRecord} />))
                }
            </div>

            {isLearningRecordListEmpty ? <></> :
            <div className='pagination-container'>
                <div className='pagination-box'>
                    <div className={preButtonClass} onClick={onPreSectionClickHandler}></div>
                    <div className='pagination'>
                        {pageList.map((page, index) => <div key={index} className={pageClass(page)} onClick={() => onPageClickHandler(page)}>{page}</div>)}
                    </div>
                    <div className={nextButtonClass} onClick={onNextSectionClickHandler}></div>
                </div>
            </div>
            }           
        </div>
    )
}
