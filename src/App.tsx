import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router';
import Layout from './layouts/Layout';
import { AUTH_ABSOLUTE_PATH, AUTH_PATH, GRADING_VIEW_PATH, INCORRECT_QUESTIONS_TEST_PATH, KILLER_EXAM_TEST_PATH, MAIN_ABSOLUTE_PATH, MAIN_PATH, MOCK_EXAM_TEST_PATH, MY_PAGE_ABSOLUTE_PATH, MY_PAGE_PATH, OTHERS_PATH, PAST_EXAM_TEST_PATH } from './constants';
import Auth from './views/Auth';
import { useAuthStore } from './stores';
import Main from './views/Main';
import Exam from './views/Test/Exam';
import Grade from './views/Test/Grade';
import MyPage from './views/MyPage';

function App() {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path={AUTH_PATH} element={<Auth />} />

      <Route element={<Layout />}>
        <Route path={MAIN_PATH} element={<Main />} />

        <Route path={MOCK_EXAM_TEST_PATH} element={<Exam />} />

        <Route path={KILLER_EXAM_TEST_PATH} element={<Exam />} />

        <Route path={PAST_EXAM_TEST_PATH} element={<Exam />} />

        <Route path={INCORRECT_QUESTIONS_TEST_PATH} element={<Exam />} />

        <Route path={MY_PAGE_ABSOLUTE_PATH} element={<MyPage />} />

        <Route path={GRADING_VIEW_PATH} element={<Grade />} />

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