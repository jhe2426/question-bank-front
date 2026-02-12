import React, { useState } from 'react';

// interface: 단원 셀렉터 컴포넌트 속성 //
interface Props {
    title: string;
    options: string[];
    selectedItem: string;
    showUnitSelector: boolean;

    onSelectorClickHandler: () => void;
    onOptionClickHanlder: (value: string) => void;
}

// component: 단원 셀렉터 컴포넌트 //
export default function UnitSelector(props: Props) {


    const { title, options, selectedItem,showUnitSelector } = props;
    const { onSelectorClickHandler } = props;


    // event handler: 셀렉터 선택 이벤트 처리 //
    const onSelectorHandler = (option: string) => {
        props.onOptionClickHanlder(option);
    };

    // variable: 선택한 아이템 클래스 //
    const selectedItemClass = selectedItem === '' ? 'unit-selected-item disable' : 'unit-selected-item';

    // variable: 선택한 아이템 제목 문자열 //
    const selectedItemTitleText = title.substring(0,2);

    // variable: 선택한 아이템 문자열 //
    const selectedItemText = selectedItem === '' ? `${selectedItemTitleText}${selectedItemTitleText === '단원' ? `을` : `를`} 선택하세요` : selectedItem;

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
                        <div key={index} className='unit-selector-option' onClick={() => onSelectorHandler(option)}>{option}</div>
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
