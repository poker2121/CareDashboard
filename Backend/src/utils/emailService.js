import nodemailer from 'nodemailer';

export const sendEmail =async ({to="" , html="",subject="" , attachments=[]} = {})=>{
    let mailTransporter = nodemailer.createTransport({
      // host:'smtp.ethereal.email',
      // port:587,
      // secure:false,
      service:"gmail",
      auth:{
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS 
      }
    });

    await mailTransporter.sendMail({
        from: `"Care+ Pharmacy" <${process.env.EMAIL}>`,
        to,
        subject,
        html,
        attachments
        });

}