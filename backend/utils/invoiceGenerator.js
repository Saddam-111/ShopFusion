import PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';

export const generateInvoice = async (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('INVOICE', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Invoice Number: INV-${order._id}`, { align: 'right' });
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: 'right' });
      doc.moveDown();

      doc.fontSize(14).text('ShopFusion', { align: 'center' });
      doc.fontSize(10).text('E-commerce Platform', { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(12).text('Bill To:');
      doc.fontSize(10).text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      if (order.shippingInfo) {
        doc.text(`Address: ${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pincode}`);
        doc.text(`Phone: ${order.shippingInfo.phoneNo}`);
      }
      doc.moveDown(2);

      doc.fontSize(12).text('Order Details:', { underline: true });
      doc.moveDown();

      const tableTop = doc.y;
      doc.fontSize(10).text('Product', 50, tableTop);
      doc.text('Qty', 250, tableTop, { width: 50, align: 'center' });
      doc.text('Price', 320, tableTop, { width: 80, align: 'right' });
      doc.text('Total', 420, tableTop, { width: 80, align: 'right' });

      doc.moveTo(50, tableTop + 15).lineTo(500, tableTop + 15).stroke();

      let y = tableTop + 25;
      order.orderItems.forEach(item => {
        doc.text(item.name, 50, y, { width: 180 });
        doc.text(item.quantity.toString(), 250, y, { width: 50, align: 'center' });
        doc.text(`$${item.price.toFixed(2)}`, 320, y, { width: 80, align: 'right' });
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 420, y, { width: 80, align: 'right' });
        y += 20;
      });

      doc.moveTo(50, y).lineTo(500, y).stroke();
      y += 10;

      doc.fontSize(10).text('Subtotal:', 350, y);
      doc.text(`$${order.itemPrice.toFixed(2)}`, 420, y, { width: 80, align: 'right' });
      y += 15;
      
      doc.text('Tax:', 350, y);
      doc.text(`$${order.taxPrice.toFixed(2)}`, 420, y, { width: 80, align: 'right' });
      y += 15;
      
      doc.text('Shipping:', 350, y);
      doc.text(`$${order.shippingPrice.toFixed(2)}`, 420, y, { width: 80, align: 'right' });
      y += 15;

      doc.fontSize(12).text('Total:', 350, y);
      doc.text(`$${order.totalPrice.toFixed(2)}`, 420, y, { width: 80, align: 'right' });
      y += 30;

      doc.fontSize(10).text(`Payment Method: ${order.paymentMethod}`, 50);
      doc.text(`Payment Status: ${order.paymentInfo?.status || 'Pending'}`);
      
      if (order.paymentInfo?.id) {
        doc.text(`Transaction ID: ${order.paymentInfo.id}`);
      }

      doc.moveDown(2);
      doc.fontSize(8).text('Thank you for shopping with ShopFusion!', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};