import { useEffect, useState } from "react"

const PAGES_PER_SECTION = 10;

const usePagination = <T>(itmesPerPage: number) => {

    // state: 페이지네이션 관련 상태 //
    const [totalList, setTotalList] = useState<T[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [totalSection, setTotalSection] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [currentSection, setCurrentSection] = useState<number>(0);
    const [viewList, setViewList] = useState<T[]>([]);
    const [pageList, setPageList] = useState<number[]>([]);

    // function: 전체 리스트 변경 함수 //
    const init = (totalList: T[]) => {
        const totalCount = totalList.length;
        const totalPage = Math.ceil(totalCount / itmesPerPage);
        setTotalPage(totalPage);
        const totalSection = Math.ceil(totalPage / PAGES_PER_SECTION);
        setTotalSection(totalSection);

        setCurrentPage(1);
        setCurrentSection(1);
    };

    // function: 뷰 리스트 변경 함수 //
    const initViewList = (totalList: T[]) => {
        const totalCount = totalList.length;
        const startIndex = (currentPage - 1) * itmesPerPage;
        const endIndex = currentPage * itmesPerPage > totalCount ? totalCount : currentPage * itmesPerPage;
        const viewList: T[] = totalList.slice(startIndex, endIndex);
        setViewList(viewList);
    };

    // function: 페이지 리스트 변경 함수 //
    const initPageList = (totalPage: number) => {
        const startPage = PAGES_PER_SECTION * currentSection - (PAGES_PER_SECTION - 1);
        const endPage = PAGES_PER_SECTION * currentSection > totalPage ? totalPage : PAGES_PER_SECTION * currentSection;
        const pageList =  [];
        for (let page = startPage; page <= endPage; page++) {
            pageList.push(page);
        }
        setPageList(pageList);
    };

    // effect: 전체 리스트가 변경되면 실행할 함수 //
    useEffect(() => {
        if (totalList.length) init(totalList);
    }, [totalList]);

    // effect: 현재 페이지가 변경되면 실행할 함수 //
    useEffect(() => {
        if (currentPage) initViewList(totalList);
    }, [currentPage]);

    // effect: 현재 섹션이 변경되면 실행할 함수 //
    useEffect(() => {
        if (totalPage) initPageList(totalPage);
    }, [totalPage, currentSection]);

    return {
        currentPage, setCurrentPage,
        currentSection, setCurrentSection,
        totalSection,
        totalPage,
        setTotalList,
        viewList, pageList
    }

};

export default usePagination;