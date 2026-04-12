import { ResponseDto } from 'src/apis/dto/response';
import LearningRecord from 'src/types/interfaces/learning-record.interface';

// interface: get learning record list response body DTO //
export default interface GetLearningRecordListResponseDto extends ResponseDto {
    learningRecords: LearningRecord[];
}