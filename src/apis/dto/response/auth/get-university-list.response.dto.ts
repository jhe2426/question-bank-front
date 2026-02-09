import { ResponseDto } from 'src/apis/dto/response';
import { University } from 'src/types/interfaces';

// interface: get university list response body DTO //
export default interface GetUniversityListResponseDto extends ResponseDto {
    universities: University[];
}