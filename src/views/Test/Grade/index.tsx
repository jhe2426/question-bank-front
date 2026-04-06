import React, { memo, useEffect, useState } from 'react';

import '../style.css';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { usePagination } from 'src/hooks';
import { ExamResult } from 'src/types/interfaces';
import Pagination from 'src/components/Pagination';
import { useLocation, useNavigate, useParams } from 'react-router';
import { MESSAGE, RESPONSE_CODE } from 'src/constants';
import { useAuthStore } from 'src/stores';
import { GetExamResultListResponseDto } from 'src/apis/dto/response/examResult';
import { ResponseDto } from 'src/apis/dto/response';
import { getExamResultListRequest } from 'src/apis';


// interface: 시험 문제 레코드 컴포넌트 속성 //
interface QuestionTableItemProps {
    examResult: ExamResult;
    selectedAnswer?: {answer: number, userAnswer: number, questionOrder: number};
};

// component: 시험 문제 레코드 컴포넌트 //
const QuestionTableItem = memo(({ examResult, selectedAnswer }: QuestionTableItemProps) => {

    const { questionId, questionOrder, questionText, imageUrl, option1, option2, option3, option4, detailExplanationContent, answer} = examResult;

    // variable: option list //
    const options = [option1, option2, option3, option4];

    // variable: 문제 번호 아이콘 클래스 //
    const questionNubmerIconClass = selectedAnswer?.answer === selectedAnswer?.userAnswer ? 'question-number-icon correct' : 'question-number-icon incorrect';

    // variable: 문제 번호 텍스트 //
    const questionNubmerText = questionOrder > 10 ? `${questionOrder}.` : `0${questionOrder}.`;

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
                    <div className='question-number-box'>
                        <div className={questionNubmerIconClass}></div>
                        <div className='question-number'>{questionNubmerText}</div>
                    </div>
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
                        const optionClass = selectedAnswer?.userAnswer === number ? `answer-option checked number${number} active` : `answer-option checked number${number}`;

                        return (
                            <div key={number} className='option-item'>
                                    <div className={optionClass}></div>
                                    <div className='option-text'>{renderContentWithMath(option)}</div>            
                            </div>
                        );
                    })}                           

                </div>
            </div>


            <div className='explanation-container'>
                <div className='explanation-title'>해설: {answer}</div> 
                <div className='explanation-item'>
                {renderContentWithMath(detailExplanationContent)}
                </div>
            </div>

        </div>
    )

});

// interface: 답안 표기란 레코드 컴포넌트 속성 //
interface AnswerTableItemProps {
    examResult: ExamResult;
    selectedAnswer?: {answer: number, userAnswer: number, questionOrder: number};
    currentPage: number;
    setCurrentPage: (page: number) => void;
    QUESTION_COUNT_PER_PAGE: number;
};

// component: 답안 표기란 레코드 컴포넌트 //
const AnswerTableItem = memo(({ examResult, selectedAnswer ,currentPage, setCurrentPage, QUESTION_COUNT_PER_PAGE }: AnswerTableItemProps) => {

    const { questionOrder} = examResult;

    // variable: 정답 번호 아이콘 클래스 //
    const answerNubmerIconClass = selectedAnswer?.answer === selectedAnswer?.userAnswer ? 'answer-number-icon correct' : 'answer-number-icon incorrect';

    // event handler: 답안 번호 선택 이벤트 처리 //
    const onAnswerSheetNumberClickHandler = (questionOrder: number) => {
        const targetPage = Math.ceil(questionOrder / QUESTION_COUNT_PER_PAGE);
        if (targetPage == currentPage) return;
        setCurrentPage(targetPage);
    };

    // render: 답안 표기란 레코드 컴포넌트 렌더링 //
    return (
        <div className='answer-list'>
            <div className='answer-row'>
                <div className='answer-number-box'>
                    <div className={answerNubmerIconClass}></div>
                    <div className='answer-number' onClick={() => onAnswerSheetNumberClickHandler(questionOrder)}>{questionOrder}</div>
                </div>
                <div className='answer-options'>
                    { [1, 2, 3, 4].map((number) => {
                        
                        const optionClass = selectedAnswer?.userAnswer === number ? `answer-option checked number${number} active` : `answer-option checked number${number}`;
                        
                        return (
                            <div key={number} className={optionClass}></div>
                        )
            
                    })}
                </div>
            </div>
        </div>
    )
})

// component: 채점 화면 컴포넌트 //
export default function Grade() {

    // variable: 페이지당 문제 수 //
    const QUESTION_COUNT_PER_PAGE = 3;

    // state: accessToken 정보 상태 //
    const { accessToken } = useAuthStore();

    // state: 경로 상태 //
    const { pathname } = useLocation();

    // state: 경로 변수 상태 //
    const { groupId, filter } = useParams();

    // state: 페이지네이션 상태 //
    const {
        currentPage, setCurrentPage, totalPage,
        setTotalList, viewList
    } = usePagination<ExamResult>(QUESTION_COUNT_PER_PAGE);

    // state: 제목 //
    const [title, setTitle] = useState<string>('');
    
    // state: 문제 유형 //
    const [sourceType, setSourceType] = useState<string>('');

    // state: 시험 문제 리스트 //
    const [questionList, setQuestionList] = useState<ExamResult[]>([]);

    // state: 선택된 문제 정답 번호 리스트 //
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, {answer: number, userAnswer: number, questionOrder: number}>>({});

    // variable: RESPONSE CODE 구조 분해 상수 //
    const { DATABASE_ERROR, AUTHENTICATION_FAILED, NO_PERMISSION, NOT_EXIST_GROUP_ID, SUCCESS} = RESPONSE_CODE;

    // variable: 시험 유형 판별 //
    const isKillerExam = sourceType === '킬러문제';

    // variable: 제목 텍스트 //
    const titleText = isKillerExam ? sourceType : title;

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 채점 결과 기반으로 선택 답안 상태 초기화 //
    const initSelectedAnswers = (questionList: ExamResult[]) => {
        const initialState = questionList.reduce((acc, question) => {
            acc[question.questionId] = {
                answer: question.answer,
                userAnswer: question.userAnswer,
                questionOrder: question.questionOrder
            };
            return acc;
        }, {} as Record<number, { answer: number; userAnswer: number; questionOrder: number }>);

        setSelectedAnswers(initialState);
    };

    // function: get exam result list response 처리 함수 //
    const getExamResultListResponse = (responseBody: GetExamResultListResponseDto | ResponseDto | null) => {
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
        
        const { sourceType, detailedType, examResults } = responseBody as GetExamResultListResponseDto;
        setSourceType(sourceType);
        setTitle(detailedType);
        setQuestionList(examResults);
        setTotalList(examResults);
        initSelectedAnswers(examResults);
    };

    // effect: accessToken와 examInfo가 변경될 시 실행할 함수 //
    useEffect(() => {
        
        if (accessToken == null || filter == null) return;

        getExamResultListRequest(accessToken, Number(groupId), filter).then(getExamResultListResponse);
    }, [accessToken, pathname]);

    // render: 채점 화면 컴포넌트 렌더링 //
    return (
        <div className='test-wrapper'>

            <div className='test-body'>
                <div className='test-top'>
                    <div className='test-title'>{titleText}</div>
                </div>

                <div className='test-main'>

                    <div className='test-content'>
                        <div className='question-list has-explanation'>
                            {viewList.map((question, index) => <QuestionTableItem key={index} examResult={question} selectedAnswer={selectedAnswers[question.questionId]}/>)}
                        </div>
                    </div>

                    <div className='test-sidebar'>

                        <div className='test-sidebar-top'>

                            <div className='answer-sheet'>
                                <div className='answer-header'>답안 표기란</div>
                                {questionList.map((question, index) => <AnswerTableItem key={index} examResult={question} selectedAnswer={selectedAnswers[question.questionId]} currentPage={currentPage} setCurrentPage={setCurrentPage} QUESTION_COUNT_PER_PAGE={QUESTION_COUNT_PER_PAGE}/>)}
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
            </div>

            <div className='test-bottom'>
                <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />
            </div>
        </div>
    )
}
