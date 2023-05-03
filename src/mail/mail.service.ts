import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailEntity } from './mail.entity';
const nodemailer = require('nodemailer');

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(MailEntity)
    private readonly mailRepository: Repository<MailEntity>
  ) {}

  async sendEmail(to_email: string | string[], subject: string, msg: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.Mail_host,
      port: 465,
      secure: true, //true for 465,false for others
      auth: {
        user: process.env.Mail_user,
        pass: `${process.env.Mail_pass}##`,
      },
    });

    let mailinfo = {
      from: `"Do-not-reply" <${process.env.Mail_user}>`, // sender address
      to: to_email, // list of receivers
      subject: subject, // Subject line
      // text: 'Hello Developer?', // plain text body
      html: `<p>${msg}</p>`,
    };

    let newMail = new MailEntity();
    newMail.mail_info = JSON.stringify(mailinfo);
    await this.mailRepository.save(newMail);

    try {
      await transporter.sendMail(mailinfo);
      return {
        msg: 'Email Sent Successfully',
        data: { msg: 'Email Sent Successfully' },
        status: 'success',
      };
    } catch (error) {
      return {
        msg: 'Unable to Send Email',
        errors: { msg: 'Unable to Send Email' },
        status: 'errors',
      };
    }
  }
}
