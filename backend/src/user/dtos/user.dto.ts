import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignUpDTO {
  @ApiProperty({ type: String, required: true, example: 'bishes@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: true, example: 'haliburt' })
  @IsString()
  fullName: string;

  @ApiProperty({ type: String, required: true, example: '123' })
  @IsString()
  password: string;

  @ApiProperty({ type: String, required: true, example: '123' })
  @IsString()
  image: string;
}

export class SignInDTO {
  @ApiProperty({ type: String, required: true, example: 'bishes@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ type: String, required: true, example: '123' })
  @IsString()
  password: string;
}

export class OnBoardingDTO {
  @ApiProperty({ type: String, required: true, example: 'Bishes Maharjan' })
  @IsString()
  fullName: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Something about yourself',
  })
  @IsString()
  bio: string;

  @ApiProperty({ type: String, required: true, example: 'Nepali' })
  @IsString()
  nativeLanguage: string;

  @ApiProperty({ type: String, required: true, example: 'Japanese' })
  @IsString()
  learningLanguage: string;

  @ApiProperty({ type: String, required: true, example: 'Nepal' })
  @IsString()
  location: string;

  @ApiProperty({ type: String, required: true, example: 'Nepal' })
  @IsString()
  image: string;
}
