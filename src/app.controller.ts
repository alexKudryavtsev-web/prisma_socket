import { Controller, Get, Render } from '@nestjs/common';
import { Chat } from '@prisma/client';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/chat')
  @Render('index')
  Home(): string {
    return '';
  }

  @Get('/api/chat')
  async getMessages(): Promise<Chat[]> {
    const messages = await this.appService.getMessages();

    return messages;
  }
}
