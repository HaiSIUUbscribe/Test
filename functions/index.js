const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Nạp biến môi trường từ file .env

admin.initializeApp();

// Cấu hình email sender
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Lấy email từ biến môi trường
    pass: process.env.EMAIL_PASS, // Lấy App Password từ biến môi trường
  },
});

// Cloud Function để gửi email khi trạng thái đơn hàng thay đổi
exports.sendEmailNotification = functions.firestore
    .document("orders/{orderId}")
    .onUpdate(async (change, context) => {
      const afterData = change.after.data();

      // Kiểm tra trạng thái đơn hàng
      if (afterData.status === "success") {
        const email = afterData.email; // Email người dùng từ Firestore
        const orderId = afterData.orderId;
        const amount = afterData.amount;

        // Nội dung email
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Xác nhận thanh toán đơn hàng ${orderId}`,
          text: `Đơn hàng ${orderId} đã được thanh toán thành công. ` +
                `Số tiền: ${amount} đ.`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Email đã được gửi tới ${email}`);
        } catch (error) {
          console.error("Lỗi khi gửi email:", error);
        }
      }
    });
