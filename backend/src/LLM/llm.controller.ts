import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { LlmService, EmailDraft } from './llm.service';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}
  @Post('improve-description')
  async generateImprovedDescription(
    @Body('context') context: string,
    @Body('description') description?: string,
  ): Promise<EmailDraft[]> {
    return await this.llmService.generateImprovedDescription(
      context,
      description ?? '',
    );
  }

  // @Post('generate-preview')
  // async getPreview(@Body() data: { context: string; description: string }) {
  //   const drafts = await this.llmService.generateImprovedDescription(
  //     data.context,
  //     data.description,
  //   );
  //   return { draft: drafts };
  // }

  @Get('GetSubjects')
  async getSubjects(
    @Query('emailContent') emailContent: string,
    @Query('numSubjects') numSubjects: string,
    @Query('tone') tone: string,
  ): Promise<{ subjects: string[] }> {
    const subjects = await this.llmService.getSubjectsForEmail(
      tone,
      emailContent,
      Number(numSubjects),
    );

    return { subjects };
  }
}
