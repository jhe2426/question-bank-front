import React, { useEffect, useState } from 'react';

import './style.css';
import UnitSelector from './UnitSelector';
import { getPastExamRoundListRequest, getUnitAndChapterListRequest } from 'src/apis';
import { useAuthStore } from 'src/stores';
import { useNavigate } from 'react-router';
import { INCORRECT_QUESTIONS_TEST_ABSOLUTE_PATH, KILLER_EXAM_TEST_ABSOLUTE_PATH, MESSAGE, MOCK_EXAM_TEST_ABSOLUTE_PATH, PAST_EXAM_TEST_ABSOLUTE_PATH, RESPONSE_CODE } from 'src/constants';
import { ResponseDto } from 'src/apis/dto/response';
import { Chapter, MockExamPathParams, PastExamRound, Unit, UnitSummary } from 'src/types/interfaces';
import { GetUnitAndChapterListResponseDto } from 'src/apis/dto/response/mockExam';
import { GetPastExamRoundListResponseDto } from 'src/apis/dto/response/pastExam';
import { IncorrectType } from 'src/types/aliases';

// component: 메인 화면 컴포넌트 //
export default function Main() {

    // state: accessToken 정보 상태 //
    const { accessToken } = useAuthStore();

    // state: 단원 리스트 상태 //
    const [unitList, setUnitList] = useState<Unit[]>([]);
    // state: 선택한 단원 상태 //
    const [selectedUnit, setSelectedUnit] = useState<UnitSummary | null>(null);
    // state: 단원 옵션 리스트 상태 //
    const [unitOptionList, setUnitOptionList] = useState<UnitSummary[]>([]);

    // state: 챕터 옵션 리스트 상태 //
    const [chapterOptionList, setChapterOptionList] = useState<Chapter[]>([]);
    // state: 선택한 챕터 상태 //
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

    // state: 모의고사 난이도 상태 //
    const [mockLevel, setMockLevel] = useState<string>('');
    // state: 모의고사 난이도 선택 상태 //
    const [isMockLevelSelected, setIsMockLevelSelected] = useState<boolean>(false);
    // state: 선택한 해설 보기 옵션 상태 //
    const [isSolutionVisible, setIsSolutionVisible] = useState<boolean | null>(null);

    // state: 기출문제 회차 리스트 상태 //
    const [pastExamRoundList, setPastExamRoundList] = useState<PastExamRound[]>([]);
    // state: 선택한 기출문제 회차 상태 //
    const [selectedPastExamRound, setSelectedPastExamRound] = useState<PastExamRound | null>(null);

    // state: 단원 셀렉터 오픈 여부 상태 //
    const [showUnitSelector, setShowUnitSelector] = useState<boolean>(false);
    // state: 챕터 셀렉터 오픈 여부 상태 //
    const [showChapterSelector, setShowChapterSelector] = useState<boolean>(false);
    
    // state: 기출문제 셀렉터 오픈 여부 상태 //
    const [showPastSelector, setShowPastSelector] = useState<boolean>(false);

    // state: 선택한 오답문제 타입 상태 //
    const [selectedIncorrectType, setSelectedIncorrectType] = useState<IncorrectType | ''>('');

    // variable: RESPONSE CODE 구조 분해 상수 //
    const { DATABASE_ERROR, AUTHENTICATION_FAILED, SUCCESS} = RESPONSE_CODE;

    // variable: 모의고사 난이도 클래스 //
    const mockLevelHighClass = mockLevel === '상' || (isMockLevelSelected === false && mockLevel === '') ? 'level-button high' : 'level-button high disable';
    const mockLevelMiddleClass = mockLevel === '중' || (isMockLevelSelected === false && mockLevel === '')  ? 'level-button middle' : 'level-button middle disable';
    const mockLevelLowClass = mockLevel === '하' || (isMockLevelSelected === false && mockLevel === '')  ? 'level-button low' : 'level-button low disable';

    // variable: 모의고사 버튼 활성화 클래스 //
    const isMockExamButtonActive = selectedIncorrectType === '' && isMockLevelSelected && mockLevel !== '' && isSolutionVisible !== null && selectedUnit !== null && selectedChapter !== null;

    // variable: 모의고사 버튼 클래스 //
    const mockExamButtonClass = `mock-button ${isMockExamButtonActive ? 'primary' : 'disable'} fullwidth`;

    // variable: 해설 보기 옵션 클래스 //
    const solutionTrueOptionClass = isSolutionVisible === true ? 'option-item active' : 'option-item';
    const solutionFlaseOptionClass = isSolutionVisible === false ? 'option-item active' : 'option-item';

    // variable: 선택된 기출문제 아이템 클래스 //
    const pastSelectedItemClass = selectedPastExamRound !== null ? 'past-selected-item' : 'past-selected-item inactive';

    // variable: 오답문제 타입 버튼 활성화 //
    const isIncorrectTypeButtonActive = selectedIncorrectType !== '' && isMockExamButtonActive === false;

    // variable: 오답문제 타입 아이콘 클래스 //
    const mockIncorrectTypeIconClass = selectedIncorrectType === '모의고사' ? 'check-icon active' : 'check-icon';
    const pastIncorrectTypeIconClass = selectedIncorrectType === '기출문제' ? 'check-icon active' : 'check-icon';
    const killerIncorrectTypeIconClass = selectedIncorrectType === '킬러문제' ? 'check-icon active' : 'check-icon';

    // variable: 오답문제 타입 버튼 클래스 //
    const incorrectTypeButtonClass = `incorrect-button ${isIncorrectTypeButtonActive ? 'active' : 'disable'}`;

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 오답문제 타입 초기화 함수 //
    const clearIncorrectSelection = () => {
        if (selectedIncorrectType !== '') {
            setSelectedIncorrectType('');
        }
    };
    
    // function: get unit and chapter list response 처리 함수 //
    const getUnitAndChapterListResponse = (responseBody: GetUnitAndChapterListResponseDto | ResponseDto | null) => {
        const message =
        !responseBody ? MESSAGE.SERVER_ERROR :
        responseBody.code === DATABASE_ERROR ? MESSAGE.SERVER_ERROR :
        responseBody.code === AUTHENTICATION_FAILED ? MESSAGE.AUTHENTICATION_FAILED : '';

        const isSuccessed = responseBody !== null && responseBody.code === SUCCESS;
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { units } = responseBody as GetUnitAndChapterListResponseDto;
        setUnitList(units);
        setUnitOptionList(units.map(unit => ({ unitId: unit.unitId, unitName: unit.unitName })));
    };

    // function: get past exam round list response 처리 함수 //
    const getPastExamRoundListResponse = (responseBody: GetPastExamRoundListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? MESSAGE.SERVER_ERROR :
            responseBody.code === DATABASE_ERROR ? MESSAGE.SERVER_ERROR :
            responseBody.code === AUTHENTICATION_FAILED ? MESSAGE.AUTHENTICATION_FAILED : '';

        const isSuccessed = responseBody !== null && responseBody.code === SUCCESS;
        if (!isSuccessed) {
            alert(message);
            return;
        }
        
        const { pastExamRounds } = responseBody as GetPastExamRoundListResponseDto;
        setPastExamRoundList(pastExamRounds);
    };

    // event handler: 단원 셀렉터 오픈 이벤트 처리 //
    const onUnitSelectorClickHandler = () => {
        if (showChapterSelector) {
            setShowUnitSelector(false);
            return;
        }
        setShowUnitSelector(!showUnitSelector);
    };

    // event handler: 챕터 셀렉터 오픈 이벤트 처리 //
    const onChapterSelectorClickHandler = () => {
        setShowChapterSelector(!showChapterSelector);
    };

    // event handler: 기출문제 셀렉터 오픈 이벤트 처리 //
    const onPastSelectorClickHandler = () => {
        setShowPastSelector(!showPastSelector);
    };

    // event handler: 모의고사 난이도 선택 이벤트 처리 //
    const onMockLevelSelectHandler = (selectedMockLevel: string) => {
        clearIncorrectSelection();

        if (selectedMockLevel === mockLevel) {
            setMockLevel('');
            setIsMockLevelSelected(false);
            return;
        }
        setMockLevel(selectedMockLevel);
        setIsMockLevelSelected(true);
    };

    // event handler: 해설 보기 옵션 선택 이벤트 처리 //
    const onSolutionOptionSelectHandler = (isSolutionVisible: boolean) => {
        clearIncorrectSelection();

        setIsSolutionVisible(isSolutionVisible);
    };

    // event handler: 단원 선택 이벤트 처리 //
    const onUnitOptionSelectHandler = (unit: UnitSummary) => {
        clearIncorrectSelection();

        setSelectedUnit(unit);
        
        const selectedUnitDetail = unitList.find(item => item.unitId === unit.unitId);
        if (selectedUnitDetail) {
            setChapterOptionList(selectedUnitDetail.chapters);
        } else {
            setChapterOptionList([]);
        }

        setSelectedChapter(null);
        setShowUnitSelector(false);
    };

    // event handler: 챕터 선택 이벤트 처리 //
    const onChapterOptionSelectHandler = (chpater: Chapter) => {
        clearIncorrectSelection();

        setSelectedChapter(chpater);
        setShowChapterSelector(false);
    };

    // event handler: 기출문제 회차 선택 이벤트 처리 //
    const onPastExamRoundSelectHandler = (pastExamRound: PastExamRound) => {
        setSelectedPastExamRound(pastExamRound);
        setShowPastSelector(false);
    };
    
    // event handler: 오답문제 타입 변경 이벤트 처리 //
    const onIncorrectTypeChangeHandler = (incorrectType: IncorrectType) => {
        if (showChapterSelector) {
            setShowChapterSelector(false);
        }
        setSelectedIncorrectType(incorrectType);
    };

    // event handler: 모의고사 버튼 클릭 이벤트 처리 //
    const onMockExamClickHandler = () => {
        if (!isMockExamButtonActive) return;

        const mockExamParams: MockExamPathParams = {
            unitId: selectedUnit.unitId,
            chapterId: selectedChapter.chapterId,
            difficulty: mockLevel,
            hasExplanation: isSolutionVisible
        };

        navigator(MOCK_EXAM_TEST_ABSOLUTE_PATH(mockExamParams));
    };

    // event handler: 킬러문제 버튼 클릭 이벤트 처리 //
    const onKillerClickHandler = () => {
        navigator(KILLER_EXAM_TEST_ABSOLUTE_PATH);
    };

    // event handler: 오답문제 버튼 클릭 이벤트 처리 //
    const onIncorrectClickHanlder = () => {
        if (!selectedIncorrectType) return;

        navigator(INCORRECT_QUESTIONS_TEST_ABSOLUTE_PATH(selectedIncorrectType));
    };

    // effect: accessToken이 변경될 시 실행할 함수 //
    useEffect(() => {
        if (!accessToken) {
            return;
        }
        getUnitAndChapterListRequest(accessToken).then(getUnitAndChapterListResponse);
        getPastExamRoundListRequest(accessToken).then(getPastExamRoundListResponse);
    }, [accessToken]);

    // effect: 기출문제 회차를 선택할 시 실행할 함수 //
    useEffect(() => {
        if (selectedPastExamRound == null) {
            return;
        }

        navigator(PAST_EXAM_TEST_ABSOLUTE_PATH(selectedPastExamRound.pastExamId, selectedPastExamRound.pastExamRound));
    }, [selectedPastExamRound]);

    // effect: 오답문제 풀기 옵션 선택할 시 실행할 함수 //
    useEffect(() => {
        if (selectedIncorrectType) {   
            setMockLevel('');
            setIsSolutionVisible(null);
            setSelectedUnit(null);
            setSelectedChapter(null);
        }
    }, [selectedIncorrectType]);

    // render: 메인 화면 컴포넌트 렌더링 //
    return (
        <div id='main-wrapper'>
            <div className='content'>
                <div className='mock-section'>
                    <div className='title'>모의고사</div>
                    <div className='selector-container'>
                        <div className='selector-box'>
                            <div className='level-button-container'>
                                <div className={mockLevelHighClass} onClick={() => onMockLevelSelectHandler('상')}>상</div> 
                                <div className={mockLevelMiddleClass} onClick={() => onMockLevelSelectHandler('중')}>중</div> 
                                <div className={mockLevelLowClass} onClick={() => onMockLevelSelectHandler('하')}>하</div> 
                            </div>
                            <div className='solution-container'>
                                <div className='title'>해설 보기 옵션</div>
                                <div className='option-group'>
                                    <div className={solutionTrueOptionClass} onClick={() => onSolutionOptionSelectHandler(true)}>
                                        <div className='radio-icon'></div>
                                        <div className='label'>해설을 보고 문제 풀기</div>
                                    </div>

                                    <div className={solutionFlaseOptionClass} onClick={() => onSolutionOptionSelectHandler(false)}>
                                        <div className='radio-icon'></div>
                                        <div className='label'>해설을 보고 않고 문제 풀기</div>
                                    </div>
                                </div>
                            </div>
                            <div className='unit-container'>
                                <UnitSelector title={'단원별 문제'} options={unitOptionList} showUnitSelector={showUnitSelector} selectedItem={selectedUnit} onSelectorClickHandler={onUnitSelectorClickHandler} onOptionClickHanlder={onUnitOptionSelectHandler} getOptionName={(option) => option.unitName} />
                                { selectedUnit &&
                                <UnitSelector title={'챕터별 문제'} options={chapterOptionList} showUnitSelector={showChapterSelector} selectedItem={selectedChapter} onSelectorClickHandler={onChapterSelectorClickHandler} onOptionClickHanlder={onChapterOptionSelectHandler} getOptionName={(option) => option.chapterName} />
                                }

                            </div>
                        </div>
                        <div className='mock-button-container'>
                            <div className={mockExamButtonClass} onClick={onMockExamClickHandler}>모의고사 풀기</div>
                        </div>
                    </div>
                </div>
                <div className='side-panel'>
                    <div className='past-section'>
                        <div className='title'>기출문제</div>
                        { showPastSelector ?
                        <div className='past-selector open' onClick={onPastSelectorClickHandler}>
                            <div className={pastSelectedItemClass}>{selectedPastExamRound ? `${selectedPastExamRound.pastExamRound}회차` : '회차를 선택하세요'}</div>
                            <div className='arrow-up-button'></div>
                            <div className='past-selector-box'>
                                {pastExamRoundList.map((pastExamRound, index) =>
                                    <div key={index} className='past-selector-option' onClick={() => onPastExamRoundSelectHandler(pastExamRound)}>{pastExamRound.pastExamRound}회차</div>
                                )}
                            </div>
                        </div> :
                        <div className='past-selector close' onClick={onPastSelectorClickHandler}>
                            <div className={pastSelectedItemClass}>{selectedPastExamRound ? `${selectedPastExamRound.pastExamRound}회차` : '회차를 선택하세요'}</div>
                            <div className='arrow-down-button'></div>
                        </div>
                        }   
                    </div>
                    <div className='killer-section' onClick={onKillerClickHandler}>
                        <div className='title'>킬러문제</div>
                    </div>
                    <div className='incorrect-section'>
                        <div className='title'>오답문제 풀기</div>
                        <div className='incorrect-options'>
                            <div className='incorrect-option' onClick={() => onIncorrectTypeChangeHandler('모의고사')}>
                                <div className={mockIncorrectTypeIconClass}></div>
                                <div className='text'>모의고사</div>
                            </div>
                        
                            <div className='incorrect-option' onClick={() => onIncorrectTypeChangeHandler('기출문제')}>
                                <div className={pastIncorrectTypeIconClass}></div>
                                <div className='text'>기출문제</div>
                            </div>
                            
                            <div className='incorrect-option' onClick={() => onIncorrectTypeChangeHandler('킬러문제')}>
                                <div className={killerIncorrectTypeIconClass}></div>
                                <div className='text'>킬러문제</div> 
                            </div>
                            
                        </div>
                        <div className={incorrectTypeButtonClass} onClick={onIncorrectClickHanlder}>선택한 오답 풀기</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
