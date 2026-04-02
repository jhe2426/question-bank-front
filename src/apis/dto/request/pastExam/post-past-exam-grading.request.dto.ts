import { UserAnswer } from 'src/types/interfaces';

// interface: post past exam grading request body DTO //
export default interface PostPastExamGradingRequestDto {
    detailedType: string;
    pastExamId: number;
    userAnswers: UserAnswer[];
}