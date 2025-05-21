import React from "react";
import { Page, Box, Text } from "zmp-ui";
import { FaArrowLeft, FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const achievements = [
  {
    title: "Hoàn thành 10 lượt đặt vé",
    description: "Bạn đã đặt thành công 10 vé.",
    iconColor: "text-yellow-500",
  },
  {
    title: "Thành viên tích cực",
    description: "Đăng nhập liên tục trong 7 ngày.",
    iconColor: "text-blue-500",
  },
  {
    title: "Giới thiệu bạn bè",
    description: "Mời ít nhất 3 người tham gia.",
    iconColor: "text-green-500",
  },
  {
    title: "Thanh toán nhanh",
    description: "Hoàn tất thanh toán dưới 2 phút.",
    iconColor: "text-purple-500",
  },
];

function ThanhTuu() {
  const navigate = useNavigate();

  return (
    <Page className="p-4 bg-gray-100 min-h-screen">
      {/* Nút quay lại */}
      <Box className="flex items-center mb-4 cursor-pointer" onClick={() => navigate(-1)}>
        <FaArrowLeft className="text-xl mr-2 text-blue-600" />
        <Text className="text-blue-600 font-medium">Quay lại</Text>
      </Box>

      {/* Tiêu đề trang */}
      <Text className="text-2xl font-bold text-center text-blue-600 mb-4">Thành Tựu Của Bạn</Text>

      {/* Danh sách thành tựu */}
      <Box className="space-y-4">
        {achievements.map((item, index) => (
          <Box
            key={index}
            className="flex items-start p-4 bg-white rounded-xl shadow-md space-x-4"
          >
            <FaTrophy className={`text-3xl ${item.iconColor}`} />
            <Box>
              <Text className="font-semibold text-base">{item.title}</Text>
              <Text className="text-gray-500 text-sm">{item.description}</Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Page>
  );
}

export default ThanhTuu;
