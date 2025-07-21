'use server';
import nodemailer from "nodemailer";

export async function sendCouponWonEmail(usuario: string, codigoCupon: string, porcentaje: number) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const header = `
    <div style="background-color: #324d67; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">CYE TECH</h1>
      <p style="color: white; margin: 0;">Artículos tecnológicos</p>
    </div>
    <div style="padding: 20px; background-color: #f2f2f2; text-align: center;">
      <h2 style="margin: 0; color: #324d67;">¡Ganaste un premio!</h2>
    </div>
  `;

  const footer = `
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 14px;">
      <p>Seguinos en nuestras redes sociales</p>
      <div style="margin: 10px 0;">
        <a href="https://www.instagram.com/cyetech/profilecard/?igsh=enl0ZmNjbmE5czk3" style="margin: 0 10px;"><img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" alt="Instagram" /></a>
        <a href="https://www.facebook.com/share/16efa9JMz1/" style="margin: 0 10px;"><img src="https://cdn-icons-png.flaticon.com/24/145/145802.png" alt="Facebook" /></a>
        <a href="https://wa.me/5493512196753" style="margin: 0 10px;"><img src="https://cdn-icons-png.flaticon.com/24/733/733585.png" alt="WhatsApp" /></a>
      </div>
      <p style="color: #888;">© ${new Date().getFullYear()} CYE TECH. Todos los derechos reservados.</p>
    </div>
  `;

  const mailOptions = {
    from: `"CYE Tech" <${process.env.EMAIL_USER}>`,
    to: usuario,
    subject: "¡Felicidades! Ganaste un cupón de descuento",
    html: `
      <div style="font-family: Arial, sans-serif; color: #000000; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        ${header}
        <div style="padding: 30px; color:#000">
          <p>Hola,</p>
          <p>¡Felicidades! Has ganado en nuestro juego "Raspá y Ganá".</p>
          <p>Aquí está tu cupón de descuento del <strong>${porcentaje}%</strong>:</p>
          <div style="text-align: center; margin: 30px 0; padding: 15px; background-color: #e8f5e9; border: 1px dashed #4caf50; border-radius: 5px;">
            <p style="font-size: 20px; font-weight: bold; color: #2e7d32; margin: 0;">${codigoCupon}</p>
          </div>
          <p>Podés usarlo en tu próxima compra. ¡No lo pierdas!</p>
        </div>
        ${footer}
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de cupón ganado enviado a: ${usuario}`);
  } catch (error) {
    console.error("Error al enviar correo de cupón ganado:", error);
  }
}