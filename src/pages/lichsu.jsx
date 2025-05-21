import { useState, useEffect } from "react";
import { Box, Page, Text, Button, Select } from "zmp-ui";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function Lichsu() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const navigate = useNavigate();

  useEffect(() => {
    const rawHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    console.log("Dữ liệu lịch sử đơn hàng:", rawHistory); // Kiểm tra dữ liệu
    const normalized = rawHistory.map((order) => ({
      ...order,
      status: order.status === "Đã hủy" ? "Đã huỷ" : order.status,
    }));
    setOrderHistory(normalized);
    saveToLocal(normalized);
  }, []);

  const saveToLocal = (data) => {
    localStorage.setItem("orderHistory", JSON.stringify(data));
  };

  const clearHistory = () => {
    localStorage.removeItem("orderHistory");
    setOrderHistory([]);
  };

  const deleteSingleOrder = (indexToRemove) => {
    const newHistory = [...orderHistory];
    newHistory.splice(indexToRemove, 1);
    setOrderHistory(newHistory);
    saveToLocal(newHistory);
  };

  const getStatusColor = (status) => {
    if (status === "Đã thanh toán") return "text-green-600";
    if (status === "Đã huỷ") return "text-red-500";
    return "text-gray-600";
  };

  const filteredHistory =
    filterStatus === "Tất cả"
      ? orderHistory
      : orderHistory.filter((order) => {
          console.log("Đang kiểm tra trạng thái:", order.status); // Kiểm tra trạng thái
          return order.status === filterStatus;
        });

  return (
    <Page className="page-scrollable bg-[#F4F5F6]">
      <Box className="mt-[42px] px-4 pb-20">
      <IoArrowBackCircleSharp className="text-2xl cursor-pointer"
          onClick={() => navigate("/home")}
      />
        <Box className="flex justify-between items-center mb-4">
          <Text.Title className="text-xl">Lịch sử đơn hàng</Text.Title>
          {orderHistory.length > 0 && (
            <Button
              size="small"
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={clearHistory}
            >
              Xoá tất cả
            </Button>
          )}
        </Box>
        <Box className="mb-4">
          <Select
            label="Lọc theo trạng thái"
            value={filterStatus}
            onChange={(val) => {
              console.log("Trạng thái lọc được chọn:", val); // Kiểm tra giá trị
              setFilterStatus(val);
            }}
            options={[
              { label: "Tất cả", value: "Tất cả" },
              { label: "Đã thanh toán", value: "Đã thanh toán" },
              { label: "Đã huỷ", value: "Đã huỷ" },
            ]}
          />
        </Box>
        {filteredHistory.length === 0 ? (
          <Text className="text-center text-gray-500 mt-10">
            Không có đơn hàng phù hợp.
          </Text>
        ) : (
          <Box className="space-y-4">
            {filteredHistory.map((order, index) => {
              const realIndex = orderHistory.findIndex(
                (item) => item.orderId === order.orderId && item.status === order.status
              );
              return (
                <Box
                  key={index}
                  className="bg-white rounded-xl p-4 shadow relative transition-transform duration-200 hover:scale-[1.01]"
                >
                  <Text className="text-lg font-semibold mb-2">
                    Sự kiện: {order.eventName || "Không rõ"}
                  </Text>
                  <Text className="text-gray-600">Mã đơn hàng: {order.orderId}</Text>
                  <Text className="text-gray-600">Thời gian: {order.orderTime}</Text>
                  <Text className="text-gray-600">Tổng tiền: {order.totalPrice} đ</Text>
                  <Text className={`font-semibold mt-2 ${getStatusColor(order.status)}`}>
                    Trạng thái: {order.status}
                  </Text>
                  <Button
                    size="small"
                    className="absolute top-3 right-3 text-sm bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => deleteSingleOrder(realIndex)}
                  >
                    🗑 Xoá
                  </Button>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Page>
  );
}

export default Lichsu;