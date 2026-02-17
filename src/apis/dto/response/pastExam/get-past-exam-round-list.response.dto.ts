import { ResponseDto } from 'src/apis/dto/response';
import { PastExamRound } from 'src/types/interfaces';

// interface: get past exam round list response body DTO //
export default interface GetPastExamRoundListResponseDto extends ResponseDto {
    pastExamRounds: PastExamRound[];
}