import { ResponseDto } from 'src/apis/dto/response';

// interface: sign in request body DTO //
export default interface SignInRequestDto {
    userId: string;
    userPassword: string;
}