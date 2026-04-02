import { ResponseDto } from 'src/apis/dto/response';

// interface: post exam response body DTO //
export default interface PostExamResponseDto extends ResponseDto {
    groupId: number;
}