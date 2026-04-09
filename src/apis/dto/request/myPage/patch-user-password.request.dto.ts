// interface: patch user password request body DTO //
export default interface  PatchUserPasswordRequestDto {
    currentPassword: string;
    newPassword: string;
}