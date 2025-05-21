import { useState } from "react";
import { Box, Page, Text, Input, Icon } from "zmp-ui";
import bg_top from "../static/bg_top.png";
import bg_bot from "../static/bg_bot.png";
import { FaMusic, FaFilm, FaMedal, FaGlobeAmericas, FaList, FaShoppingCart, FaBell, FaHome, FaTh, FaHistory, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../css/danhmuc.css"

function Danhmuc() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const danhMucSuKien = [
    {
      title: "DU LỊCH",
      items: [
        {
          img: "https://storage.googleapis.com/a1aa/image/541fa39f-cd79-48b5-c61c-a0feef7c2a8e.jpg",
          text: "Ngày hội khinh khí cầu ĐẮK LẮK 2025: Bay...",
        },
        {
          img: "https://storage.googleapis.com/a1aa/image/35b6f648-af51-4f44-c775-22345c6e5017.jpg",
          text: "Tour Tham Quan Hà Nội Trên Xe Buýt 2...",
        },
        {
          img: "https://storage.googleapis.com/a1aa/image/d9eae9f1-8138-4510-739d-5ec8bfc8e26c.jpg",
          text: "Tour tham quan Sài Gòn – Chợ Lớn –...",
        },
        {
          img: "https://storage.googleapis.com/a1aa/image/78eacab2-e218-452a-aa85-e4cdfa161ccd.jpg",
          text: "Vé vào cửa triển lãm Nghệ thuật Ánh sáng...",
        },
      ],
    },
    {
      title: "CA NHẠC",
      items: [
        {
          img: "https://storage.googleapis.com/a1aa/image/27917c38-7fc9-4328-89f6-9d79cb28c87d.jpg",
          text: "Buổi hòa nhạc ngoài trời sôi động với các nghệ sĩ nổi tiếng...",
        },
        {
          img: "https://storage.googleapis.com/a1aa/image/f8157835-313c-4dbf-4d6d-b09ec14d3601.jpg",
          text: "Đêm nhạc acoustic ấm cúng tại quán cà phê...",
        },
        {
          img: "https://storage.googleapis.com/a1aa/image/2a9b084f-4eed-4109-0306-dd7855f3c441.jpg",
          text: "Lễ hội âm nhạc mùa hè với nhiều ban nhạc...",
        },
        {
          img: "https://storage.googleapis.com/a1aa/image/75844f94-0503-45b4-9994-05b7b28ea1b9.jpg",
          text: "Buổi biểu diễn ca nhạc đặc sắc với các ca sĩ nổi tiếng...",
        },
      ],
    },
  ];

  // Lọc danh mục dựa trên từ khóa tìm kiếm
  const filteredDanhMuc = searchValue
    ? danhMucSuKien.filter((section) =>
        section.title
          .toUpperCase()
          .replace(/[\s-]/g, "")
          .includes(
            searchValue
              .trim()
              .toUpperCase()
              .replace(/[\s-]/g, "")
          )
      )
    : danhMucSuKien;

  // Xử lý tìm kiếm khi nhấn Enter
  const handleSearch = (value) => {
    console.log(`Search triggered with value: ${value}`);
    setSearchValue(value);
    if (filteredDanhMuc.length === 0) {
      console.warn(`No section matched for input: ${value}`);
      alert(`Không tìm thấy danh mục "${value}"!`);
    } else {
      console.log(`Filtered sections: ${filteredDanhMuc.map((s) => s.title).join(", ")}`);
    }
  };

  return (
    <Page className="page-scrollable bg-white dark:bg-black">
     {/* Header */}
     <Box
        className="top-0 left-0 w-full bg-cover bg-center shadow-md z-10 p-4"
        style={{
          backgroundImage: `url(${bg_top})`, // Áp dụng bg_top làm background
        }}
      >
        <Box className="flex items-center justify-between">
          <Box className="flex mr-4 my-8">
            <Input
              type="search"
              placeholder="Anh trai giang mai..."
              className="rounded-full px-4 flex left-4 top-2 search_bar"
              clearable
            />
          </Box>
          <Box className="flex items-center space-x-4 top_icon">
            <FaShoppingCart 
            className="text-3xl cursor-pointer" 
            onClick={() => navigate("/cart")}
            />
            <FaBell className="text-3xl" />
          </Box>
        </Box>
        {/* Danh mục */}
        <Box className="grid grid-cols-5 gap-3 px-4 text-center">
          {[
            { label: "Ca nhạc", icon: <FaMusic className="icon music" /> },
            { label: "Phim", icon: <FaFilm className="icon film" /> },
            { label: "Thể thao", icon: <FaMedal className="icon sport" /> },
            { label: "Du lịch", icon: <FaGlobeAmericas className="icon travel" /> },
            { label: "Khác", icon: <FaList className="icon other" /> },
          ].map((item) => (
            <Box key={item.label} className="flex flex-col items-center text-xs">
              {item.icon}
              <Text size="xSmall">{item.label}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Danh sách sự kiện */}
      <Box className="w-full body page-body-scrollable px-4" id="danhmuc">
        {filteredDanhMuc.map((section) => (
          <Box
            key={section.title}
            id={section.title.replace(/\s/g, "-").toLowerCase()}
            className="pt-4"
          >
            <Box className="flex justify-between items-center mb-4">
              <Box className="flex items-center space-x-2">
                <Box className="w-1.5 h-7 bg-[#FF6B35] rounded" />
                <Text className="font-bold text-lg text-[#1A1A1A]">{section.title}</Text>
              </Box>
              <Text className="text-[#1A1A1A] text-sm">Xem thêm</Text>
            </Box>
            <Box className="grid grid-cols-2 gap-x-3 gap-y-4">
              {section.items.map((item, index) => (
                <Box key={index}>
                  <img
                    src={item.img}
                    className="w-full rounded-lg object-cover h-[110px]"
                    alt={item.text}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                  <Text className="mt-2 text-[#1A1A1A] text-base leading-snug">{item.text}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Điều hướng dưới */}
      <Box
        className="navigation"
        style={{
          backgroundImage: `url(${bg_bot})`,
        }}
      >
        {[
          { label: "Trang chủ", icon: <FaHome className="icon" />, route: "/home" },
          { label: "Danh mục", icon: <FaTh className="icon" />, route: "/danhmuc" },
          { label: "Lịch sử", icon: <FaHistory className="icon" />, route: "/lichsu" },
          { label: "Tài khoản", icon: <FaUser className="icon" />, route: "/taikhoan" },
        ].map((item) => (
          <Box
            key={item.label}
            className={`nav-item ${location.pathname === item.route ? "active" : ""}`}
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

export default Danhmuc;