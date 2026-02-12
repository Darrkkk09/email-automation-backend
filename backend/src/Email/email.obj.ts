import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailObj {
  @IsEmail()
  to!: string; // The '!' tells TypeScript this will be assigned before use, avoiding "possibly undefined" errors

  @IsEmail()
  replyTo!: string;

  @IsNotEmpty()
  subject!: string;

  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  UserName!: string;
}

export class improveEmailObj {
  @IsString()
  description!: string;

  @IsString()
  tone!: string;

  @IsString()
  context!: string;
}
