import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { handlebars } from 'hbs';
import { join } from 'path';
import { Job, JobResponse } from 'src/core/core.job';
import { MsClientService } from 'src/core/modules/ms-client/ms-client.service';
import { TemplateService } from '../template/template.service';
import { UserService } from '../user/user.service';

@Injectable()
export class NotificationService {
  private emailTemplate: HandlebarsTemplateDelegate;

  constructor(
    private userService: UserService,
    private templateService: TemplateService,
    private msClient: MsClientService,
    private config: ConfigService,
  ) {
    try {
      const template = readFileSync(
        join(__dirname, '../src', 'views/template.hbs'),
        'utf8',
      );
      this.emailTemplate = handlebars.compile(template);
    } catch (error) {
      this.emailTemplate = handlebars.compile('<div>{{{content}}}</div>');
    }
  }
  /**
   * send
   * @function function send notification
   * @param {object} job - mandatory - a job object representing the job information
   * @return {JobResponse}
   */
  async send(job: Job): Promise<JobResponse> {
    const payload = job.payload;
    const getTemplate = await this.templateService.$db.findOneRecord({
      options: {
        where: {
          name: payload.template,
        },
      },
    });

    if (!!getTemplate.error) {
      return { error: getTemplate.error };
    }

    const template = getTemplate.data,
      variables = payload.variables || {};

    let email_subject = template.email_subject || '',
      email_body = template.email_body || '',
      sms_body = template.sms_body || '',
      users = payload.users || [];

    for (const key in variables) {
      if (Object.prototype.hasOwnProperty.call(variables, key)) {
        email_subject = email_subject.split(`##${key}##`).join(variables[key]);
        email_body = email_body.split(`##${key}##`).join(variables[key]);
        sms_body = sms_body.split(`##${key}##`).join(variables[key]);
      }
    }

    if (!!payload.user_id) {
      const getUser = await this.userService.$db.findRecordById({
        id: payload.user_id,
        options: {
          projection: 'id name email phone phone_code send_email send_sms',
        },
      });

      if (!!getUser.error) {
        return { error: getUser.error };
      }

      users.push(getUser.data.toJSON());
    }

    if (!!payload.user_where) {
      const getUsers = await this.userService.$db.getAllRecords({
        options: {
          limit: -1,
          pagination: false,
          where: payload.user_where,
          projection: 'id name email phone phone_code send_email send_sms',
        },
      });

      if (!!getUsers.error) {
        return { error: getUsers.error };
      }

      const allUsers = getUsers.data.map((user) => user.toJSON());
      users = [...users, ...allUsers];
    }

    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      const _email_subject = email_subject
        .split(`##TO_NAME##`)
        .join(user.name)
        .split(`##TO_EMAIL##`)
        .join(user.email);
      const _email_body = email_body
        .split(`##TO_NAME##`)
        .join(user.name)
        .split(`##TO_EMAIL##`)
        .join(user.email);

      const _email_template = this.emailTemplate({
        content: _email_body,
        logo: this.config.get('cdnLocalURL') + 'assets/logo.png',
        year: new Date().getFullYear(),
      });

      if (
        !!template.send_email &&
        (!!payload.skipUserConfig || !!user.send_email)
      ) {
        await this.msClient.executeJob(
          'controller.email',
          new Job({
            action: 'sendMail',
            payload: {
              to: user.email,
              subject: _email_subject,
              html: _email_template,
            },
          }),
        );
      }
    }

    return { error: false };
  }
}
