import { ExamResult } from 'src/types/interfaces';
import { ResponseDto } from 'src/apis/dto/response';

// interface: get exam result list response body DTO //
export default interface GetExamResultListResponseDto extends ResponseDto {
    sourceType: string;
    detailedType: string;
    totalScore: number;
    examResults: ExamResult[];
}