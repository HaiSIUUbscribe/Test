import { Box, Text, Page, Button } from "zmp-ui";
import {
  FaBell,
  FaChevronRight,
  FaGift,
  FaUserCircle,
  FaQuestionCircle,
  FaStar,
  FaHome,
  FaTh,
  FaHistory,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import React, { useState } from "react";
import bg_bot from "../static/bg_bot.png";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

function Taikhoan() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const userName = localStorage.getItem("userName") || "GDOUBLEH User";
  const userEmail = localStorage.getItem("email") || "example@gmail.com";
  const userPhone = localStorage.getItem("phone") || "0902xxxxxx";
  const userLevel = localStorage.getItem("level") || "Lv.1";
  const userRank = localStorage.getItem("rank") || "Bạc";
  const userPoints = localStorage.getItem("points") || 0;

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      // Xóa dữ liệu người dùng khỏi localStorage
      localStorage.clear();
      
      console.log("Bắt đầu đăng xuất...");
      // Đăng xuất khỏi Firebase Authentication (nếu đang sử dụng Firebase)
      auth.signOut()
        .then(() => {

          alert("Đăng xuất thành công!");
          console.log("Đăng xuất thành công!");
          navigate("/"); // Điều hướng về trang đăng nhập
        })
        .catch((error) => {
          alert("Đăng xuất thất bại! Vui lòng thử lại.");
        });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem("avatar", reader.result); // Lưu ảnh vào localStorage
        window.location.reload(); // Tải lại trang để cập nhật ảnh
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    setIsDarkMode(!isDarkMode);
  };

  const inviteLink = `${window.location.origin}/register?ref=${userName}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Đã sao chép liên kết mời bạn bè!");
  };

  return (
    <Page className="bg-gray-100">
      {/* Header tài khoản */}
      <Box className="bg-gradient-to-r from-sky-300 to-purple-200 p-6 text-white relative">
        <Box className="flex items-center space-x-4">
          <Box className="relative">
            <img
              src={localStorage.getItem("avatar") || "/src/static/user.png"}
              alt="avatar"
              className="rounded-full w-14 h-14 border-2 border-white"
            />
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleAvatarChange}
            />
          </Box>
          <Box>
            <Text className="font-bold text-lg text-black">{userName}</Text>
          </Box>
        </Box>
        <FaBell className="absolute top-5 right-10 text-black text-xl" />
      </Box>

      {/* Thẻ Rewards */}
      <Box className="bg-white mx-4 mt-6 rounded-xl shadow-md p-4 mb-4">
        <Box className="flex mb-3">
          <img src="/src/static/logo.png" alt="avatar" className="w-8 h-10" />
          <Text className="font-semibold text-purple-600 ml-4">
            GDOUBLEH Rewards
          </Text>
          <Box className="flex items-center ml-10 rounded-full overflow-hidden border w-[70px] h-[20px] border-teal-500 font-bold">
            <Box className="bg-teal-500 px-[4px] py-[3px] text-white">
              {userLevel}
            </Box>
            <Box className="text-teal-500 bg-white px-[2px] py-[3px]">
              {userRank}
            </Box>
          </Box>
        </Box>
        <Box className="flex justify-between text-center mt-2">
          <Box className="flex-1">
            <Text size="small" className="text-gray-600">
              Mã ưu đãi
            </Text>
          </Box>
          <Box className="flex-1">
            <Text size="small" className="text-gray-600">GDOUBLEH Xu</Text>
            <Text className="font-bold text-purple-600">{userPoints}</Text>
          </Box>
          <Box className="flex-1">
            <Text size="small" className="text-gray-600">Gift Card</Text>
          </Box>
        </Box>
      </Box>

      {/* Danh sách menu chính */}
      <Box className="space-y-3 mx-4">
        <Box className="bg-white rounded-xl shadow-md divide-y">
          {[
            { icon: <FaGift />, label: "Đơn hàng", route: "/cart" },
            { icon: <FaStar />, label: "GDOUBLEH Rewards", route: "/thanhtuu" },
            {
              icon: <FaUserCircle />,
              label: "Thông tin người dùng",
              route: "/thongtin",
            },
          ].map(({ icon, label, route }) => (
            <Box
              key={label}
              className="flex items-center justify-between p-4"
              onClick={() => navigate(route)}
            >
              <Box className="flex items-center space-x-3 text-gray-700">
                {icon}
                <Text>{label}</Text>
              </Box>
              <FaChevronRight />
            </Box>
          ))}
        </Box>

        {/* Menu phụ */}
        <Box className="bg-white rounded-xl shadow-md divide-y">
        {[
            { icon: <FaQuestionCircle />, label: "Trợ giúp" },
            { icon: <FaUserCircle />, label: "Đổi mật khẩu", route: "/changeMK" },
            { icon: <FaSignOutAlt />, label: "Đăng xuất", onClick: handleLogout },
          ].map(({ icon, label, route, onClick }) => (
            <Box
              key={label}
              className="flex items-center justify-between p-4"
              onClick={() => {
                if (onClick) {
                  onClick();
                } else if (route) {
                  navigate(route);
                }
              }}
            >
              <Box className="flex items-center space-x-3 text-gray-700">
                {icon}
                <Text>{label}</Text>
              </Box>
              <FaChevronRight />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Mời bạn bè */}
      <Box className="bg-white rounded-xl shadow-md mx-4 mt-4 mb-20 p-4">
        <Text className="font-semibold">Mời bạn bè</Text>
        <Text size="small" className="text-gray-500 my-1">
          Nhận 10.000đ khi mời bạn bè sử dụng GDOUBLEH thành công!
        </Text>
        <Button
          className="bg-blue-500 text-white mt-2"
          onClick={handleCopyInviteLink}
        >
          Sao chép liên kết mời
        </Button>
      </Box>

      {/* Điều hướng dưới */}
      <Box
        className="navigation"
        style={{ backgroundImage: `url(${bg_bot})` }}
      >
        {[
          { label: "Trang chủ", icon: <FaHome className="icon" />, route: "/home" },
          { label: "Danh mục", icon: <FaTh className="icon" />, route: "/danhmuc" },
          { label: "Lịch sử", icon: <FaHistory className="icon" />, route: "/lichsu" },
          { label: "Tài khoản", icon: <FaUser className="icon" />, route: "/taikhoan" },
        ].map((item) => (
          <Box
            key={item.label}
            className={`nav-item ${
              location.pathname === item.route ? "active text-blue-500" : "text-gray-500"
            }`}
            onClick={() => navigate(item.route)}
          >
            {item.icon}
            <Text size="xSmall">{item.label}</Text>
          </Box>
        ))}
      </Box>
    </Page>
  );
}

export default Taikhoan;