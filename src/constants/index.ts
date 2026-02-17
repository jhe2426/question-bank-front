import { MockExamPathParams } from "src/types/interfaces";

// variable: 상대 path 상수 //
export const ROOT_PATH = '/';
export const AUTH_PATH = 'auth';
export const MAIN_PATH = 'main';
export const MOCK_EXAM_PATH = 'mock-exam/questions';
export const MOCK_EXAM_TEST_PATH = `${MOCK_EXAM_PATH}/unit/:unitId/chapter/:chapterId/level/:difficulty/explain/:hasExplanation`;
export const KILLER_EXAM_TEST_PATH = 'killer-exam';
export const PAST_EXAM_PATH = 'past-exam';
export const PAST_EXAM_TEST_PATH = `${PAST_EXAM_PATH}/:pastExamId/:pastExamRound`;
export const INCORRECT_QUESTIONS_PATH = 'incorrect-questions';
export const INCORRECT_QUESTIONS_TEST_PATH = `${INCORRECT_QUESTIONS_PATH}/:questionType`;
export const MY_PAGE_PATH = 'my-page';
export const MY_PAGE_STUDY_HISTORY_PATH = 'study-history';
export const MY_PAGE_CHANGE_PASSWORD_PATH = 'change-password';
export const GRADING_PATH = 'grading';
export const GRADING_VIEW_PATH = `${GRADING_PATH}:groupId/:filter`;
export const OTHERS_PATH = '*';

// variable: 절대 path 상수 //
export const ROOT_ABSOLUTE_PATH = ROOT_PATH;
export const AUTH_ABSOLUTE_PATH = `${ROOT_PATH}${AUTH_PATH}`;
export const MAIN_ABSOLUTE_PATH = `${ROOT_PATH}${MAIN_PATH}`;
export const MOCK_EXAM_TEST_ABSOLUTE_PATH = ({ unitId, chapterId, difficulty, hasExplanation}: MockExamPathParams) => 
    `${ROOT_PATH}${MOCK_EXAM_PATH}/unit/${unitId}/chapter/${chapterId}/level/${difficulty}/explain/${hasExplanation}`;
export const KILLER_EXAM_TEST_ABSOLUTE_PATH = `${ROOT_PATH}${KILLER_EXAM_TEST_PATH}`;
export const PAST_EXAM_TEST_ABSOLUTE_PATH = (pastExamId: number | string, pastExamRound: number | string) => 
    `${ROOT_PATH}${PAST_EXAM_PATH}/${pastExamId}/${pastExamRound}`;
export const INCORRECT_QUESTIONS_TEST_ABSOLUTE_PATH = (questionType: string) => 
    `${ROOT_PATH}${INCORRECT_QUESTIONS_PATH}/${questionType}`;
export const MY_PAGE_STUDY_HISTORY_ABSOLUTE_PATH = `${ROOT_PATH}${MY_PAGE_PATH}/${MY_PAGE_STUDY_HISTORY_PATH}`;
export const MY_PAGE_CHANGE_PASSWORD_ABSOLUTE_PATH = `${ROOT_PATH}${MY_PAGE_PATH}/${MY_PAGE_CHANGE_PASSWORD_PATH}`;
export const GRADING_VIEW_ABSOLUTE_PATH = (groupId: number | string, filter: string) => 
    `${ROOT_PATH}${GRADING_PATH}/${groupId}/${filter}`;