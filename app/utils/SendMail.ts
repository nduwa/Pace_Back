import nodemailer from "nodemailer";
import FormatMail from "./FormatMail";
import VARIABLES from "../config/variables";

interface EmailAttachment {
  name: string;
  path: string;
}
const transporter = nodemailer.createTransport({
  port: parseInt(VARIABLES.MAILER_PORT),
  host: VARIABLES.MAILER_SERVICE,
  auth: {
    user: VARIABLES.MAILER_USERNAME,
    pass: VARIABLES.MAILER_PASSWORD,
  },
});

const sendEmail = async (
  subject: string,
  message: string,
  receipients: string[],
  attachments: EmailAttachment[] | undefined = undefined
) => {
  try {
    const x = await transporter.sendMail({
      from: `${VARIABLES.MAILER_NAME}<${VARIABLES.MAILER_USERNAME}>`,
      to: receipients,
      html: FormatMail(message),
      subject,
      attachments,
    });
  } catch (error) {
    console.error(error);
  }
};
export default sendEmail;
