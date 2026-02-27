export interface JWTPayload {
    email: string;
    uuid: string;
    firstName: string;
    lastName: string;
    iat: number;
    exp: number;
    timezone: string;
    dateFormat: string;
}