import { ResponseDto } from 'src/apis/dto/response';

// interface: sign in respose body DTO //
export default interface SignInResponseDto extends ResponseDto {
    accessToken: string;
    expiration: number;
}