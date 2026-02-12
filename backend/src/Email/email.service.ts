import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { LlmService, EmailDraft } from '../LLM/llm.service';

interface JwtPayload {
  email: string;
  otp: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly llmService: LlmService,
    private readonly jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendVerificationOtp(email: string): Promise<{ token: string }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const token = await this.jwtService.signAsync(
      { email, otp },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '5m',
      },
    );

    try {
      await this.transporter.sendMail({
        from: `"AI Email Verifier" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code',
        text: `Your code is: ${otp}. It expires in 5 minutes.`,
      });

      return { token };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown SMTP error';
      console.error('SMTP Error:', msg);
      throw new InternalServerErrorException('Could not send OTP email');
    }
  }

  // --- OTP VERIFICATION ---
  // Verifies the OTP token and returns the verified email on success
  async verifyOtp(userEnteredOtp: string, token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      if (payload.otp === userEnteredOtp && payload.email) {
        return payload.email;
      }

      throw new BadRequestException('Invalid OTP code');
    } catch (error: unknown) {
      if (error instanceof BadRequestException) throw error;

      throw new BadRequestException('OTP expired or invalid token');
    }
  }
  async improveEmail(
    description: string,
    context: string,
  ): Promise<EmailDraft[]> {
    return this.llmService.generateImprovedDescription(context, description);
  }

  async sendEmail(
    to: string,
    replyTo: string,
    subject: string,
    body: string,
    userName: string,
    authToken?: string,
    attachment?: Express.Multer.File,
  ): Promise<string> {
    try {
      // If an auth token was provided, verify it and use the verified email as replyTo
      if (authToken) {
        try {
          const payload = await this.jwtService.verifyAsync<JwtPayload>(
            authToken,
            {
              secret: process.env.JWT_SECRET,
            },
          );
          if (payload?.email) {
            replyTo = payload.email;
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          throw new BadRequestException('Invalid authentication token');
        }
      }
      // Sanitize display name to avoid header injection or malformed headers
      const raw = (userName ?? '').toString();
      // Remove CRLF and angle brackets and quotes
      const safeName = raw.replace(/(\r|\n|<|>|"|')/g, ' ').trim();
      const display = safeName || process.env.MAIL_DISPLAY_NAME || 'AI Emailer';

      const mailOptions: nodemailer.SendMailOptions = {
        from: `"${display}" <${process.env.MAIL_USER}>`,
        to,
        replyTo,
        subject,
        text: body,
      };

      if (attachment && attachment.buffer) {
        mailOptions.attachments = [
          {
            filename: attachment.originalname,
            content: attachment.buffer,
            contentType: attachment.mimetype,
          },
        ];
      }

      await this.transporter.sendMail(mailOptions);
      return 'Email sent successfully';
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Email sending error:', errorMessage, err);
      // Include the provider error message to help debugging invalid mailbox issues
      throw new InternalServerErrorException(
        `Failed to send email: ${errorMessage}`,
      );
    }
  }
}
