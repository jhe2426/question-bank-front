import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import '../style.css';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { usePagination } from 'src/hooks';
import { Question, UserAnswer } from 'src/types/interfaces';
import Pagination from 'src/components/Pagination';
import { useLocation, useNavigate, useParams } from 'react-router';
import { GetPastExamQuestionListResponseDto } from 'src/apis/dto/response/pastExam';
import { PostExamResponseDto, ResponseDto } from 'src/apis/dto/response';
import { MAIN_ABSOLUTE_PATH, MESSAGE, RESPONSE_CODE } from 'src/constants';
import { useAuthStore } from 'src/stores';
import { ExamInfo } from 'src/types/aliases';
import { getIncorrectQuestionListRequest, getKillerExamQuestionListRequest, getMockExamQuestionListRequest, getPastExamQuestionListRequest, postKillerExamGradingRequest, postMockExamGradingRequest, postPastExamGradingRequest } from 'src/apis';
import { GetKillerExamQuestionListResponseDto } from 'src/apis/dto/response/killerExam';
import { GetMockExamQuestionListResponseDto } from 'src/apis/dto/response/mockExam';
import { GetIncorrectQuestionListResponseDto } from 'src/apis/dto/response/incorrectQuestions';
import { PostKillerExamGradingRequestDto } from 'src/apis/dto/request/killerExam';
import { PostPastExamGradingRequestDto } from 'src/apis/dto/request/pastExam';
import { PostMockExamGradingRequestDto } from 'src/apis/dto/request/mockExam';

// interface: 시험 문제 레코드 컴포넌트 속성 //
interface QuestionTableItemProps {
    question: Question;
    selectedAnswer?: {answer: number, questionOrder: number};
    onClick: (questionId: number, answer: number, questionOrder: number) => void;
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
                        const optionClass = selectedAnswer?.answer === number ? `option-icon number${number} active` : `option-icon number${number}`;

                        return (
                            <div key={number} className='option-item' onClick={() => onClick(questionId, number, questionOrder)}>
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
    selectedAnswer?: {answer: number, questionOrder: number};
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
                        
                        const optionClass = selectedAnswer?.answer === number ? `answer-option number${number} active` : `answer-option number${number}`;
                        
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

    // variable: localStorage에 저장할 시험 데이터 키 //
    const EXAM_STORAGE_KEY = 'examData';
    // variable: localStorage 유효 시간(1시간) //
    const EXAM_STORAGE_EXPIRE_TIME = 1000 * 60 * 60;

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

    // state: 현재 풀이 회차를 식별하는 값 (모의고사/킬러문제 완료 여부 판단 기준) //
    const [sessionId, setSessionId] = useState<number>();

    // state: 간단한 해설 존재 여부 //
    const [hasExplanation, setHasExplanation] = useState<boolean>(true);

    // state: 선택된 문제 정답 번호 리스트 //
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, {answer: number, questionOrder: number}>>({});

    // state: 타이머 상태 //
    const [time, setTime] = useState(90 * 60);
    
    // state: 채점 그룹 아이디 //
    const [groupId, setGroupId] = useState<number>();


    // variable: RESPONSE CODE 구조 분해 상수 //
    const { DATABASE_ERROR, AUTHENTICATION_FAILED, PAST_EXAM_QUESTION_NOT_FOUND, NOT_EXIST_QUESTION_ID, SUCCESS} = RESPONSE_CODE;

    // variable: 시험 유형 판별 //
    const isMockExam = pathname.includes('mock-exam');
    const isPastExam = pathname.includes('past-exam');
    const isKillerExam = pathname.includes('killer-exam');
    const isIncorrectExam = pathname.includes('incorrect-questions');

    // variable: 해설 존재 여부에 따른 문제 리스트 클래스 //
    const questionListClass = hasExplanation ? 'question-list has-explanation' : 'question-list';

    // variable: 타이머 분 단위 //
    const minutes = Math.floor(time / 60);
    // variable: 타이머 초 단위 //
    const seconds = time % 60;

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 전달된 파라미터를 기반으로 제목 생성하는 함수 //
    const initExamInfo = (): ExamInfo | null => {

        if (isMockExam && params?.unitId && params?.chapterId && params?.difficulty) {
            const { unitId, chapterId, difficulty, hasExplanation } = params;

            const explanation = hasExplanation == 'true';
            let mappedDifficulty = '';

            if (difficulty === '상') mappedDifficulty = 'HIGH';
            else if (difficulty === '중') mappedDifficulty = 'MEDIUM';
            else if (difficulty === '하') mappedDifficulty = 'LOW';

            setHasExplanation(explanation);

            return {
                type: 'mock',
                title: `모의고사 ${unitId}단원 - ${difficulty}`,
                unitId: Number(unitId),
                chapterId: Number(chapterId),
                difficulty: mappedDifficulty,
                hasExplanation: explanation
            };
        } 
        
        if (isPastExam && params?.pastExamId && params?.pastExamRound) {
            const { pastExamId, pastExamRound } = params;

            return {
                type: 'past',
                title: `${pastExamRound}회 기출문제`,
                pastExamId: Number(pastExamId),
                pastExamRound: Number(pastExamRound)
            };
        } 
        
        if (isKillerExam) {
            return {
                type: 'killer',
                title: '킬러문제'
            };
        } 
        
        if (isIncorrectExam && params?.sourceType) {
            const { sourceType } = params;

            return {
                type: 'incorrect',
                title: `${sourceType} 오답`,
                sourceType 
            };
        }    

        return null;
    };

    // variable: URL 파라미터 기반으로 계산된 시험 정보 //
    const examInfo = useMemo(() => initExamInfo(), [
        isMockExam,
        isPastExam,
        isKillerExam,
        isIncorrectExam,
        params
    ]);

    // function: 시험 상태 저장 //
    const saveExamToStorage = (
        questionList: Question[],
        selectedAnswers: Record<number, { answer: number; questionOrder: number }>,
        sessionId: number | null,
        examInfo?: ExamInfo | null
    ) => {
        const data = {
            type: examInfo?.type,
            saveAt: Date.now(),
            questionList,
            selectedAnswers,
            sessionId,
            examInfo
        };
        
        localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(data));
    };

    // function: 시험 상태 불러오기 //
    const loadExamFromStorage = () => {
        const rawData = localStorage.getItem(EXAM_STORAGE_KEY);
        if (!rawData) return null;

        const data = JSON.parse(rawData);

        const isExpired = Date.now () - data.saveAt > EXAM_STORAGE_EXPIRE_TIME;
        if (isExpired) {
            clearExamStorage();
            return null;
        }

        return data;
    };

    // function: 시험 상태 삭제 //
    const clearExamStorage = () => {
        localStorage.removeItem(EXAM_STORAGE_KEY);
    };

    // function: 문제 리스트 기반 초기 답안 상태 생성 //
    const createInitialAnswers = (questions: Question[]): Record<number, {answer: number; questionOrder: number}> => {
        return questions.reduce((acc, q) => {
            acc[q.questionId] = {
                answer: 0,
                questionOrder: q.questionOrder
            }; 
        return acc;
        }, {} as Record<number, { answer: number; questionOrder: number }>);
    };

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
        setSelectedAnswers(createInitialAnswers(questions));
    };

    // function: get killer exam question list response 처리 함수 //
    const getKillerExamQuestionListResponse = (responseBody: GetKillerExamQuestionListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? MESSAGE.SERVER_ERROR :
            responseBody.code === DATABASE_ERROR ?  MESSAGE.SERVER_ERROR :
            responseBody.code === AUTHENTICATION_FAILED ? MESSAGE.AUTHENTICATION_FAILED : '';

        const isSuccess = responseBody !== null && responseBody.code === SUCCESS;
        if (!isSuccess) {
            alert(message);
            return;
        }

        const { sessionId, questions } = responseBody as GetKillerExamQuestionListResponseDto;
        setQuestionList(questions);
        setTotalList(questions);
        setSessionId(sessionId);
        const initialAnswer = createInitialAnswers(questions);
        setSelectedAnswers(initialAnswer);
        saveExamToStorage(questions, initialAnswer, sessionId, examInfo);
    };

    // function: get mock exam question list response 처리 함수 //
    const getMockExamQuestionListResponse = (responseBody: GetMockExamQuestionListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? MESSAGE.SERVER_ERROR :
            responseBody.code === DATABASE_ERROR ?  MESSAGE.SERVER_ERROR :
            responseBody.code === AUTHENTICATION_FAILED ? MESSAGE.AUTHENTICATION_FAILED : '';

        const isSuccess = responseBody !== null && responseBody.code === SUCCESS;
        if (!isSuccess) {
            alert(message);
            return;
        }

        const { sessionId, questions } = responseBody as GetKillerExamQuestionListResponseDto;
        if (questions.length === 0) {
            navigator(MAIN_ABSOLUTE_PATH);
            setTimeout(() => {
                alert('해당 조건의 모의고사 문제는 모두 풀었습니다.');
            }, 50);
            return;
        }

        setQuestionList(questions);
        setTotalList(questions);
        setSessionId(sessionId);
        const initialAnswer = createInitialAnswers(questions);
        setSelectedAnswers(initialAnswer);
        saveExamToStorage(questions, initialAnswer, sessionId, examInfo);
    };

    // function: get incorrect question list response 처리 함수 //
    const getIncorrectQuestionListResponse = (responseBody: GetIncorrectQuestionListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? MESSAGE.SERVER_ERROR :
            responseBody.code === DATABASE_ERROR ?  MESSAGE.SERVER_ERROR :
            responseBody.code === AUTHENTICATION_FAILED ? MESSAGE.AUTHENTICATION_FAILED : '';

        const isSuccess = responseBody !== null && responseBody.code === SUCCESS;
        if (!isSuccess) {
            alert(message);
            return;
        }

        const { questions } = responseBody as GetIncorrectQuestionListResponseDto;

        if (questions.length === 0 ) {
            navigator(MAIN_ABSOLUTE_PATH);
            setTimeout(() => {
                alert('오답문제가 존재하지 않습니다.');
            }, 50);
            return;
        }

        setQuestionList(questions);
        setTotalList(questions);
        const initialAnswer = createInitialAnswers(questions);
        setSelectedAnswers(initialAnswer);
        saveExamToStorage(questions, initialAnswer, null, examInfo);
    };

    // function: post exam grading response 처리 함수 //
    const postExamGradingResponse = (responseBody: PostExamResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? MESSAGE.SERVER_ERROR :
            responseBody.code === DATABASE_ERROR ?  MESSAGE.SERVER_ERROR :
            responseBody.code === NOT_EXIST_QUESTION_ID ? MESSAGE.SERVER_ERROR :
            responseBody.code === AUTHENTICATION_FAILED ? MESSAGE.AUTHENTICATION_FAILED : '';

        const isSuccess = responseBody !== null && responseBody.code === SUCCESS;
        if (!isSuccess) {
            alert(message);
            return;
        }

        const { groupId } = responseBody as PostExamResponseDto;
        setGroupId(groupId);
        if (!isPastExam) clearExamStorage();
    };

    // event handler: 문제 영역 정답 변경 이벤트 처리 //
    const onQuestionAnswerClickHandler = useCallback((questionId: number, answer: number, questionOrder: number) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: {answer, questionOrder},
        })); 
    }, []);


    // event handler: 답안 표기란 정답 변경 이벤트 처리 //
    const onAnswerSheetClickHandler = useCallback((questionId: number, questionOrder: number, answer: number) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: {answer, questionOrder},
        }));    

        const targetPage = Math.ceil(questionOrder / QUESTION_COUNT_PER_PAGE);
        if (targetPage == currentPage) return;
        setCurrentPage(targetPage);

    }, [currentPage]);

    // event handler: 기출문제 자동 제출 처리 //
    const submitPastExam = () => {
        if (!accessToken || !examInfo || examInfo.type !== 'past') return;

        const userAnswers: UserAnswer[] = Object.entries(selectedAnswers).map(
            ([questionId, value]) => ({
                questionId: Number(questionId),
                questionOrder: value.questionOrder,
                answer: value.answer
            })
        );


        const requestBody: PostPastExamGradingRequestDto = {
            detailedType: examInfo.title,
            pastExamId: Number(examInfo?.pastExamId),
            userAnswers
        };


        postPastExamGradingRequest(requestBody, accessToken).then(postExamGradingResponse);
    };

    // event handler: 채점하기 버튼 클릭 이벤트 처리 //
    const onClickGradingButtonHandler = () => {

        if (!accessToken) return;

        const unansweredCount = questionList.filter((q) => selectedAnswers[q.questionId].answer == 0).length;

        if (unansweredCount > 0) {
            const isConfirm = window.confirm(`아직 풀지 않은 문제가 ${unansweredCount}개 있습니다. 그래도 채점하시겠습니까?`);

            if (!isConfirm) return;
        };

        const sourceType = examInfo?.type;  
        const userAnswers: UserAnswer[] = Object.entries(selectedAnswers).map(
            ([questionId, value]) => ({
                questionId: Number(questionId),
                questionOrder: value.questionOrder,
                answer: value.answer
            })

        );

        if (sourceType === 'killer' && sessionId) {
            const requestBody: PostKillerExamGradingRequestDto = {
                sessionId,
                userAnswers
            };

            postKillerExamGradingRequest(requestBody, accessToken).then(postExamGradingResponse);
            return;
        }
        
        if (sourceType === 'past' && examInfo?.title) {
            const requestBody: PostPastExamGradingRequestDto = {
                detailedType: examInfo.title,
                pastExamId: Number(examInfo?.pastExamId),
                userAnswers
            };

            postPastExamGradingRequest(requestBody, accessToken).then(postExamGradingResponse);
            return;
        }

        if (sourceType === 'mock' && examInfo?.title && sessionId) {
            const requestBody: PostMockExamGradingRequestDto = {
                detailedType: examInfo.title,
                sessionId,
                userAnswers
            };

            postMockExamGradingRequest(requestBody, accessToken).then(postExamGradingResponse);
            return;
        }
    };

    // effect: pathname가 변경될 시 실행할 함수 //
    useEffect(() => {
        if (examInfo == null) return;

        const savedData = loadExamFromStorage();
        if (!savedData) return;
        

        if (examInfo.type === 'incorrect' && savedData.examInfo.type === 'incorrect') {
            if (examInfo.sourceType !== savedData.examInfo.sourceType) {
                clearExamStorage();
                return;
            }
        }

        if (savedData.type !== examInfo.type) {
            clearExamStorage();
        }
    }, [pathname]);

    // effect: accessToken와 examInfo가 변경될 시 실행할 함수 //
    useEffect(() => {

        if (!accessToken || examInfo == null) return;

        if (!isPastExam) {
            const savedData = loadExamFromStorage();

            if (savedData) {
                setQuestionList(savedData.questionList);
                setTotalList(savedData.questionList);
                setSelectedAnswers(savedData.selectedAnswers);
                setSessionId(savedData.sessionId);
                return;
            }
        }

        if (isKillerExam && examInfo.type == 'killer') {
            getKillerExamQuestionListRequest(accessToken).then(getKillerExamQuestionListResponse);
            return;
        } 

        if (isMockExam && examInfo.type == 'mock') {
            getMockExamQuestionListRequest(accessToken, examInfo.chapterId, examInfo.difficulty, examInfo.hasExplanation).then(getMockExamQuestionListResponse);
            return;
        }

        if (isIncorrectExam && examInfo.type == 'incorrect') {
            getIncorrectQuestionListRequest(accessToken, examInfo.sourceType).then(getIncorrectQuestionListResponse);
            return;
        }
 
        if (!isPastExam) return;

        if (examInfo.type == 'past') {
            getPastExamQuestionListRequest(accessToken, examInfo.pastExamId).then(getPastExamQuestionListResponse);
        }

        const timer = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    alert('시험 시간이 종료되었습니다. 자동으로 제출됩니다.');
                    submitPastExam();
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
                    <div className='test-title'>{examInfo?.title}</div>
                </div>

                <div className='test-main'>

                    <div className='test-content'>
                        <div className={questionListClass}>
                            {viewList.map((question, index) => <QuestionTableItem key={index} question={question} selectedAnswer={selectedAnswers[question.questionId]} onClick={onQuestionAnswerClickHandler}/>)}
                        </div>
                    </div>

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
                <div className='submit-button' onClick={onClickGradingButtonHandler}>답안 제출</div>
            </div>
        </div>
    )
}
