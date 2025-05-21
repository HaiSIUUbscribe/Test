import { useState } from "react";
import { Box, Page, Text, Button, useNavigate } from "zmp-ui";
import { useLocation } from "react-router-dom";
import { Icon } from "zmp-ui";

function Thanhtoan() {
  const navigate = useNavigate();
  const location = useLocation();

console.log("location.state:", location.state);
  // Lấy dữ liệu từ state
  const {
    name,
    date,
    time,
    location: eventLocation,
    ticketDetails = [],
    seatDetails = [],
    totalAmount,
  } = location.state || {};

  // Tính tổng cộng nếu không có `totalAmount`
  const calculatedTotalAmount =
    totalAmount ||
    cartItems.reduce((sum, item) => {
      const ticketTotal = item.total || 0;
      const seatTotal = item.seats
        ? item.seats.reduce((seatSum, seat) => seatSum + (seat.seatPrice || 0), 0)
        : 0;
      return sum + ticketTotal + seatTotal;
    }, 0);

  // Trạng thái hiển thị chi tiết
  const [showDetails, setShowDetails] = useState(false);

  // Nếu không có dữ liệu, quay lại trang trước
  if (!location.state || !name || !date || !time || !eventLocation || !ticketDetails) {
    return (
      <div className="p-4">
        <h1 className="text-lg font-semibold text-center mb-4">Không có thông tin vé</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </button>
      </div>
    );
  }

  const [showContactForm, setShowContactForm] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    ho: "",
    ten: "",
    soDienThoai: "",
    email: "",
  });

  const isContactInfoValid = () => {
    return (
      contactInfo.ho.trim() &&
      contactInfo.ten.trim() &&
      /^\d{10,11}$/.test(contactInfo.soDienThoai) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email.trim())
    );
  };
  

  const [showVoucher, setShowVoucher] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(0); // Lưu phần trăm giảm giá

  return (
    <Page className="relative min-h-screen bg-[#F4F5F6]">
      {/* Header */}
      <Box className="fixed top-0 left-0 w-full bg-white z-10 px-4 py-3 flex items-center">
        <Box
          className="p-2 -ml-2 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <Text className="text-lg font-semibold ml-2">Hoàn tất đặt hàng (2/2)</Text>
        </Box>
      </Box>

       {/* Main Content */}
       <Box
        className="mt-[56px] px-4 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
          <Box className="bg-white rounded-xl p-4 mb-4">
            <Text className="font-semibold text-lg mb-2">Thông tin sự kiện</Text>
            <Text className="text-gray-600">Sự kiện: {name}</Text>
            <Text className="text-gray-600">Ngày: {date}</Text>
            <Text className="text-gray-600">Thời gian: {time}</Text>
            <Text className="text-gray-600">Địa điểm: {eventLocation}</Text>
            <Button
              className="bg-[#FF405E] text-white mt-2 p-0"
              onClick={() => setShowDetails(true)}
            >
              Xem chi tiết
            </Button>
          </Box>

            {/* Overlay che nền khi popup mở */}
            {showDetails && (
              <Box className="fixed top-0 left-0 w-full h-full bg-black opacity-30 z-30" />
            )}

            {/* Chi tiết */}
            <Box
              className={`fixed bottom-0 left-0 w-full bg-white border-t px-4 py-3 z-40 transition-transform duration-300 ${
                showDetails ? "translate-y-0" : "translate-y-full"
              }`}
              style={{ height: "70vh", overflowY: "auto" }}
            >
              <Box className="flex justify-between items-center mb-4">
                <Text className="font-bold text-lg">CHI TIẾT</Text>
                <Button
                  className="text-white bg-[#FF405E]"
                  onClick={() => setShowDetails(false)}
                >
                  Đóng
                </Button>
              </Box>

              <Box className="mb-4">
                <Text className="font-semibold text-lg mb-2">Thông tin sự kiện</Text>
                <Text className="text-gray-600">Sự kiện: {name}</Text>
                <Text className="text-gray-600">Ngày: {date}</Text>
                <Text className="text-gray-600">Thời gian: {time}</Text>
                <Text className="text-gray-600">Địa điểm: {eventLocation}</Text>
              </Box>

              {/* Chi tiết vé */}
              <Box className="mb-4">
                <Text className="font-semibold text-lg mb-2">Chi tiết vé</Text>
                {ticketDetails && ticketDetails.map((ticket, index) => (
                  <Box key={index} className="mb-4">
                    <Text className="text-gray-600">
                      Loại vé: {ticket.type === "adultWeekday"
                        ? "Người lớn - Trong tuần"
                        : ticket.type === "childWeekday"
                        ? "Trẻ em - Trong tuần"
                        : ticket.type === "adultWeekend"
                        ? "Người lớn - Cuối tuần"
                        : "Trẻ em - Cuối tuần"}
                    </Text>
                    <Text className="text-gray-600">Số lượng: {ticket.quantity}</Text>
                    <Text className="text-gray-600">
                      Giá: {ticket.price.toLocaleString("vi-VN")} đ
                    </Text>
                    <Text className="text-gray-600">
                      Tổng: {ticket.total.toLocaleString("vi-VN")} đ
                    </Text>
                  </Box>
                ))}
              </Box>

              {/* Chi tiết ghế */}
              {seatDetails && seatDetails.length > 0 && (
                <Box>
                  <Text className="font-semibold text-lg mb-2">Chi tiết ghế</Text>
                  {seatDetails.map((seat, index) => (
                    <Box key={index} className="mb-2">
                      <Text className="text-gray-600">Ghế: {seat.seatId}</Text>
                      <Text className="text-gray-600">Loại: {seat.seatType}</Text>
                      <Text className="text-gray-600">
                        Giá: {seat.seatPrice.toLocaleString("vi-VN")} đ
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
      </Box>
      

      <Box className="bg-white rounded-xl px-4 mb-4">
          <Box className="flex justify-between items-start mb-2">
            <Box>
              <Text className="font-semibold text-base">Xác nhận thông tin liên lạc:</Text>
              <Text className="text-sm text-gray-500">
                Chúng tôi sẽ thông báo mọi thay đổi và đơn hàng cho bạn
              </Text>
            </Box>
            <Button
              size="small"
              className="border border-[#FF3C00] bg-[#FFFFFF] text-[#FF3C00] px-3 py-1 rounded-md"
              onClick={() => setShowContactForm(true)}
            >
              {contactInfo.ho ? "Chỉnh sửa" : "+ Thêm"}
            </Button>
          </Box>

          <Box className="bg-[#FAF8F6] rounded-xl p-4 space-y-2"
            onClick={() => setShowContactForm(true)}
          >
            <Text className="text-sm text-gray-700">Họ: {contactInfo.ho || "—"}</Text>
            <Text className="text-sm text-gray-700">Tên: {contactInfo.ten || "—"}</Text>
            <Text className="text-sm text-gray-700">Số điện thoại: {contactInfo.soDienThoai || "—"}</Text>
            <Text className="text-sm text-gray-700">Email: {contactInfo.email || "—"}</Text>
          </Box>
        </Box>

        {showContactForm && (
          <Box className="fixed top-0 left-0 w-full h-full bg-black opacity-30 z-30" />
        )}
      <Box
        className={`fixed bottom-0 left-0 w-full bg-white border-t px-4 py-3 z-40 transition-transform duration-300 ${
          showContactForm ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "70vh", overflowY: "auto" }}
      >
        <Box className="flex justify-between items-center mb-4">
          <Text className="font-bold text-lg">Thông tin liên lạc</Text>
          <Button
            className="text-white bg-[#FF405E]"
            onClick={() => setShowContactForm(false)}
          >
            Đóng
          </Button>
        </Box>

        <Box className="space-y-4">
          <Box>
            <Text className="text-sm mb-1">Họ</Text>
            <input
              type="text"
              value={contactInfo.ho}
              onChange={(e) => setContactInfo({ ...contactInfo, ho: e.target.value })}
              className="w-full border rounded p-2"
              placeholder="Nhập họ"
            />
          </Box>
          <Box>
            <Text className="text-sm mb-1">Tên</Text>
            <input
              type="text"
              value={contactInfo.ten}
              onChange={(e) => setContactInfo({ ...contactInfo, ten: e.target.value })}
              className="w-full border rounded p-2"
              placeholder="Nhập tên"
            />
          </Box>
          <Box>
            <Text className="text-sm mb-1">Số điện thoại</Text>
            <input
              type="tel"
              value={contactInfo.soDienThoai}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, soDienThoai: e.target.value })
              }
              className="w-full border rounded p-2"
              placeholder="Nhập số điện thoại"
            />
          </Box>
          <Box>
            <Text className="text-sm mb-1">Email</Text>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, email: e.target.value })
              }
              className="w-full border rounded p-2"
              placeholder="Nhập email"
            />
          </Box>
          <Button
            className="bg-[#FF405E] text-white w-full mt-4"
            onClick={() => {
              // Kiểm tra dữ liệu hợp lệ
              if (!contactInfo.ho.trim()) {
                alert("Vui lòng nhập họ!");
                return;
              }
              if (!contactInfo.ten.trim()) {
                alert("Vui lòng nhập tên!");
                return;
              }
              if (!/^\d{10,11}$/.test(contactInfo.soDienThoai)) {
                alert("Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại gồm 10-11 chữ số.");
                return;
              }
              if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email.trim())
              ) {
                alert("Email không hợp lệ! Vui lòng nhập đúng định dạng email.");
                return;
              }

              // Hiển thị thông báo lưu thành công
              alert("Thông tin liên lạc đã được lưu!");

              // Đóng cửa sổ nhập thông tin
              setShowContactForm(false);
            }}
          >
            Lưu thông tin
          </Button>
        </Box>
      </Box>

      <Box className="mb-6">
        <Text className="font-semibold m-2">Giảm giá</Text>
        <Box className="flex items-center justify-between p-4 border rounded-lg mb-3 shadow-sm"
            onClick={() => setShowVoucher(true)}
        >
          <Box className="flex items-center">
            <Box className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <Icon icon="zi-ticket" className="text-blue-600 text-xl" />
            </Box>
            <Text className="font-medium text-gray-800">GDOUBLEH Voucher</Text>
          </Box>
          <Icon icon="zi-arrow-right" className="text-gray-400" />
        </Box>
      </Box>

        {showVoucher && (
          <Box className="fixed top-0 left-0 w-full h-full bg-black opacity-30 z-30" />
        )}
      <Box
        className={`fixed bottom-0 left-0 w-full bg-white border-t px-4 py-3 z-40 transition-transform duration-300 ${
          showVoucher ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "50vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}
      >
        <Box className="flex justify-between items-center mb-4">
          <Text className="font-bold text-lg">Chọn mã giảm giá</Text>
          <Button
            className="text-white bg-[#FF405E]"
            onClick={() => setShowVoucher(false)} // Đóng cửa sổ
          >
            Đóng
          </Button>
        </Box>
        
        {/* Danh sách mã giảm giá */}
        <Box className="space-y-4">
          {/* Không dùng mã giảm giá */}
            <Box
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                selectedDiscount === 0 ? "border-[#FF405E]" : "border-gray-200"
              }`}
              onClick={() => {
                setSelectedDiscount(0); // Đặt lại giảm giá về 0
                setShowVoucher(false); // Đóng cửa sổ
              }}
            >
              <Text className="font-medium text-gray-800">Không dùng mã giảm giá</Text>
              {selectedDiscount === 0 && (
                <Icon icon="zi-check" className="text-[#FF405E]" />
              )}
            </Box>
          {[10, 20, 25].map((discount) => (
            <Box
              key={discount}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                selectedDiscount === discount ? "border-[#FF405E]" : "border-gray-200"
              }`}
              onClick={() => {
                setSelectedDiscount(discount); // Lưu mã giảm giá đã chọn
                setShowVoucher(false); // Đóng cửa sổ
              }}
            >
              <Text className="font-medium text-gray-800">Giảm {discount}%</Text>
              {selectedDiscount === discount && (
                <Icon icon="zi-check" className="text-[#FF405E]" />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box className="fixed bottom-0 left-0 w-full bg-white border-t px-4 py-3">
        {/* Tổng cộng */}
        <Box className="flex items-center justify-between mb-3">
          <Text className="text-lg font-semibold">Tổng cộng:</Text>
          <Text className="text-orange-600 text-xl font-bold">
            {((calculatedTotalAmount * (100 - selectedDiscount)) / 100).toLocaleString(
              "vi-VN"
            )}{" "}
            đ
          </Text>
        </Box>

        {/* Nút Thanh Toán */}
        <Button
          className="w-full bg-[#FF6B35] text-white text-lg font-semibold"
          onClick={() =>
            navigate("/chuyenkhoan", {
              state: {
                contactInfo,
                ticketDetails,
                seatDetails,
                totalAmount: calculatedTotalAmount, // Truyền tổng cộng sang trang tiếp theo
                eventName: name,
              },
            })
          }
          disabled={!isContactInfoValid()}
        >
          Thanh Toán
        </Button>
      </Box>
    </Page>
  );
}

export default Thanhtoan;