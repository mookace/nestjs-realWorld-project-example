import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send')
  async sendManil(): Promise<any> {
    const data = await this.mailService.sendEmail(
      'example@gmail.com',
      'test',
      'New Message'
    );
    return data;
  }
}
