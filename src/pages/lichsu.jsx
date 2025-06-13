import { useState, useEffect } from "react";
import { Box, Page, Text, Button } from "zmp-ui";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function Lichsu() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const rawHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
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
          return order.status === filterStatus;
        });

  return (
    <Page className="page-scrollable bg-[#F4F5F6]">
      <Box className="mt-[42px] px-4 pb-20">
        <IoArrowBackCircleSharp
          className="text-2xl cursor-pointer"
          onClick={() => navigate("/home")}
        />

        <Box className="flex justify-between items-center mb-4">
          <Text.Title className="text-xl text-[#FC692A]">Lịch sử đơn hàng</Text.Title>
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
          <Button
            className="w-full text-left border px-4 py-2 bg-white text-[#116CE2]"
            onClick={() => setShowFilterPopup(true)}
          >
            Lọc theo trạng thái: <b>{filterStatus}</b>
          </Button>
        </Box>

        {showFilterPopup && (
          <>
            {/* Overlay */}
            <Box className="fixed top-0 left-0 w-full h-full bg-black opacity-30 z-40" onClick={() => setShowFilterPopup(false)} />

            {/* Popup nội dung */}
            <Box className="fixed bottom-0 left-0 w-full bg-white border-t px-4 py-4 z-50 rounded-t-xl shadow-lg transition-transform duration-300"
              style={{ height: "40vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}
            >
              <Box className="flex justify-between items-center mb-4">
                <Text className="font-bold text-lg">Lọc theo trạng thái</Text>
                <button
                  className="text-white bg-[#F51111] px-3 py-2 mr-3 text-m rounded"
                  onClick={() => setShowFilterPopup(false)}
                >
                  Đóng
                </button>
              </Box>
              <Box className="space-y-2">
                {["Tất cả", "Đã thanh toán", "Đã huỷ"].map((status) => (
                  <Button
                    key={status}
                    className={`w-full text-left px-4 py-2 rounded ${
                      filterStatus === status
                        ? "bg-[#FC692A] text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                    onClick={() => {
                      setFilterStatus(status);
                      setShowFilterPopup(false);
                    }}
                  >
                    {status}
                  </Button>
                ))}
              </Box>
            </Box>
          </>
        )}

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
