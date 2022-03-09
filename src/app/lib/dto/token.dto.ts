export interface TTokenDTO {
    accessToken: string;
    expiresIn: number;
    tokenType: string;
    refreshToken: string;
    scope: string;
    data: { id: number, phoneNumber: string }
}
