import React, { useEffect, useState } from 'react';

import './style.css';
import UnitSelector from './UnitSelector';
import IncorrectType from 'src/types/aliases/incorrect-type.alias';
import { getPastExamRoundListRequest } from 'src/apis';
import { useAuthStore } from 'src/stores';
import { useNavigate } from 'react-router';
import { AUTH_ABSOLUTE_PATH, PAST_EXAM_TEST_ABSOLUTE_PATH } from 'src/constants';
import GetPastExamRoundListResponseDto from 'src/apis/dto/response/pastExam/get-past-exam-round-list.response.dto';
import { ResponseDto } from 'src/apis/dto/response';
import PastExamRound from 'src/types/interfaces/past-exam-round.interface';

// component: 메인 화면 컴포넌트 //
export default function Main() {

    // state: accessToken 정보 상태 //
    const { accessToken } = useAuthStore();

    // state: 선택한 단원 상태 //
    const [seletedUnit, setSeletedUnit] = useState<string>('');
    // state: 챕터 리스트 상태 //
    const [chpaterList, setChapterList] = useState<string[]>([]);
    // state: 선택한 챕터 상태 //
    const [seletedChapter, setSeletedChapter] = useState<string>('');

    // state: 기출문제 회차 리스트 상태 //
    const [pastExamRoundList, setPastExamRoundList] = useState<PastExamRound[]>([]);
    // state: 선택한 기출문제 회차 상태 //
    const [seletedPastExamRound, setSeletedPastExamRound] = useState<PastExamRound | null>(null);

    // state: 단원 셀렉터 오픈 여부 상태 //
    const [showUnitSelector, setShowUnitSelector] = useState<boolean>(false);
    // state: 챕터 셀렉터 오픈 여부 상태 //
    const [showChapterSelector, setShowChapterSelector] = useState<boolean>(false);
    
    // state: 기출문제 셀렉터 오픈 여부 상태 //
    const [showPastSelector, setShowPastSelector] = useState<boolean>(false);

    // state: 오답문제 타입 상태 //
    const [incorrectType, setIncorrectType] = useState<IncorrectType | ''>('');

    // variable: 테스트 단원 배열 //
    const units: string[] = ['데이터이해', '데이터 분석 기회', '데이터분석'];
    // variable: 테스트 챕터 배열 //
    const chapterMap: Record<string, string[]> = {
        '데이터이해': ['데이터이해', '데이터의 가치와 미래', '가치 창조를 위한 데이터 사이언스와 전략 인사이트'],
        '데이터 분석 기회': ['데이터 분석 기획의 이해', '분석 마스터 플랜'],
        '데이터분석': ['R기초와 데이터 마트', '통계분석', '정형 데이터 마이닝']
    };

    // variable: 선택된 기출문제 아이템 클래스 //
    const pastSelectedItemClass = seletedPastExamRound !== null ? 'past-selected-item' : 'past-selected-item inactive';

    // variable: 오답문제 타입 버튼 활성화 //
    const isIncorrectTypeButtonActive = incorrectType !== '';

    // variable: 오답문제 타입 아이콘 클래스 //
    const mockIncorrectTypeIconClass = incorrectType === '모의고사' ? `check-icon active` : `check-icon`;
    const pastIncorrectTypeIconClass = incorrectType === '기출문제' ? `check-icon active` : `check-icon`;
    const killerIncorrectTypeIconClass = incorrectType === '킬러문제' ? `check-icon active` : `check-icon`;

    // variable: 오답문제 타입 버튼 클래스 //
    const incorrectTypeButtonClass = `incorrect-button ${isIncorrectTypeButtonActive ? 'active' : 'disable'}`;

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: get past exam round list response 처리 함수 //
    const getPastExamRoundListResponse = (responseBody: GetPastExamRoundListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다' :
            responseBody.code === 'AF' ? '인증에 실패했습니다' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
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

    // event handler: 단원 선택 이벤트 처리 //
    const onUnitOptionSelectHandler = (unit: string) => {
        setSeletedUnit(unit);
        setChapterList(chapterMap[unit]);
        setSeletedChapter('');
        setShowUnitSelector(false);
    };

    // event handler: 챕터 셀렉터 오픈 이벤트 처리 //
    const onChapterSelectorClickHandler = () => {
        setShowChapterSelector(!showChapterSelector);
    };

    // event handler: 챕터 선택 이벤트 처리 //
    const onChapterOptionSelectHandler = (chpater: string) => {
        setSeletedChapter(chpater);
        setShowChapterSelector(false);
    };

    // event handler: 기출문제 셀렉터 오픈 이벤트 처리 //
    const onPastSelectorClickHandler = () => {
        setShowPastSelector(!showPastSelector);
    };

    // event handler: 기출문제 회차 선택 이벤트 처리 //
    const onPastExamRoundSelectHandler = (pastExamRound: PastExamRound) => {
        setSeletedPastExamRound(pastExamRound);
        setShowPastSelector(false);
    };
    
    // event handler: 오답문제 타입 변경 이벤트 처리 //
    const onIncorrectTypeChangeHandler = (incorrectType: IncorrectType) => {
        setIncorrectType(incorrectType);
    };

    // effect: accessToken이 변경될 시 실행할 함수 //
    useEffect(() => {
        if (!accessToken) {
            return;
        }
        getPastExamRoundListRequest(accessToken).then(getPastExamRoundListResponse);
    }, [accessToken]);

    // effect: 기출문제 회차를 선택할 시 실행할 함수 //
    useEffect(() => {
        if (seletedPastExamRound == null) {
            return;
        }

        navigator(PAST_EXAM_TEST_ABSOLUTE_PATH(seletedPastExamRound.pastExamId, seletedPastExamRound.pastExamRound));
    }, [seletedPastExamRound]);

    // render: 메인 화면 컴포넌트 렌더링 //
    return (
        <div id='main-wrapper'>
            <div className='content'>
                <div className='mock-section'>
                    <div className='title'>모의고사</div>
                    <div className='selector-container'>
                        <div className='selector-box'>
                            <div className='level-button-container'>
                                <div className='level-button high'>상</div> 
                                <div className='level-button middle'>중</div> 
                                <div className='level-button low disable'>하</div> 
                            </div>
                            <div className='solution-container'>
                                <div className='title'>해설 보기 옵션</div>
                                <div className='option-group'>
                                    <div className='option-item active'>
                                        <div className='radio-icon'></div>
                                        <div className='label'>해설을 보고 문제 풀기</div>
                                    </div>

                                    <div className='option-item'>
                                        <div className='radio-icon'></div>
                                        <div className='label'>해설을 보고 않고 문제 풀기</div>
                                    </div>
                                </div>
                            </div>
                            <div className='unit-container'>
                                <UnitSelector title={'단원별 문제'} options={units} showUnitSelector={showUnitSelector} selectedItem={seletedUnit} onSelectorClickHandler={onUnitSelectorClickHandler} onOptionClickHanlder={onUnitOptionSelectHandler} />
                                { seletedUnit &&
                                <UnitSelector title={'챕터별 문제'} options={chpaterList} showUnitSelector={showChapterSelector} selectedItem={seletedChapter} onSelectorClickHandler={onChapterSelectorClickHandler} onOptionClickHanlder={onChapterOptionSelectHandler} />
                                }

                            </div>
                        </div>
                        <div className='mock-button-container'>
                            <div className='mock-button primary fullwidth'>모의고사 풀기</div>
                        </div>
                    </div>
                </div>
                <div className='side-panel'>
                    <div className='past-section'>
                        <div className='title'>기출문제</div>
                        { showPastSelector ?
                        <div className='past-selector open' onClick={onPastSelectorClickHandler}>
                            <div className={pastSelectedItemClass}>{seletedPastExamRound ? `${seletedPastExamRound.pastExamRound}회차` : '회차를 선택하세요'}</div>
                            <div className='arrow-up-button'></div>
                            <div className='past-selector-box'>
                                {pastExamRoundList.map((pastExamRound, index) =>
                                    <div key={index} className='past-selector-option' onClick={() => onPastExamRoundSelectHandler(pastExamRound)}>{pastExamRound.pastExamRound}회차</div>
                                )}
                            </div>
                        </div> :
                        <div className='past-selector close' onClick={onPastSelectorClickHandler}>
                            <div className={pastSelectedItemClass}>{seletedPastExamRound ? `${seletedPastExamRound.pastExamRound}회차` : '회차를 선택하세요'}</div>
                            <div className='arrow-down-button'></div>
                        </div>
                        }   
                    </div>
                    <div className='killer-section'>
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
                        <div className={incorrectTypeButtonClass}>선택한 오답 풀기</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
