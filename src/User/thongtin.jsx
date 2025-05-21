import React, { useState, useEffect } from "react";
import { Box, Page, Input, Select, Button, Text } from "zmp-ui";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ThongTin() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");

  // Load dữ liệu từ localStorage nếu có
  useEffect(() => {
    setFullname(localStorage.getItem("userName") || "");
    setEmail(localStorage.getItem("email") || "");
    setPhone(localStorage.getItem("phone") || "");
    setAddress(localStorage.getItem("address") || "");
    setGender(localStorage.getItem("gender") || "");
  }, []);

  const handleSave = () => {
    localStorage.setItem("userName", fullname);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
    localStorage.setItem("address", address);
    localStorage.setItem("gender", gender);
    alert("Thông tin đã được lưu!");
  };

  return (
    <Page className="p-4 bg-gray-100 min-h-screen">
      {/* Nút quay lại */}
      <Box
        className="flex items-center mb-4 mt-2 text-[#FC692A] cursor-pointer hover:underline"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="text-xl mr-2" />
        <Text className="font-medium">Quay lại</Text>
      </Box>

      {/* Form thông tin */}
      <Box className="bg-white rounded-xl shadow-md p-6 space-y-5">
        <Text className="font-bold text-xl text-gray-800 mb-4">
          Cập nhật thông tin cá nhân
        </Text>

        <Input
          label="Họ và tên"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Input
          label="Địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <Select
          label="Giới tính"
          value={gender}
          onChange={(value) => setGender(value)}
        >
          <option value="">-- Chọn giới tính --</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </Select>

        <Button
          className="bg-[#FC692A] text-white rounded-full py-2 font-semibold hover:bg-blue-700"
          onClick={handleSave}
        >
          Lưu thông tin
        </Button>
      </Box>
    </Page>
  );
}

export default ThongTin;
