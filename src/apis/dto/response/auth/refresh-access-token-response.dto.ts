import ResponseDto from "../response.dto";

// interface: refresh access token respose body DTO //
export default interface RefreshAccessTokenResponseDto extends ResponseDto {
    accessToken: string;
    expiration: number;
}