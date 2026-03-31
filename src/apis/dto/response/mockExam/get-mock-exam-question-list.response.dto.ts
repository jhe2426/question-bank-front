import { ResponseDto } from 'src/apis/dto/response';
import { Question } from 'src/types/interfaces';

// interface: get mock exam question list response body DTO //
export default interface GetMockExamQuestionListResponseDto extends ResponseDto {
    sessionId: number;
    questions: Question[];
}