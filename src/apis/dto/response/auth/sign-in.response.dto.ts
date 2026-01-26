import ResponseDto from "../response.dto";

// interface: sign in respose body DTO //
export default interface SignInResponseDto extends ResponseDto {
    accessToken: string;
    expiration: number;
}