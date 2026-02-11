import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router';
import Layout from './layouts/Layout';
import { AUTH_ABSOLUTE_PATH, AUTH_PATH, GRADING_VIEW_PATH, INCORRECT_QUESTIONS_TEST_PATH, KILLER_EXAM_TEST_PATH, MAIN_ABSOLUTE_PATH, MAIN_PATH, MOCK_EXAM_TEST_PATH, MY_PAGE_CHANGE_PASSWORD_PATH, MY_PAGE_PATH, MY_PAGE_STUDY_HISTORY_PATH, OTHERS_PATH, PAST_EXAM_TEST_PATH } from './constants';
import Auth from './views/Auth';
import { useAuthStore } from './stores';

function App() {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path={AUTH_PATH} element={<Auth />} />

      <Route element={<Layout />}>
        <Route path={MAIN_PATH} element={<>메인 페이지</>} />

        <Route path={MOCK_EXAM_TEST_PATH} element={<>모의고사 시험 화면</>} />

        <Route path={KILLER_EXAM_TEST_PATH} element={<>킬러문제 시험 화면</>} />

        <Route path={PAST_EXAM_TEST_PATH} element={<>기출문제 시험 화면</>} />

        <Route path={INCORRECT_QUESTIONS_TEST_PATH} element={<>오답문제 시험 화면</>} />

        <Route path={MY_PAGE_PATH}>
          <Route path={MY_PAGE_STUDY_HISTORY_PATH} element={<>학습 기록 페이지</>} />
          <Route path={MY_PAGE_CHANGE_PASSWORD_PATH} element={<>비밀번호 변경 페이지</>} />
        </Route>

        <Route path={GRADING_VIEW_PATH} element={<>채점 완료 페이지</>} />

        <Route path={OTHERS_PATH} element={<>404 페이지</>} />
      </Route>
    </Routes>
  );
}

export default App;

// component: Root 경로 컴포넌트 //
function Index() {

  // state: accessToken 정보 상태 //
  const { accessToken } = useAuthStore();

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // effect: 컴포넌트가 렌더링될 때 실행할 함수 //
  useEffect(() => {
    if (accessToken) navigator(MAIN_ABSOLUTE_PATH);
    else navigator(AUTH_ABSOLUTE_PATH);
  }, []);

  // render: Root 경로 컴포넌트 렌더링 //
  return null;
}