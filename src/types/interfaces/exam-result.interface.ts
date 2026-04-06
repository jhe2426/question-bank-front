export default interface ExamResult {
    questionId: number;
    questionOrder: number;
    questionText: string;
    imageUrl?: string | null;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    answer: number;
    detailExplanationContent: string;
    userAnswer: number;
    isCorrect: number;
}