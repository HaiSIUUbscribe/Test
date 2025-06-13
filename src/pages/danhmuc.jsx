import React, { useState, useEffect } from "react";
import { Box, Page, Text, Input } from "zmp-ui";
import bg_top from "../static/bg_top.png";
import bg_bot from "../static/bg_bot.png";
import {
  FaMusic,
  FaFilm,
  FaMedal,
  FaGlobeAmericas,
  FaList,
  FaShoppingCart,
  FaBell,
  FaHome,
  FaTh,
  FaHistory,
  FaUser,
} from "react-icons/fa";
import { useNavigate,useLocation } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../css/danhmuc.css";

function Danhmuc() {
  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Ca nhạc"); // Trạng thái cho mục được chọn
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
  const navigate = useNavigate();
  const location = useLocation();
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Lấy danh sách sự kiện từ Firebase
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date?.seconds
            ? new Date(data.date.seconds * 1000).toLocaleDateString("vi-VN")
            : data.date,
        };
      });
      setEvents(eventsData);
      setFilteredEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Lọc danh sách sự kiện dựa trên danh mục từ URL
    const queryParams = new URLSearchParams(location.search); // Lấy query parameter từ URL
    const category = queryParams.get("category"); // Lấy giá trị của parameter `category`

    setActiveCategory(category || ""); // Cập nhật trạng thái danh mục được chọn

    let filtered = [];
    switch (category) {
      case "Ca nhạc":
        filtered = events.filter((event) => event.id.startsWith("A"));
        break;
      case "Phim":
        filtered = events.filter((event) => event.id.startsWith("B"));
        break;
      case "Thể thao":
        filtered = events.filter((event) => event.id.startsWith("C"));
        break;
      case "Workshop":
        filtered = events.filter((event) => event.id.startsWith("D"));
        break;
      case "Khác":
        filtered = events.filter((event) => event.id.startsWith("E"));
        break;
      default:
        filtered = events;
    }
    setFilteredEvents(filtered);
  }, [location.search, events]); // Gọi lại khi URL hoặc danh sách sự kiện thay đổi

  const handleCategoryClick = (category) => {
    setActiveCategory(category); // Cập nhật trạng thái danh mục được chọn

    // Điều hướng đến URL với parameter `category`
    let route = "";
    switch (category) {
      case "Ca nhạc":
        route = "/danhmuc?category=Ca nhạc";
        break;
      case "Phim":
        route = "/danhmuc?category=Phim";
        break;
      case "Thể thao":
        route = "/danhmuc?category=Thể thao";
        break;
      case "Workshop":
        route = "/danhmuc?category=Workshop";
        break;
      case "Khác":
        route = "/danhmuc?category=Khác";
        break;
      default:
        route = "/danhmuc";
    }
    navigate(route); // Điều hướng đến URL mới
  };

  const handleEventClick = (eventId) => {
    navigate(`/chitietsukien/${eventId}`); // Điều hướng đến trang ChiTietSukien với ID sự kiện
  };

  useEffect(() => {
    // Lọc danh sách sự kiện dựa trên từ khóa tìm kiếm
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
  };

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

  return (
    <Page className="page-scrollable bg-white dark:bg-black">
      {/* Header */}
      <Box
        className="top-0 left-0 w-full bg-cover bg-center shadow-md z-10 p-4"
        style={{ backgroundImage: `url(${bg_top})` }}
      >
        <Box className="flex items-center justify-between">
          <Box className="flex mr-4 my-8">
            <Input
              type="search"
              placeholder="Tìm kiếm sự kiện..."
              className="rounded-full px-4 flex left-4 top-2 search_bar"
              value={searchTerm}
              onChange={handleSearchChange} // Gọi hàm xử lý khi nhập liệu
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

        {/* Danh mục */}
         <Box className="grid grid-cols-5 gap-3 text-center">
          {[
            { label: "Ca nhạc", icon: <FaMusic className="icon music" /> },
            { label: "Phim", icon: <FaFilm className="icon film" /> },
            { label: "Thể thao", icon: <FaMedal className="icon sport" /> },
            { label: "Workshop", icon: <FaGlobeAmericas className="icon travel" /> },
            { label: "Khác", icon: <FaList className="icon other" /> },
          ].map((item) => (
            <Box
              key={item.label}
              className={`menu-item ${
                activeCategory === item.label ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(item.label)}
            >
              {item.icon}
              <Text className="pr-2" size="xSmall">{item.label}</Text>
            </Box>
          ))}
        </Box>

      </Box>
       {/*Danh sách sự kiện theo danh mục*/}
      <Box className="event-list px-4 py-2">
        <h2 className="font-bold text-lg mb-2 text-[#FC692A]">{activeCategory}</h2>
        <Box className="grid grid-cols-2 gap-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Box
                key={event.id}
                className="event-item border p-3 rounded-md shadow-sm bg-white cursor-pointer"
                onClick={() => handleEventClick(event.id)} // Điều hướng đến trang ChiTietSukien
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
            <Text className="text-center text-gray-500 w-[400px] text-l pt-[80px]">
              Không có sự kiện nào trong danh mục này.
            </Text>
          )}
        </Box>
      </Box>

      {/* Điều hướng dưới */}
      <Box className="navigation" style={{ backgroundImage: `url(${bg_bot})` }}>
        {[
          { label: "Trang chủ", icon: <FaHome className="icon" />, route: "/home" },
          { label: "Danh mục", icon: <FaTh className="icon" />, route: "/danhmuc" },
          { label: "Lịch sử", icon: <FaHistory className="icon" />, route: "/lichsu" },
          { label: "Tài khoản", icon: <FaUser className="icon" />, route: "/taikhoan" },
        ].map((item) => (
          <Box
            key={item.label}
            className={`nav-item ${
              location.pathname === item.route ? "active" : ""
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

export default Danhmuc;