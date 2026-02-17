import React, { useState } from 'react';

// interface: 단원 셀렉터 컴포넌트 속성 //
interface Props<T> {
    title: string;
    options: T[];
    selectedItem: T | null;
    getOptionName: (option: T) => string;
    showUnitSelector: boolean;

    onSelectorClickHandler: () => void;
    onOptionClickHanlder: (value: T) => void;
}

// component: 단원 셀렉터 컴포넌트 //
export default function UnitSelector<T>(props: Props<T>) {


    const { title, options, selectedItem, showUnitSelector } = props;
    const { getOptionName, onSelectorClickHandler } = props;


    // event handler: 셀렉터 선택 이벤트 처리 //
    const onSelectorHandler = (option: T) => {
        props.onOptionClickHanlder(option);
    };

    // variable: 아이템 선택 여부 상태 //
    const hasSelected = selectedItem !== null;

    // variable: 선택한 아이템 클래스 //
    const selectedItemClass = !hasSelected ? 'unit-selected-item disable' : 'unit-selected-item';

    // variable: 선택한 아이템 제목 문자열 //
    const selectedItemTitleText = title.substring(0,2);

    // variable: 선택한 아이템 문자열 //
    const selectedItemText = !hasSelected ? `${selectedItemTitleText}${selectedItemTitleText === '단원' ? `을` : `를`} 선택하세요` : getOptionName(selectedItem);

    // render: 단원 셀렉터 컴포넌트 렌더링 //
    return (
        <div className='unit-box'>
            <div className='title'>{title}</div>
            { showUnitSelector ?
            <div className='unit-selector open' onClick={onSelectorClickHandler}>
                <div className={selectedItemClass}>{selectedItemText}</div>
                <div className='arrow-up-button'></div>
                <div className='unit-selector-box'>
                    {options.map((option, index) => (
                        <div key={index} className='unit-selector-option' onClick={() => onSelectorHandler(option)}>{getOptionName(option)}</div>
                    ))}
                </div>
            </div> :
            <div className='unit-selector close' onClick={onSelectorClickHandler}>
                <div className={selectedItemClass}>{selectedItemText}</div>
                <div className='arrow-down-button'></div>
            </div>
            }
        </div>
    )
}
