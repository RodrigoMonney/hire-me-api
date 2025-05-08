export class AuthResponseDto {
  user: {
    id: string;
    email: string;
    role: string;
  };
  access_token: string;
}
