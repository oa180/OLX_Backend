import { Injectable } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get, Query } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}
  async sendPlainEmail(tomail: string, subject: string, content: string) {
    await this.mailService.sendMail({
      to: tomail,
      from: 'omaradmin@mailsac.com',
      subject,
      text: content,
    });
    return 'Email Sent Successfully';
  }
}
