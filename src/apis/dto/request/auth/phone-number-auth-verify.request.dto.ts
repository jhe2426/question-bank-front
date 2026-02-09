// interface: 전화번호 인증 확인 Request Body dto //
export default interface PhoneNumberAuthVerifyRequestDto {
    phoneNumber: string;
    authCode: string;
}
