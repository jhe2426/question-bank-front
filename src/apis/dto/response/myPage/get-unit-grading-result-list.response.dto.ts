import { ResponseDto } from 'src/apis/dto/response';
import { UnitGradingResult } from 'src/types/interfaces';

// interface: get unit grading result list response body DTO //
export default interface GetUnitGradingResultListResponseDto extends ResponseDto {
    unitGradingResults: UnitGradingResult[];
}