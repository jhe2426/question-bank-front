import React, { useEffect, useState } from 'react';

import '../style.css';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { usePagination } from 'src/hooks';
import { Question } from 'src/types/interfaces';
import Pagination from 'src/components/Pagination';

// interface: 시험 문제 레코드 컴포넌트 속성 //
interface QuestionTableItemProps {
    question: Question;
    selectedAnswer?: number;
    onClick: (questionId: number, answer: number) => void;
};

// component: 시험 문제 레코드 컴포넌트 //
function QuestionTableItem({ question, selectedAnswer, onClick }: QuestionTableItemProps) {

    const { questionId, questionOrder, questionText, imageUrl, option1, option2, option3, option4, shortExplanation} = question;

    // variable: 해설 //
    const explanation = '업무 이해(Business Understanding): 프로젝트의 목표, 요구사항, 현재 상황 등을 비즈니스 관점에서 이해하고 정의합니다.\n데이터 이해(Data Understanding): 데이터를 수집하고, 탐색하고, 품질을 검증합니다.\n데이터 준비(Data Preparation): 모델링에 적합하도록 데이터를 정제, 변환, 통합합니다.\n모델링(Modeling): 다양한 모델링 기법을 적용하고 파라미터를 조정하여 최적의 모델을 구축합니다.\n평가(Evaluation): 모델의 성능이 비즈니스 목표에 부합하는지 평가하고, 다음 단계 진행 여부를 결정합니다.\n배포(Deployment): 완성된 모델을 실제 운영 환경에 적용하고 모니터링합니다.';

    // variable: option list //
    const options = [option1, option2, option3, option4];

    // function: 텍스트와 수식을 분리해서 렌더링하는 함수 //
    const renderOptionContent = (text: string) => {
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
                                    <div className='option-text'>{renderOptionContent(option)}</div>            
                            </div>
                        );
                    })}                           

                </div>
            </div>

            <div className='explanation-container'>
                <div className='explanation-title'>해설</div> 
                <div className='explanation-item'>
                {explanation}
                </div>
            </div>
        </div>
    )

}

// interface: 답안 표기란 레코드 컴포넌트 속성 //
interface AnswerTableItemProps {
    question: Question;
    selectedAnswer?: number;
    onClick: (questionId: number, questionOrder:number, answer: number) => void;
};

// component: 답안 표기란 레코드 컴포넌트 //
function AnswerTableItem({ question, selectedAnswer, onClick }: AnswerTableItemProps) {

    const { questionId, questionOrder} = question;

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
}

// component: 시험 화면 컴포넌트 //
export default function Exam() {

    // variable: 페이지당 문제 수 //
    const QUESTION_COUNT_PER_PAGE = 3;

    // state: 페이지네이션 상태 //
    const {
        currentPage, setCurrentPage, totalPage,
        setTotalList, viewList
    } = usePagination<Question>(QUESTION_COUNT_PER_PAGE);

    // state: 간단한 해설 존재 여부 //
    const [hasExplanation, setHasExplanation] = useState<boolean>(true);

    // state: 선택된 문제 정답 번호 리스트 //
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

    // state: 타이머 상태 //
    const [time, setTime] = useState(90 * 60);

    // variable: 해설 존재 여부에 따른 문제 리스트 클래스 //
    const questionListClass = hasExplanation ? 'question-list has-explanation' : 'question-list';

    // variable: 타이머 분 단위 //
    const minutes = Math.floor(time / 60);
    // variable: 타이머 초 단위 //
    const seconds = time % 60;

    // variable: 테스트 문제 리스트 //
    const questionList: Question[] = [
        {
            questionId: 1,
            questionOrder: 1,
            questionText: '다음 중 빅데이터 분석의 특성에 대한 설명으로 옳지 않은 것은?',
            imageUrl: 'https://localhost:4000/api/v1/file/모의고사/1d141986-dac8-42df-9963-34e495449a8a.png',
            option1: '$d(x,y) = \\sum_{j=1}^m | x_j - y_j |$은 블라블라이다.',
            option2: '$d(x,y) = \\sqrt{\\sum_{i=1}^m (x_i - y_i)^2}$',
            option3: '$d(x,y) = \\left[ \\sum_{i=1}^m | x_i - y_i |^m \\right]^{1/m}$',
            option4: '$Can(x,y) = \\sum_{i=1}^d \\frac{| x_i - y_i |}{| x_i | + | y_i |}$'
        },
        {
            questionId: 2,
            questionOrder: 2,
            questionText: '다음 중 빅데이터 시대의 위기 요인과 사례가 잘못 연결된 것은?',
            imageUrl: 'https://localhost:4000/api/v1/file/기출문제/fe422e02-b727-42b3-b936-cb132f26b821.png',
            option1: '$\\int_0^\\infty x^2 dx$',
            option2: '책임 원칙 훼손 - 특정 집단에 속했다고 취업이 안됨',
            option3: '사생활 침해 - 여행 사실을 페이스북에 올린 사람의 집을 도둑이 노리는 사례 발생',
            option4: '책임 원칙 훼손 - 범죄 예측 프로그램 때문에 범행을 저지르기 전에 체포, 자신의 신용도와 무관하게 부당한 대출 거부'
        },
        {
            questionId: 3,
            questionOrder: 3,
            questionText: '데이터베이스 관리시스템에 대한 설명으로 옳지 않은 것은?',
            imageUrl: null,
            option1: '데이터베이스 관리로 모든 데이터 문제를 해결할 수 있다.',
            option2: '데이터베이스 관리시스템은 다수 사용자가 데이터베이스에 접근하여 데이터베이스의 정의, 조작, 제어 등 데이터베이스 관리를 지원하는 소프트웨어이다. ',
            option3: '데이터베이스 관리시스템은 데이터의 중복을 제어하고, 중앙 집중식 통제를 통해 데이터의 일관성을 유지한다.',
            option4: '데이터베이스 관리시스템에 장애가 발생하면 전체시스템의 업무처리가 중단되는 단점이 있다.'
        },
        {
            questionId: 4,
            questionOrder: 4,
            questionText: '데이터베이스 관리시스템에 대한 설명으로 옳지 않은 것은?',
            imageUrl: null,
            option1: '데이터베이스 관리로 모든 데이터 문제를 해결할 수 있다.',
            option2: '데이터베이스 관리시스템은 다수 사용자가 데이터베이스에 접근하여 데이터베이스의 정의, 조작, 제어 등 데이터베이스 관리를 지원하는 소프트웨어이다. ',
            option3: '데이터베이스 관리시스템은 데이터의 중복을 제어하고, 중앙 집중식 통제를 통해 데이터의 일관성을 유지한다.',
            option4: '데이터베이스 관리시스템에 장애가 발생하면 전체시스템의 업무처리가 중단되는 단점이 있다.'
        },
        {
            questionId: 5,
            questionOrder: 5,
            questionText: '데이터베이스 관리시스템에 대한 설명으로 옳지 않은 것은?',
            imageUrl: null,
            option1: '데이터베이스 관리로 모든 데이터 문제를 해결할 수 있다.',
            option2: '데이터베이스 관리시스템은 다수 사용자가 데이터베이스에 접근하여 데이터베이스의 정의, 조작, 제어 등 데이터베이스 관리를 지원하는 소프트웨어이다. ',
            option3: '데이터베이스 관리시스템은 데이터의 중복을 제어하고, 중앙 집중식 통제를 통해 데이터의 일관성을 유지한다.',
            option4: '데이터베이스 관리시스템에 장애가 발생하면 전체시스템의 업무처리가 중단되는 단점이 있다.'
        },
        {
            questionId: 6,
            questionOrder: 6,
            questionText: '데이터베이스 관리시스템에 대한 설명으로 옳지 않은 것은?',
            imageUrl: null,
            option1: '데이터베이스 관리로 모든 데이터 문제를 해결할 수 있다.',
            option2: '데이터베이스 관리시스템은 다수 사용자가 데이터베이스에 접근하여 데이터베이스의 정의, 조작, 제어 등 데이터베이스 관리를 지원하는 소프트웨어이다. ',
            option3: '데이터베이스 관리시스템은 데이터의 중복을 제어하고, 중앙 집중식 통제를 통해 데이터의 일관성을 유지한다.',
            option4: '데이터베이스 관리시스템에 장애가 발생하면 전체시스템의 업무처리가 중단되는 단점이 있다.'
        },
        {
            questionId: 7,
            questionOrder: 7,
            questionText: '데이터베이스 관리시스템에 대한 설명으로 옳지 않은 것은?',
            imageUrl: null,
            option1: '데이터베이스 관리로 모든 데이터 문제를 해결할 수 있다.',
            option2: '데이터베이스 관리시스템은 다수 사용자가 데이터베이스에 접근하여 데이터베이스의 정의, 조작, 제어 등 데이터베이스 관리를 지원하는 소프트웨어이다. ',
            option3: '데이터베이스 관리시스템은 데이터의 중복을 제어하고, 중앙 집중식 통제를 통해 데이터의 일관성을 유지한다.',
            option4: '데이터베이스 관리시스템에 장애가 발생하면 전체시스템의 업무처리가 중단되는 단점이 있다.'
        },
        {
            questionId: 8,
            questionOrder: 8,
            questionText: '데이터베이스 관리시스템에 대한 설명으로 옳지 않은 것은?',
            imageUrl: null,
            option1: '데이터베이스 관리로 모든 데이터 문제를 해결할 수 있다.',
            option2: '데이터베이스 관리시스템은 다수 사용자가 데이터베이스에 접근하여 데이터베이스의 정의, 조작, 제어 등 데이터베이스 관리를 지원하는 소프트웨어이다. ',
            option3: '데이터베이스 관리시스템은 데이터의 중복을 제어하고, 중앙 집중식 통제를 통해 데이터의 일관성을 유지한다.',
            option4: '데이터베이스 관리시스템에 장애가 발생하면 전체시스템의 업무처리가 중단되는 단점이 있다.'
        }
    ];

    // event handler: 문제 영역 정답 변경 이벤트 처리 //
    const onQuestionAnswerClickHandler = (questionId: number, answer: number) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));    

    };

    // event handler: 답안 표기란 정답 변경 이벤트 처리 //
    const onAnswerSheetClickHandler = (questionId: number, questionOrder: number, answer: number) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));    

        const targetPage = Math.ceil(questionOrder / QUESTION_COUNT_PER_PAGE);
        if (targetPage == currentPage) return;
        setCurrentPage(targetPage);
       
    };

    // effect: 컴포넌트 로드 시 실행할 함수 //
    useEffect(() => {
        setTotalList(questionList);

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
    }, []);

    // render: 시험 화면 컴포넌트 렌더링 //
    return (
        <div className='test-wrapper'>

            <div className='test-body'>
                <div className='test-top'>
                    <div className='test-title'>43회 기출문제</div>
                </div>

                <div className='test-main'>

                    <div className='test-content'>
                        <div className={questionListClass}>
                            {viewList.map((question, index) => <QuestionTableItem key={index} question={question} selectedAnswer={selectedAnswers[question.questionId]} onClick={onQuestionAnswerClickHandler}/>)}
                        </div>

                        <InlineMath math="\\sum_{i=1}^n i = \\frac{n(n+1)}{2}" />
                    </div>

                    <div className='test-sidebar'>

                        <div className='test-sidebar-top'>

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
