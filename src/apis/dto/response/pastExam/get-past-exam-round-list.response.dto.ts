import PastExamRound from "src/types/interfaces/past-exam-round.interface";
import ResponseDto from "../response.dto";

// interface: get past exam round list response body DTO //
export default interface GetPastExamRoundListResponseDto extends ResponseDto {
    pastExamRounds: PastExamRound[];
}