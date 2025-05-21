import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Page, Text ,Button} from "zmp-ui";
import { QRCodeSVG } from "qrcode.react";
import emailjs from "@emailjs/browser";

function Chuyenkhoan() {
  const navigate = useNavigate();
  const location = useLocation();

  const { contactInfo, totalAmount } = location.state || {};
  const [isQRCodeScanned, setIsQRCodeScanned] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 phút
  const [orderId, setOrderId] = useState("");
  const [orderTime, setOrderTime] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Tạo mã đơn hàng và thời gian 1 lần khi load component
  useEffect(() => {
    setOrderId(`DH${Math.floor(Math.random() * 1000000)}`);
    setOrderTime(new Date().toLocaleString());
  }, []);

  // Cập nhật đếm ngược mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Gửi email xác nhận
  const sendEmail = () => {
    if (!contactInfo || !contactInfo.email) {
      alert("Không có thông tin email để gửi thông báo!");
      return;
    }

    const templateParams = {
      user_email: contactInfo.email,
      user_name: `${contactInfo.ho} ${contactInfo.ten}`,
      order_id: orderId,
      order_time: orderTime,
      total_price: totalAmount || 0,
    };

    emailjs
      .send(
        "service_hmmkp9i",
        "template_tbf4seq",
        templateParams,
        "85mNtAo5i--k39EHo"
      )
      .then(() => {
        alert("Email xác nhận đã được gửi!");
      })
      .catch((error) => {
        console.error("Lỗi khi gửi email:", error);
        alert("Không thể gửi email. Vui lòng thử lại.");
      });
  };

   // Lưu thông tin đơn hàng vào lịch sử
   const saveOrderToHistory = (status) => {
    const orderData = {
      orderId,
      orderTime,
      totalPrice: totalAmount,
      status,
      contactInfo,
      eventName: location.state?.eventName || "Không rõ", // Lấy tên sự kiện từ location.state
    };

    // Lưu thông tin vào localStorage (giả lập lưu vào lịch sử)
    console.log("Dữ liệu được lưu vào lịch sử:", orderData);
    const history = JSON.parse(localStorage.getItem("orderHistory")) || [];
    history.push(orderData);
    localStorage.setItem("orderHistory", JSON.stringify(history));
  };

  // Gửi email và quay về sau 5s
  useEffect(() => {
    if (isQRCodeScanned) {
      sendEmail();
      saveOrderToHistory("Đã thanh toán");
      setRedirectCountdown(5); // Bắt đầu đếm ngược 5s
    }
  }, [isQRCodeScanned]);

  useEffect(() => {
    if (redirectCountdown === null) return;
  
    if (redirectCountdown === 0) {
      navigate("/");
      return;
    }
  
    const timer = setTimeout(() => {
      setRedirectCountdown((prev) => prev - 1);
    }, 1000);
  
    return () => clearTimeout(timer);
  }, [redirectCountdown, navigate]);
  

  // Định dạng thời gian mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Page className="relative min-h-screen bg-[#F4F5F6]">
      <Box className="mt-[56px] px-4 pb-32">
        <Box className="bg-white rounded-xl p-4 mb-4">
          <Text className="font-semibold text-lg mb-2">Thông tin đơn hàng</Text>
          <Text className="text-gray-600 my-2">Họ và tên: {`${contactInfo?.ho || ""} ${contactInfo?.ten || ""}`}</Text>
          <Text className="text-gray-600 my-2">Email: {contactInfo?.email || "Không có email"}</Text>
          <Text className="text-gray-600 my-2">Nhà cung cấp: GDOUBLEH</Text>
          <Text className="text-gray-600 my-2">Mã đơn hàng: {orderId}</Text>
          <Text className="text-gray-600 my-2">Thời gian: {orderTime}</Text>
          <Text className="text-gray-600 my-2">Nội dung: GDOUBLEH_Thanh toan don hang</Text>
          <Text className="text-gray-600">Số tiền: {totalAmount || 0} đ</Text>
        </Box>

        <Box className="flex justify-center items-center my-6 flex-col">
          <QRCodeSVG
            value={`payment-confirmation?email=${contactInfo?.email}`}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            level="Q"
            includeMargin={true}
          />
          <Text className="mt-4 text-red-500 font-semibold">
            Mã QR hết hạn sau: {formatTime(countdown)}
          </Text>
        </Box>

        {!isQRCodeScanned && (
          <Box className="flex justify-center items-center my-6">
            <button
              className="w-full bg-green-500 text-white text-lg font-semibold mt-4 rounded-full py-3"
              onClick={() => setIsQRCodeScanned(true)}
            >
              Nhấn để quét
            </button>
            <button
              className="w-full bg-red-500 text-white text-lg font-semibold mt-4 rounded-full py-3"
              onClick={() =>setShowCancelDialog(true)}
            >
              Hủy Đơn Hàng
            </button>
          </Box>
        )}

        {isQRCodeScanned && (
          <>
          <Text className="text-center text-green-600 font-medium mt-4">
            Đã quét mã QR thành công! Đang chuyển hướng về trang chủ...
          </Text>
          {redirectCountdown !== null && (
            <Text className="text-center text-gray-500 text-sm mt-2">
              Chuyển hướng sau {redirectCountdown} giây...
            </Text>
          )}
          </>
        )}
        {/* Dialog hủy đơn hàng */}
        {showCancelDialog && (
          <Box className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <Box className="bg-white rounded-lg p-6 w-[90%] max-w-md">
              <Text className="text-lg font-semibold mb-4">
                Bạn có muốn hủy đơn hàng không?
              </Text>
              <Box className="flex justify-end space-x-4">
                <Button
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                  onClick={() => setShowCancelDialog(false)}
                >
                  Không
                </Button>
                <Button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    saveOrderToHistory("Đã hủy"); // Lưu trạng thái "Đã hủy"
                    setShowCancelDialog(false);
                    navigate("/"); // Quay về trang chủ
                  }}
                >
                  Có
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Page>
  );
}

export default Chuyenkhoan;
