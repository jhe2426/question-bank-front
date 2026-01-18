import React from 'react';
import './App.css';
import { Outlet, Route, Routes } from 'react-router';

function App() {
  return (
    <Routes>
      <Route path={'auth'} element={<>로그인 회원가입 페이지</>} />

      <Route element={<Outlet/>}>
        <Route path={'main'} element={<>메인 페이지</>} />

        <Route path={'mock-exam'}>
          <Route path={'questions/:unitId/:chapterId/:difficulty/:hasExplanation'} element={<>모의고사 시험 화면</>} />
          <Route path={'killers'} element={<>킬러문제 시험 화면</>} />
        </Route>

        <Route path={'past-exam/:pastExamQuestionId/:pastExamRound'} element={<>기출문제 시험 화면</>} />

        <Route path={'incorrect-questions/:questionType'} element={<>오답문제 시험 화면</>} />

        <Route path={'my-page'}>
          <Route path={'study-history'} element={<>학습 기록 페이지</>} />
          <Route path={'change-password'} element={<>비밀번호 변경 페이지</>} />
        </Route>

        <Route path={'grading/:groupId/:fillter'} element={<>채점 완료 페이지</>} />

      </Route>
    </Routes>
  );
}

export default App;
