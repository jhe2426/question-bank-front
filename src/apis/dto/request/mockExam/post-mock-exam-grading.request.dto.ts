import { UserAnswer } from 'src/types/interfaces';

// interface: post mock exam grading request body DTO //
export default interface PostMockExamGradingRequestDto {
    detailedType: string;
    sessionId: number;
    userAnswers: UserAnswer[];
}