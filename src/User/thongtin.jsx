import React, { useState, useEffect } from "react";
import { Box, Page, Input, Button, Text } from "zmp-ui";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ThongTin() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa

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
    setIsEditing(false); // Tắt chế độ chỉnh sửa sau khi lưu
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
          disabled={!isEditing} // Chỉ cho phép chỉnh sửa khi isEditing = true
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isEditing} // Chỉ cho phép chỉnh sửa khi isEditing = true
        />

        <Input
          label="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={!isEditing} // Chỉ cho phép chỉnh sửa khi isEditing = true
        />

        <Input
          label="Địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={!isEditing} // Chỉ cho phép chỉnh sửa khi isEditing = true
        />

        <Box className="mb-4">
          <Text className="font-semibold mb-2">Giới tính</Text>
          <Box className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Nam"
                checked={gender === "Nam"}
                onChange={(e) => setGender(e.target.value)}
                disabled={!isEditing} // Chỉ cho phép chỉnh sửa khi isEditing = true
                className="mr-2"
              />
              Nam
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Nữ"
                checked={gender === "Nữ"}
                onChange={(e) => setGender(e.target.value)}
                disabled={!isEditing} // Chỉ cho phép chỉnh sửa khi isEditing = true
                className="mr-2"
              />
              Nữ
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Khác"
                checked={gender === "Khác"}
                onChange={(e) => setGender(e.target.value)}
                disabled={!isEditing} // Chỉ cho phép chỉnh sửa khi isEditing = true
                className="mr-2"
              />
              Khác
            </label>
          </Box>
        </Box>

        <Box className="flex gap-4">
          {isEditing ? (
            <Button
              className="bg-[#FC692A] text-white rounded-full py-2 font-semibold hover:bg-blue-700"
              onClick={handleSave}
            >
              Lưu thông tin
            </Button>
          ) : (
            <Button
              className="bg-[#FC692A] text-white rounded-full py-2 font-semibold hover:bg-blue-700"
              onClick={() => setIsEditing(true)} // Bật chế độ chỉnh sửa
            >
              Chỉnh sửa
            </Button>
          )}
        </Box>
      </Box>
    </Page>
  );
}

export default ThongTin;