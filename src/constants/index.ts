// variable: 상대 path 상수 //
export const ROOT_PATH = '/';
export const AUTH_PATH = 'auth';
export const MAIN_PATH = 'main';
export const MOCK_EXAM_TEST_PATH = 'mock-exam/questions/unit/:unitId/chapter/:chapterId/level/:difficulty/explain/:hasExplanation';
export const KILLER_EXAM_TEST_PATH = 'killer-exam';
export const PAST_EXAM_TEST_PATH = 'past-exam/:pastExamQuestionId/:pastExamRound';
export const INCORRECT_QUESTIONS_TEST_PATH = 'incorrect-questions/:questionType';
export const MY_PAGE_PATH = 'my-page';
export const MY_PAGE_STUDY_HISTORY_PATH = 'study-history';
export const MY_PAGE_CHANGE_PASSWORD_PATH = 'change-password';
export const GRADING_VIEW_PATH = 'grading/:groupId/:filter';
export const OTHERS_PATH = '*';

// variable: 절대 path 상수 //
export const ROOT_ABSOLUTE_PATH = ROOT_PATH;
export const AUTH_ABSOLUTE_PATH = `${ROOT_PATH}${AUTH_PATH}`;
export const MAIN_ABSOLUTE_PATH = `${ROOT_PATH}${MAIN_PATH}`;
export const MOCK_EXAM_TEST_ABSOLUTE_PATH = `${ROOT_PATH}${MOCK_EXAM_TEST_PATH}`;
export const KILLER_EXAM_TEST_ABSOLUTE_PATH = `${ROOT_PATH}${KILLER_EXAM_TEST_PATH}`;
export const PAST_EXAM_TEST_ABSOLUTE_PATH = `${ROOT_PATH}${PAST_EXAM_TEST_PATH}`;
export const INCORRECT_QUESTIONS_TEST_ABSOLUTE_PATH = `${ROOT_PATH}${INCORRECT_QUESTIONS_TEST_PATH}`;
export const MY_PAGE_STUDY_HISTORY_ABSOLUTE_PATH = `${ROOT_PATH}${MY_PAGE_PATH}/${MY_PAGE_STUDY_HISTORY_PATH}`;
export const MY_PAGE_CHANGE_PASSWORD_ABSOLUTE_PATH = `${ROOT_PATH}${MY_PAGE_PATH}/${MY_PAGE_CHANGE_PASSWORD_PATH}`;
export const GRADING_VIEW_PBSOLUTE_PATH = `${ROOT_PATH}${GRADING_VIEW_PATH}`;