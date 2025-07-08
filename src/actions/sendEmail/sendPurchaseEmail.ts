'use server'
import nodemailer from "nodemailer";

export async function sendPurchaseEmail(usuario: string, pedidoId: number) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // o el proveedor que uses
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/pedido/${pedidoId}`;

  const mailOptions = {
    from: `"CYE Tech" <${process.env.EMAIL_USER}>`,
    to: ["marcosgaliano96@gmail.com", "estre_96@hotmail.com.ar"],
    subject: "Se realizó una compra",
    html: `
  <div style="font-family: Arial, sans-serif; color: #000000; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <!-- Header -->
    <div style="background-color: #324d67; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">CYE TECH</h1>
      <p style="color: white; margin: 0;">Artículos tecnológicos</p>
    </div>

    <!-- Subtítulo -->
    <div style="padding: 20px; background-color: #f2f2f2; text-align: center;">
      <h2 style="margin: 0; color: #324d67;">Se realizó una compra</h2>
    </div>

    <!-- Body -->
    <div style="padding: 30px; color:#000">
      <p>Hola,</p>
      <p>Se recibió una compra de <strong>${usuario}</strong> con el número de pedido <strong>#${pedidoId}</strong>.</p>
      <p>Puedes ver los detalles del pedido haciendo clic en el siguiente botón:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #e7000b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Ver pedido
        </a>
      </div>
      <p>O copiá y pegá este enlace en tu navegador:</p>
      <p style="word-break: break-word;"><a href="${url}" style="color: #e7000b;">${url}</a></p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 14px;">
      <p>Seguinos en nuestras redes sociales</p>
      <div style="margin: 10px 0;">
        <a href="https://www.instagram.com/cyetech/profilecard/?igsh=enl0ZmNjbmE5czk3" style="margin: 0 10px;"><img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" alt="Instagram" /></a>
        <a href="https://www.facebook.com/share/16efa9JMz1/" style="margin: 0 10px;"><img src="https://cdn-icons-png.flaticon.com/24/145/145802.png" alt="Facebook" /></a>
        <a href="https://wa.me/5493512196753" style="margin: 0 10px;"><img src="https://cdn-icons-png.flaticon.com/24/733/733585.png" alt="WhatsApp" /></a>
      </div>
      <p style="color: #888;">© ${new Date().getFullYear()} CYE TECH. Todos los derechos reservados.</p>
    </div>
  </div>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de compra enviado correctamente.");
  } catch (error) {
    console.error("Error al enviar correo de compra:", error);
  }
}
