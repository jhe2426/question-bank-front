import { ResponseDto } from 'src/apis/dto/response';
import { Question } from 'src/types/interfaces';

// interface: get killer exam question list response body DTO //
export default interface GetKillerExamQuestionListResponseDto extends ResponseDto {
    sessionId: number;
    questions: Question[];
}