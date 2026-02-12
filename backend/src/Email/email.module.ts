import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // <--- Import this
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { LlmModule } from '../LLM/llm.module'; // Assuming you have an LLM module

@Module({
  imports: [
    LlmModule,
    // You must register the JwtModule here
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret',
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
