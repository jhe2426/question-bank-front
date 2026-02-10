// interface: sign up request body DTO //
export default interface SignUpRequestDto {
    userId: string;
    password: string;
    phoneNumber: string;
    approvalCode: string;
    name: string;
    birthDate: string;
    address: string;
    universityId: number;
    gender: string;
}