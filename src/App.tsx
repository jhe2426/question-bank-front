import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router';
import Layout from './layouts/Layout';
import { AUTH_PATH, GRADING_VIEW_PATH, INCORRECT_QUESTIONS_TEST_PATH, KILLER_EXAM_TEST_PATH, MAIN_PATH, MOCK_EXAM_TEST_PATH, MY_PAGE_CHANGE_PASSWORD_PATH, MY_PAGE_PATH, MY_PAGE_STUDY_HISTORY_PATH, OTHERS_PATH, PAST_EXAM_TEST_PATH } from './constants';

function App() {
  return (
    <Routes>
      <Route path={AUTH_PATH} element={<>로그인 회원가입 페이지</>} />

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
