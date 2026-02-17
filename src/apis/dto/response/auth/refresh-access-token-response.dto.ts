import { ResponseDto } from 'src/apis/dto/response';

// interface: refresh access token respose body DTO //
export default interface RefreshAccessTokenResponseDto extends ResponseDto {
    accessToken: string;
    expiration: number;
}