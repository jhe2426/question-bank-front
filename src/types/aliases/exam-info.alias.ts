type ExamInfo = 
    | { type: 'mock'; title: string; unitId: number; chapterId: number; difficulty: string, hasExplanation: boolean }
    | { type: 'past'; title: string; pastExamId: number; pastExamRound: number }
    | { type: 'killer'; title: string }
    | { type: 'incorrect'; title: string; questionType: string };
export default ExamInfo;
