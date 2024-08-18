import { SendMailOptions, createTransport } from "nodemailer";

export class UTILS {
  static isMagicLink({
    origin,
    pathname,
  }: {
    origin: string;
    pathname: string;
  }): boolean {
    const magicLinkPath = pathname.replace(
      !origin.endsWith("/") ? origin.concat("/") : origin,
      ""
    );

    return (
      magicLinkPath.startsWith("magiclink") &&
      magicLinkPath.split("/").length === 2 &&
      magicLinkPath.split("/")[1].length >= 20
    );
  }
  static sendMailMethod(mailOptions: SendMailOptions): Promise<boolean> {
    const transporter = createTransport({
      //@ts-ignore
      host: "smtp.gmail.com",
      secureConnection: false, // TLS requires secureConnection to be false
      port: 465,
      secure: true,
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USERNAME,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
      },
      tls: {
        rejectUnAuthorized: true,
      },
    });
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, _) => {
        if (error) return reject(false);
        return resolve(true);
      });
    });
  }
}
