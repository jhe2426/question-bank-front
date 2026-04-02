import { Question } from 'src/types/interfaces';
import { ResponseDto } from 'src/apis/dto/response';

// interface: get incorrect question list response body DTO //
export default interface GetIncorrectQuestionListResponseDto extends ResponseDto {
    questions: Question[];
}