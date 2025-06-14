import { Box, Button, Page, Text, Input } from "zmp-ui";
import bg_top from "../static/bg_top.png";
import bg_bot from "../static/bg_bot.png";
import "../css/trangchu.css";
import { FaHome, FaTh, FaHistory, FaUser } from "react-icons/fa";
import { FaMusic, FaFilm, FaMedal, FaGlobeAmericas, FaList, FaShoppingCart, FaBell } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import slider1 from "../static/slide/slider1.png";
import slider2 from "../static/slide/slider2.png";
import slider3 from "../static/slide/slider3.png";
import special from "../Data/special";
import music from "../Data/music";
import sport from "../Data/sport";
import { useNavigate, useLocation } from "react-router-dom";

function TrangChu() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([...special, ...music, ...sport]); // Danh sách sự kiện đã lọc
  const [showBadge, setShowBadge] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const slides = [slider1, slider2, slider3];

  const moveSlide = (direction) => {
    let newSlide = currentSlide + direction;
    if (newSlide < 0) {
      newSlide = slides.length - 1;
    } else if (newSlide >= slides.length) {
      newSlide = 0;
    }
    setCurrentSlide(newSlide);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      moveSlide(1);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  useEffect(() => {
    const checkCart = () => {
      try {
        const storedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
        setShowBadge(storedCart.length > 0); // Hiển thị badge nếu giỏ hàng không trống
      } catch (error) {
        console.error('Lỗi khi kiểm tra giỏ hàng:', error);
        setShowBadge(false);
      }
    };

    checkCart();
  }, []);

useEffect(() => {
    const handleStorageChange = () => {
      const storedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
      setShowBadge(storedCart.length > 0);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

   // Hàm xử lý tìm kiếm trong dữ liệu cục bộ
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const allLocalEvents = [...special, ...music, ...sport];
    const filtered = allLocalEvents.filter((event) =>
      event.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  return (
    <Page className="page-scrollable bg-white dark:bg-black">
      <Box
        className="top-0 left-0 w-full bg-cover bg-center shadow-md z-10 p-4"
        style={{
          backgroundImage: `url(${bg_top})`,
        }}
      >
        <Box className="flex items-center justify-between">
          <Box className="flex mr-4 my-8">
            <Input
              type="search"
              placeholder="Anh trai giang mai..."
              className="rounded-full px-4 flex left-4 top-2 search_bar"
              value={searchTerm}
              onChange={handleSearch} // Gọi hàm xử lý khi nhập liệu
              clearable
            />
          </Box>
          <Box className="flex items-center space-x-4 top_icon">
          <div className="relative">
            <FaShoppingCart 
              className="text-3xl cursor-pointer" 
              onClick={() => navigate("/cart")}
            />
            {showBadge && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {
                JSON.parse(sessionStorage.getItem("cart"))
                  ?.reduce((sum, item) => sum + item.quantity, 0) || 0
              }
            </span>
          )}
          </div>
          <FaBell className="text-3xl" />
        </Box>
        </Box>
        {/* Danh mục sự kiện */}
        <Box className="grid grid-cols-5 gap-3 px-4 text-center">
          {[
            { label: "Ca nhạc", icon: <FaMusic className="icon music" />, route: "/danhmuc?category=Ca nhạc" },
            { label: "Phim", icon: <FaFilm className="icon film" />, route: "/danhmuc?category=Phim" },
            { label: "Thể thao", icon: <FaMedal className="icon sport" />, route: "/danhmuc?category=Thể thao" },
            { label: "Workshop", icon: <FaGlobeAmericas className="icon travel" />, route: "/danhmuc?category=Workshop" },
            { label: "Khác", icon: <FaList className="icon other" />, route: "/danhmuc?category=Khác" },
          ].map((item) => (
            <Box
              key={item.label}
              className="flex flex-col items-center text-xs cursor-pointer"
              onClick={() => navigate(item.route)} // Điều hướng đến trang danh mục tương ứng
            >
              {item.icon}
              <Text size="xSmall">{item.label}</Text>
            </Box>
          ))}
        </Box>
      </Box>
          {/*body */}
      <Box className='body page-body-scrollable px-4'>
        <Box className="slider-container">
          <div
            className="slider"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {slides.map((slide, index) => (
              <div className="slide" key={index}>
                <img src={slide} alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="slider-controls">
            <button className="prev" onClick={() => moveSlide(-1)}>❮</button>
            <button className="next" onClick={() => moveSlide(1)}>❯</button>
          </div>
        </Box>

        {searchTerm && (
        <Box className="event-list1 px-4 py-1">
          <h2 className="font-bold text-lg mb-2 text-[#ED1B49]">Kết quả tìm kiếm</h2>
          <Box className="grid grid-cols-2 gap-3">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Box
                  key={event.id}
                  className="event-item border p-3 rounded-md shadow-sm bg-white cursor-pointer"
                  onClick={() => navigate(`/chitietsukien/${event.id}`)}
                >
                  <img
                    src={event.img}
                    alt={event.name}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                  <Text className="font-semibold text-base">{event.name}</Text>
                  <Text className="text-sm text-gray-600">Ngày: {event.date}</Text>
                </Box>
              ))
            ) : (
              <Text className="text-center text-gray-500 text-[20px] pt-5 w-[350px]">
                Không tìm thấy sự kiện nào.
              </Text>
            )}
          </Box>
        </Box>
      )}

        {/* Sự kiện nổi bật */}
        <Box className="w-full px-4 ">
          <Box className="flex justify-between items-center mb-2">
            <Text className="font-bold text-base">Sự kiện nổi bật</Text>
            <Button size="small" className="text-blue-600 p-0" variant="tertiary"><a href="/danhmuc">Xem thêm</a></Button>
          </Box>

          <Box className="grid grid-cols-3 gap-2 cursor-pointer">
            {special?.map((event) => (
              <Box
                key={event.id}
                className="rounded-xl overflow-hidden shadow-md bg-white cursor-pointer"
                onClick={() => navigate(`/chitietsukien/${event.id}`)}
              >
                <img src={event.img} alt={event.name} className="w-full h-28 object-cover" />
                <Box className="p-2">
                  <Text className="text-sm font-semibold">{event.name}</Text>
                  <Text className="text-xs text-gray-500">{event.date}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Thể Thao */}
        <Box className="w-full mt-6 px-4 ">
          <Box className="flex justify-between items-center mb-2">
            <Text className="font-bold text-base">Thể Thao</Text>
          </Box>

          <Box className="grid grid-cols-2 gap-3">
            {sport?.map((event) => (
              <Box
                key={event.id}
                className="rounded-xl overflow-hidden shadow-xl bg-white cursor-pointer"
                onClick={() => navigate(`/chitietsukien/${event.id}`)}
              >
                <img src={event.img} alt={event.name} className="w-full h-28 object-cover" />
                <Box className="p-2">
                  <Text className="text-sm font-semibold">{event.name}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Ca Nhạc */}
        <Box className="w-full mt-6 px-4 ">
          <Box className="flex justify-between items-center mb-2">
            <Text className="font-bold text-base">Ca Nhạc</Text>
          </Box>

          <Box className="grid grid-cols-3 gap-2">
            {music?.map((event) => (
              <Box
                key={event.id}
                className="rounded-xl overflow-hidden shadow-xl bg-white cursor-pointer"
                onClick={() => navigate(`/chitietsukien/${event.id}`)}
              >
                <img src={event.img} alt={event.name} className="w-full h-20 object-cover" />
                <Box className="p-2">
                  <Text className="text-sm font-semibold">{event.name}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

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

export default TrangChu;
