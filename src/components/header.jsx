import React from "react";
import { Box, Input, Text } from "zmp-ui";
import { FaShoppingCart, FaBell, FaMusic, FaFilm, FaMedal, FaGlobeAmericas, FaList } from "react-icons/fa";
import bg_top from "../static/bg_top.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
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
            placeholder="Tìm kiếm sự kiện"
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
  );
};

export default Header;