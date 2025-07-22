'use server';
import nodemailer from "nodemailer";

interface ErrorDetails {
  paymentId?: string | null;
  preferenceId?: string | null;
  errorMessage: string;
  errorStack?: string;
  // Nuevos campos para el fulfillment manual
  usuario?: { nombre: string; email: string } | null;
  items?: { nombre: string; cantidad: number; precio: number }[] | null;
  entrega?: {
    tipo: string;
    direccion?: string | null;
    puntoRetiro?: string | null;
    contacto?: string | null;
    telefono?: string | null;
    observaciones?: string | null;
    costoEnvio?: number | null;
  } | null;
  total?: number | null;
}

export async function sendWebhookErrorEmail(details: ErrorDetails) {
  const adminEmail = process.env.ADMIN_EMAIL; // Debes configurar esto en tu .env
  if (!adminEmail) {
    console.error("ADMIN_EMAIL no está configurado. No se puede notificar el error del webhook.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const renderItems = () => {
    if (!details.items || details.items.length === 0) return '<p>No se encontraron productos.</p>';
    return `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Producto</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Cantidad</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Precio</th>
          </tr>
        </thead>
        <tbody>
          ${details.items.map(item => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.nombre}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.cantidad}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${item.precio.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const renderEntrega = () => {
    if (!details.entrega) return '<p>No se encontraron datos de entrega.</p>';
    return `
      <p><strong>Tipo:</strong> ${details.entrega.tipo}</p>
      ${details.entrega.tipo === 'ENVIO' ? `<p><strong>Dirección:</strong> ${details.entrega.direccion || 'N/A'}</p>` : ''}
      ${details.entrega.tipo === 'RETIRO' ? `<p><strong>Punto de Retiro:</strong> ${details.entrega.puntoRetiro || 'N/A'}</p>` : ''}
      <p><strong>Contacto:</strong> ${details.entrega.contacto || 'N/A'} (${details.entrega.telefono || 'N/A'})</p>
      <p><strong>Observaciones:</strong> ${details.entrega.observaciones || 'Ninguna'}</p>
      <p><strong>Costo de Envío:</strong> $${(details.entrega.costoEnvio || 0).toFixed(2)}</p>
    `;
  };

  const mailOptions = {
    from: `"Alerta Sistema - CYE Tech" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: "URGENTE: Falla en Webhook de Mercado Pago",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; border: 2px solid #d9534f; padding: 20px;">
        <h1 style="color: #d9534f;">Error Crítico en el Webhook de Mercado Pago</h1>
        <p>Un pago fue aprobado en Mercado Pago pero <strong>NO SE PUDO REGISTRAR LA VENTA</strong> en la base de datos.</p>
        <p><strong>Acción requerida:</strong> Debes verificar el pago en Mercado Pago y crear la orden manualmente para que el cliente reciba su producto.</p>
        <hr style="margin: 20px 0;">
        <h2>Datos del Cliente</h2>
        <p><strong>Nombre:</strong> ${details.usuario?.nombre || 'No disponible'}</p>
        <p><strong>Email:</strong> ${details.usuario?.email || 'No disponible'}</p>
        <h2>Detalles de la Compra</h2>
        ${renderItems()}
        <p style="text-align: right; font-size: 1.2em; font-weight: bold; margin-top: 10px;">Total Pagado: $${(details.total || 0).toFixed(2)}</p>
        <h2>Datos de Entrega</h2>
        ${renderEntrega()}
        <hr style="margin: 20px 0;">
        <h2>Detalles del Error:</h2>
        <p><strong>Payment ID:</strong> ${details.paymentId || 'No disponible'}</p>
        <p><strong>Preference ID:</strong> ${details.preferenceId || 'No disponible'}</p>
        <p><strong>Mensaje de Error:</strong></p>
        <pre style="background-color: #f9f9f9; padding: 10px; border: 1px solid #eee; white-space: pre-wrap; word-wrap: break-word;">${details.errorMessage}</pre>
        <p><strong>Stack Trace:</strong></p>
        <pre style="background-color: #f9f9f9; padding: 10px; border: 1px solid #eee; white-space: pre-wrap; word-wrap: break-word;">${details.errorStack || 'No disponible'}</pre>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de error de webhook enviado a: ${adminEmail}`);
  } catch (error) {
    console.error("Error al enviar el correo de notificación de error:", error);
  }
}