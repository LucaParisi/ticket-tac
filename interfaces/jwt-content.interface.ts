export interface JwtContent {
    userId: string;
    username: string;
    iat: number;
    exp: number;
}