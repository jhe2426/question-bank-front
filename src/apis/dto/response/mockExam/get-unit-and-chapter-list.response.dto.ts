import { ResponseDto } from 'src/apis/dto/response';
import { Unit } from 'src/types/interfaces';

// interface: get unit and chapter list response body DTO //
export default interface GetUnitAndChapterListResponseDto extends ResponseDto {
    units: Unit[];
}