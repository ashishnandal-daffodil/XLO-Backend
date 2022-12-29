import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sgmail from "@sendgrid/mail";

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  async generateMail(data, type) {
    if (type == "forgotPassword") {
      return {
        subject: "Reset Password",
        text: `Please click the link below to reset your password. ${data.forgotPasswordLink}`,
        html: `
          <p>Hi Ashish,</p>
          <p>Please click the link below to reset your XLO account password.</p>
          <a href = ${data.resetPasswordLink}>${data.resetPasswordLink}</a>
          <p style="color: red; font-weight: 500;">The link above will expire in 30 minutes.</p>
        `
      };
    }
  }

  async sendMail(data, type) {
    let apiKey = await this.configService.get("SENDGRID_API_KEY");
    apiKey = apiKey.slice(2, -2);
    sgmail.setApiKey(apiKey);
    let verifiedSenderMail = await this.configService.get("SENDGRID_VERIFIED_SENDER_MAIL");
    verifiedSenderMail = verifiedSenderMail.slice(2, -2);
    let mailData = await this.generateMail(data, type);
    const msg = {
      to: data.receiver,
      from: verifiedSenderMail,
      subject: mailData.subject,
      text: mailData.text,
      html: mailData.html
    };
    return sgmail
      .send(msg)
      .then(res => {
        console.log("Email sent");
      })
      .catch(error => {
        console.error(error.response.body.errors);
      });
  }
}
