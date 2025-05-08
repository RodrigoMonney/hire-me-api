import { ApiProperty } from '@nestjs/swagger';

export default class UserLoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
