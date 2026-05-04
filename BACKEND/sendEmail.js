const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const generateInvoice = (order) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const filePath = path.join(__dirname, `invoice_${Date.now()}.pdf`);

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // 🏪 HEADER
    doc.fontSize(18).text("Balaji Enterprise", { align: "left" });
    doc.fontSize(10).text("Nippani, Karnataka");
    doc.text("GSTIN: 27ABCDE1234F1Z5");

    doc.moveDown();

    doc.fontSize(20).text("INVOICE", { align: "right" });

    doc.moveDown();

    // ORDER INFO
    doc.fontSize(10);
    doc.text(`Invoice No: INV-${order.orderId}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    doc.moveDown();

    // CUSTOMER
    doc.fontSize(12).text("Bill To:");
    doc.fontSize(10);
    doc.text(order.name);
    doc.text(order.email);
    doc.text(order.phone);
    doc.text(order.address);

    doc.moveDown();

    // TABLE HEADER
    const tableTop = doc.y;
    const col1 = 50;
    const col2 = 250;
    const col3 = 330;
    const col4 = 420;

    doc.fontSize(10).text("Product", col1, tableTop);
    doc.text("Qty", col2, tableTop);
    doc.text("Price", col3, tableTop);
    doc.text("Total", col4, tableTop);

    doc.moveDown();

    // PRODUCTS
    order.items.forEach((item) => {
      const y = doc.y;

      doc.text(item.name, col1, y);
      doc.text(item.quantity, col2, y);
      doc.text(`₹${item.price}`, col3, y);
      doc.text(`₹${item.price * item.quantity}`, col4, y);

      doc.moveDown();
    });

    doc.moveDown();

    // GST CALCULATION (same as your React PDF)
    const subtotal = order.totalAmount;
    const gst = subtotal * 0.18;
    const cgst = gst / 2;
    const sgst = gst / 2;
    const grandTotal = subtotal + gst;

    // TOTAL SECTION
    doc.text(`Subtotal: ₹${subtotal}`, { align: "right" });
    doc.text(`CGST (9%): ₹${cgst.toFixed(2)}`, { align: "right" });
    doc.text(`SGST (9%): ₹${sgst.toFixed(2)}`, { align: "right" });

    doc.fontSize(12).text(`Grand Total: ₹${grandTotal.toFixed(2)}`, {
      align: "right",
    });

    doc.moveDown(3);

    // SIGNATURE
    doc.text("Authorized Signature", { align: "right" });

    doc.moveDown(2);

    // FOOTER
    doc.fontSize(10).text("Thank you for your business", {
      align: "center",
    });

    doc.end();

    stream.on("finish", () => {
      resolve(filePath);
    });
  });
};
const sendOrderEmail = async (order) => {
  try {
    const { name, email, phone, address, items, totalAmount, paymentMethod } = order;
    const filePath = await generateInvoice(order);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vishalrpatil.56@gmail.com",
        pass: "uqfa rnzw jlhm tzrg",
      },
    });

    const productList = (items || []).map(item => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd;">${item.name}</td>
        <td style="padding:8px;border:1px solid #ddd;">₹${item.price}</td>
        <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
        <td style="padding:8px;border:1px solid #ddd;">₹${item.price * item.quantity}</td>
      </tr>
    `).join("");

    const mailOptions = {
      from: "vishalrpatil.56@gmail.com",
      to: email,
      subject: "🛒 Order Confirmation",
      html: `
        <div style="font-family: Arial; padding:15px;">

          <h2>🛒 Balaji Enterprise</h2>
          <p>
            Green Park, Nipani <br/>
            📞 +91 9535345080, +91 8123892151 <br/>
            📧 np65925603@gmail.com
          </p>

          <hr/>

          <h2 style="color:green;">Order Confirmed ✅</h2>

          <p><b>Name:</b> ${name}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Address:</b> ${address}</p>

          <h3>🛍️ Order Details</h3>

          <table style="border-collapse:collapse; width:100%;">
            <tr style="background:#f2f2f2;">
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>

            ${productList}

          </table>

          <h3>Total Amount: ₹${totalAmount}</h3>

          <p><b>Payment Method:</b> ${paymentMethod}</p>

          <hr/>
          <p>Thank you for shopping with us 🙏</p>

        </div>
      `,
       attachments: [
    {
      filename: "invoice.pdf",
      path: filePath,
    },
  ],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent");

  } catch (error) {
    console.log("❌ Email error:", error);
  }
};

module.exports = sendOrderEmail;