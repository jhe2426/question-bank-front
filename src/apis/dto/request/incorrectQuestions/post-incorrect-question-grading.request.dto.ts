import { UserAnswer } from "src/types/interfaces";

// interface: post incorrect question grading request body DTO //
export default interface PostIncorrectQuestionGradingRequestDto {
    sourceType: string;
    detailedType: string;
    userAnswers: UserAnswer[];
}