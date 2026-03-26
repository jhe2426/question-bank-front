export default interface Question {
    questionId: number;
    questionOrder: number;
    questionText: string;
    imageUrl?: string | null;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    shortExplanation?: string | null;
}