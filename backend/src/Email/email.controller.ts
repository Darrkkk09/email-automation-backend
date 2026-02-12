import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Headers,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmailService } from './email.service';
import { EmailDraft } from '../LLM/llm.service';


interface VerifyOtpDto {
  otp: string;
  token: string;
}

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('request-otp')
  async requestOtp(@Body('email') email: string): Promise<{ token: string }> {
    if (!email) throw new BadRequestException('Email is required');
    return await this.emailService.sendVerificationOtp(email);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() body: VerifyOtpDto,
  ): Promise<{ success: boolean; message: string; token?: string }> {
    // verifyOtp now returns the verified email when successful
    const email = await this.emailService.verifyOtp(body.otp, body.token);

    // Sign a new longer-lived token that will be used for authentication when sending
    // emails (so reply-to can be set to the verified user). Expires in 7 days.
    const signed = await this.emailService['jwtService'].signAsync(
      { email },
      { secret: process.env.JWT_SECRET, expiresIn: '7d' },
    );

    return { success: true, message: 'OTP Verified Successfully', token: signed };
  }

  @Post('improve')
  async improve(
    @Body() body: { description: string; context: string },
  ): Promise<{ result: EmailDraft[] }> {
    const drafts = await this.emailService.improveEmail(
      body.description,
      body.context,
    );
    return { result: drafts };
  }

  @Post('send')
  @UseInterceptors(FileInterceptor('attachment'))
  async send(
    @Body() body: any,
    @UploadedFile() attachment: any,
    @Headers() headers: Record<string, string | string[]>,
  ): Promise<{ status: string }> {
    const { to, replyTo, subject, description } = body;

    if (!to || !replyTo || !subject || !description) {
      throw new BadRequestException('Missing required email fields');
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(to) || !emailRegex.test(replyTo)) {
      throw new BadRequestException('Invalid email format');
    }

    const rawName = body?.UserName ?? body?.userName ?? '';

    // Token Logic
    let authToken: string | undefined;
    const authHeader = headers.authorization;
    if (body.token) {
      authToken = body.token;
    } else if (authHeader) {
      const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;
      if (token.startsWith('Bearer ')) authToken = token.slice(7);
    }

    // CRITICAL FIX: Do not use String(attachment).
    // Pass the actual object so the service can access attachment.buffer
    const status = await this.emailService.sendEmail(
      to,
      replyTo,
      subject,
      description,
      String(rawName),
      authToken || '',
      attachment, // Passed as object
    );

    return { status };
  }
}
