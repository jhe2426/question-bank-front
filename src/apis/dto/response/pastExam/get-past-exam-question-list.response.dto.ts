import { Question } from 'src/types/interfaces';
import { ResponseDto } from 'src/apis/dto/response';

// interface: get past exam question list response body DTO //
export default interface GetPastExamQuestionListResponseDto extends ResponseDto {
    questions: Question[];
}