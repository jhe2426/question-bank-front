import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import '../style.css';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { usePagination } from 'src/hooks';
import { Question } from 'src/types/interfaces';
import Pagination from 'src/components/Pagination';
import { useLocation, useParams } from 'react-router';
import { GetPastExamQuestionListResponseDto } from 'src/apis/dto/response/pastExam';
import { ResponseDto } from 'src/apis/dto/response';
import { MESSAGE, RESPONSE_CODE } from 'src/constants';
import { useAuthStore } from 'src/stores';
import { ExamInfo } from 'src/types/aliases';
import { getPastExamQuestionListRequest } from 'src/apis';

// interface: 시험 문제 레코드 컴포넌트 속성 //
interface QuestionTableItemProps {
    question: Question;
    selectedAnswer?: number;
    onClick: (questionId: number, answer: number) => void;
};

// component: 시험 문제 레코드 컴포넌트 //
const QuestionTableItem = memo(({ question, selectedAnswer, onClick }: QuestionTableItemProps) => {

    const { questionId, questionOrder, questionText, imageUrl, option1, option2, option3, option4, shortExplanation} = question;

    // variable: option list //
    const options = [option1, option2, option3, option4];

    // function: 텍스트와 수식을 분리해서 렌더링하는 함수 //
    const renderContentWithMath = (text: string) => {
        if (!text) return null;

        const parts = text.split(/(\$.*?\$)/g).filter(Boolean);

        return parts.map((part, index) => {
            if (part.startsWith("$") && part.endsWith("$")) {
                const mathValue = part.slice(1, -1).trim();
                return <InlineMath key={index} math={mathValue} />
            }
            
            return <span key={index}>{part}</span>;
        });
        
    };

    // render: 시험 문제 레코드 컴포넌트 렌더링 //
    return (
        <div className='question-item'>                    
            <div className='question-content'>
                <div className='question-header'>
                    <div className='question-number'>0{questionOrder}.</div>
                    <div className='question-text'>{questionText}</div>
                </div>

                {imageUrl &&
                <div className='image-box'>
                    <img src={imageUrl} alt={`문제 아이디 ${questionId}번의 이미지`} />
                </div>
                }                

                <div className='option-list'>

                    { options.map((option, index) => {
                        const number = index + 1;       
                        const optionClass = selectedAnswer === number ? `option-icon number${number} active` : `option-icon number${number}`;

                        return (
                            <div key={number} className='option-item' onClick={() => onClick(questionId, number)}>
                                    <div className={optionClass}></div>
                                    <div className='option-text'>{renderContentWithMath(option)}</div>            
                            </div>
                        );
                    })}                           

                </div>
            </div>

            {shortExplanation &&
            <div className='explanation-container'>
                <div className='explanation-title'>해설</div> 
                <div className='explanation-item'>
                {renderContentWithMath(shortExplanation)}
                </div>
            </div>
            }
        </div>
    )

});

// interface: 답안 표기란 레코드 컴포넌트 속성 //
interface AnswerTableItemProps {
    question: Question;
    selectedAnswer?: number;
    onClick: (questionId: number, questionOrder:number, answer: number) => void;
};

// component: 답안 표기란 레코드 컴포넌트 //
const AnswerTableItem = memo(({ question, selectedAnswer, onClick }: AnswerTableItemProps) => {

    const { questionId, questionOrder} = question;

    // render: 답안 표기란 레코드 컴포넌트 렌더링 //
    return (
        <div className='answer-list'>
            <div className='answer-row'>
                <div className='answer-number'>{questionOrder}</div>
                <div className='answer-options'>
                    { [1, 2, 3, 4].map((number) => {
                        
                        const optionClass = selectedAnswer === number ? `answer-option number${number} active` : `answer-option number${number}`;
                        
                        return (
                            <div key={number} className={optionClass} onClick={() => onClick(questionId, questionOrder, number)}></div>
                        )
            
                    })}
                </div>
            </div>
        </div>
    )
})

// component: 시험 화면 컴포넌트 //
export default function Exam() {

    // variable: 페이지당 문제 수 //
    const QUESTION_COUNT_PER_PAGE = 3;

    // state: accessToken 정보 상태 //
    const { accessToken } = useAuthStore();

    // state: 페이지네이션 상태 //
    const {
        currentPage, setCurrentPage, totalPage,
        setTotalList, viewList
    } = usePagination<Question>(QUESTION_COUNT_PER_PAGE);

    // state: 경로 상태 //
    const { pathname } = useLocation();

    // state: 경로 파라미터 조회 //
    const params = useParams();

    // state: 시험 문제 리스트 //
    const [questionList, setQuestionList] = useState<Question[]>([]);

    // state: 시험 제목 //
    const [examTitle, setExamTitle] = useState<string>('');

    // state: 간단한 해설 존재 여부 //
    const [hasExplanation, setHasExplanation] = useState<boolean>(true);

    // state: 선택된 문제 정답 번호 리스트 //
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

    // state: 타이머 상태 //
    const [time, setTime] = useState(90 * 60);


    // variable: RESPONSE CODE 구조 분해 상수 //
    const { DATABASE_ERROR, AUTHENTICATION_FAILED, PAST_EXAM_QUESTION_NOT_FOUND, SUCCESS} = RESPONSE_CODE;

    // variable: 시험 유형 판별 //
    const isMockExam = pathname.includes('mock-exam');
    const isPastExam = pathname.includes('past-exam');
    const isKillerExam = pathname.includes('killer-exam');
    const isIncorrectExam = pathname.includes('incorrect-exam');

    // variable: 해설 존재 여부에 따른 문제 리스트 클래스 //
    const questionListClass = hasExplanation ? 'question-list has-explanation' : 'question-list';

    // variable: 타이머 분 단위 //
    const minutes = Math.floor(time / 60);
    // variable: 타이머 초 단위 //
    const seconds = time % 60;

    // function: 전달된 파라미터를 기반으로 제목 생성하는 함수 //
    const initExamInfo = (): ExamInfo | null => {

        if (isMockExam && params?.unitId && params?.chapterId && params?.difficulty) {
            const { unitId, chapterId, difficulty  } = params;

            return {
                type: 'mock',
                title: `모의고사 ${unitId}단원 - ${difficulty}`,
                unitId,
                chapterId,
                difficulty
            };
        } 
        
        if (isPastExam && params?.pastExamId && params?.pastExamRound) {
            const { pastExamId, pastExamRound } = params;

            return {
                type: 'past',
                title: `${pastExamRound}회 기출문제`,
                pastExamId,
                pastExamRound
            };
        } 
        
        if (isKillerExam) {
            return {
                type: 'killer',
                title: '킬러문제'
            };
        } 
        
        if (isIncorrectExam && params?.questionType) {
            const { questionType } = params;

            return {
                type: 'incorrect',
                title: `${questionType} 오답`,
                questionType
            };
        }    

        return null;
    };

    // variable: URL 파라미터 기반으로 게싼된 시험 정보 //
    const examInfo = useMemo(() => initExamInfo(), [
        isMockExam,
        isPastExam,
        isKillerExam,
        isIncorrectExam,
        params
    ]);

    // function: get past exam question list response 처리 함수 //
    const getPastExamQuestionListResponse = (responseBody: GetPastExamQuestionListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? MESSAGE.SERVER_ERROR :
            responseBody.code === DATABASE_ERROR ?  MESSAGE.SERVER_ERROR :
            responseBody.code === AUTHENTICATION_FAILED ? MESSAGE.AUTHENTICATION_FAILED : 
            responseBody.code === PAST_EXAM_QUESTION_NOT_FOUND ? '기출문제를 찾을 수 없습니다' : '';

        const isSuccess = responseBody !== null && responseBody.code === SUCCESS;
        if (!isSuccess) {
            alert(message);
            return;
        }

        const { questions } = responseBody as GetPastExamQuestionListResponseDto;
        setQuestionList(questions);
        setTotalList(questions);
    };

    // event handler: 문제 영역 정답 변경 이벤트 처리 //
    const onQuestionAnswerClickHandler = useCallback((questionId: number, answer: number) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        })); 
    }, []);


    // event handler: 답안 표기란 정답 변경 이벤트 처리 //
    const onAnswerSheetClickHandler = useCallback((questionId: number, questionOrder: number, answer: number) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));    

        const targetPage = Math.ceil(questionOrder / QUESTION_COUNT_PER_PAGE);
        if (targetPage == currentPage) return;
        setCurrentPage(targetPage);

    }, [currentPage]);

    // effect: 컴포넌트 로드 시 실행할 함수 //
    useEffect(() => {

        if (!accessToken || examInfo == null) return;

        setExamTitle(examInfo.title);

        if (!isPastExam) return;

        if (examInfo.type == 'past') {
            getPastExamQuestionListRequest(accessToken, examInfo.pastExamId).then(getPastExamQuestionListResponse);
        }

        const timer = setInterval(() => {
            setTime((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
            return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [accessToken, examInfo]);

    // render: 시험 화면 컴포넌트 렌더링 //
    return (
        <div className='test-wrapper'>

            <div className='test-body'>
                <div className='test-top'>
                    <div className='test-title'>{examTitle}</div>
                </div>

                <div className='test-main'>

                    <div className='test-content'>
                        <div className={questionListClass}>
                            {viewList.map((question, index) => <QuestionTableItem key={index} question={question} selectedAnswer={selectedAnswers[question.questionId]} onClick={onQuestionAnswerClickHandler}/>)}
                        </div>
                    </div>

                    <div>{questionList.length}</div>

                    <div className='test-sidebar'>

                        <div className='test-sidebar-top'>

                            {isPastExam &&
                            <div className='timer-box'>
                                <div className='timer-icon'></div>
                                <div className='timer-content'>
                                    <div className='timer-title'>제한 시간 90분</div>
                                    <div className='timer-time'>
                                        <div className='text'>남은 시간</div>
                                        <div className='time'>{minutes}분 {seconds}초</div>
                                    </div>
                                </div>
                            </div>  
                            }

                            <div className='answer-sheet'>
                                <div className='answer-header'>답안 표기란</div>
                                {questionList.map((question, index) => <AnswerTableItem key={index} question={question} selectedAnswer={selectedAnswers[question.questionId]} onClick={onAnswerSheetClickHandler}/>)}
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
            </div>

            <div className='test-bottom'>
                <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />
                <div className='submit-button'>답안 제출</div>
            </div>
        </div>
    )
}
