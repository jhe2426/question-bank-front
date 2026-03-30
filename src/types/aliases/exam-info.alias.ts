type ExamInfo = 
    | { type: 'mock'; title: string; unitId: string | number; chapterId: string | number; difficulty: string }
    | { type: 'past'; title: string; pastExamId: string | number; pastExamRound: string | number }
    | { type: 'killer'; title: string }
    | { type: 'incorrect'; title: string; questionType: string };
export default ExamInfo;
