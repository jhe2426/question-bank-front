import { useEffect, useState } from "react"

const usePagination = <T>(itmesPerPage: number) => {

    // state: 페이지네이션 관련 상태 //
    const [totalList, setTotalList] = useState<T[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [viewList, setViewList] = useState<T[]>([]);

    // function: 전체 리스트 변경 함수 //
    const init = (totalList: T[]) => {
        const totalCount = totalList.length;
        const totalPage = Math.ceil(totalCount / itmesPerPage);
        setTotalPage(totalPage);

        setCurrentPage(1);
    };

    // function: 뷰 리스트 변경 함수 //
    const initViewList = (totalList: T[]) => {
        const totalCount = totalList.length;
        console.log(totalCount);
        const startIndex = (currentPage - 1) * itmesPerPage;
        const endIndex = currentPage * itmesPerPage > totalCount ? totalCount : currentPage * itmesPerPage;
        const viewList: T[] = totalList.slice(startIndex, endIndex);
        setViewList(viewList);
    };

    // effect: 전체 리스트가 변경되면 실행할 함수 //
    useEffect(() => {
        if (totalList.length) init(totalList);
    }, [totalList]);

    // effect: 현재 페이지가 변경되면 실행할 함수 //
    useEffect(() => {
        if (currentPage) initViewList(totalList);
    }, [currentPage]);

    return {
        currentPage, setCurrentPage,
        totalPage,
        setTotalList,
        viewList
    }

};

export default usePagination;