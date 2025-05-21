import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import { IoChevronBackCircle } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import events from "../Data/events";
import music from "../Data/music";
import sport from "../Data/sport";

const initialStock = {
  adultWeekday: 50,
  childWeekday: 50,
  adultWeekend: 50,
  childWeekend: 50,
};

const OrderOptions = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState({
    adultWeekday: 0,
    childWeekday: 0,
    adultWeekend: 0,
    childWeekend: 0,
  });
  const [ticketRemaining, setTicketRemaining] = useState(initialStock);
  const [isWeekend, setIsWeekend] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const seatMap = [
  { id: "A1", type: "regular" },
  { id: "A2", type: "regular"},
  { id: "A3", type: "vip" },
  { id: "A4", type: "vip" },
  { id: "B1", type: "regular"},
  { id: "B2", type: "regular"},
  { id: "B3", type: "vip"},
  { id: "B4", type: "vip"},
];

  useEffect(() => {
    const allData = [...events, ...music, ...sport];
    const foundEvent = allData.find((item) => item.id === id);
    if (!foundEvent) {
      setEventData(null);
      return;
    }
    setEventData(foundEvent);
  }, [id]);

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

  const handleDateChange = (e) => {
    const selected = e.target.value;
    const today = new Date();
    const selectedDateObj = new Date(selected);
    today.setHours(0, 0, 0, 0);
    selectedDateObj.setHours(0, 0, 0, 0);

    if (selectedDateObj < today) {
      alert('Không được chọn ngày trong quá khứ!');
      return;
    }

    setSelectedDate(selected);
    const day = selectedDateObj.getDay();
    setIsWeekend(day === 0 || day === 6);
  };

  const handleIncrement = (type) => {
    if (!selectedDate || guestCount[type] >= ticketRemaining[type]) return;
    if (!isWeekend && type.includes('Weekend')) return;
    if (isWeekend && type.includes('Weekday')) return;

    setGuestCount((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
    setTicketRemaining((prev) => {
      const updated = {
        ...prev,
        [type]: prev[type] - 1,
      };
      sessionStorage.setItem('ticketRemaining', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDecrement = (type) => {
    if (!selectedDate || guestCount[type] === 0) return;

    setGuestCount((prev) => ({
      ...prev,
      [type]: prev[type] - 1,
    }));
    setTicketRemaining((prev) => {
      const updated = {
        ...prev,
        [type]: prev[type] + 1,
      };
      sessionStorage.setItem('ticketRemaining', JSON.stringify(updated));
      return updated;
    });
  };

  const getTotal = () => {
    if (!eventData) return 0;

    const ticketPrices = {
      adultWeekday: parseInt(eventData.prices[0].price.replace(/,/g, '')),
      childWeekday: parseInt(eventData.prices[0].price.replace(/,/g, '')) - 100000,
      adultWeekend: parseInt(eventData.prices[0].price.replace(/,/g, '')) + 100000,
      childWeekend: parseInt(eventData.prices[0].price.replace(/,/g, '')) + 50000,
    };

    const ticketTotal = Object.keys(guestCount).reduce(
      (sum, type) => sum + guestCount[type] * ticketPrices[type],
      0
    );
      const seatTotal = getTotalSeatPrice();
      return ticketTotal + seatTotal;
  };

  const handleAddToCart = () => {
    const items = [];
  
    Object.keys(guestCount).forEach((type) => {
      const count = guestCount[type];
      if (count > 0) {
        // Lấy số ghế tương ứng với số lượng vé
        const seatsForTickets = selectedSeats.slice(0, count);
  
        items.push({
          id: eventData.id,
          name: eventData.name,
          date: selectedDate,
          time: eventData.time,
          location: eventData.location,
          type,
          quantity: count,
          price: ticketPrices[type],
          total: count * ticketPrices[type],
          seats: seatsForTickets.map((seatId) => {
            const seat = seatMap.find((s) => s.id === seatId);
            return {
              seatId: seat.id,
              seatType: seat.type === "vip" ? "Ghế VIP" : "Ghế thường",
              seatPrice: seat.type === "vip" ? 200000 : 100000, // Giá ghế
            };
          }),
        });
  
        // Loại bỏ các ghế đã được gắn với vé
        selectedSeats.splice(0, count);
      }
    });
  
    try {
      const existingCart = JSON.parse(sessionStorage.getItem("cart")) || [];
      const updatedCart = [...existingCart];
  
      items.forEach((newItem) => {
        const existingItemIndex = updatedCart.findIndex(
          (item) =>
            item.id === newItem.id &&
            item.date === newItem.date &&
            item.time === newItem.time &&
            item.location === newItem.location
        );
  
        if (existingItemIndex !== -1) {
          // Nếu sự kiện đã tồn tại, cập nhật số lượng, tổng tiền và ghế
          updatedCart[existingItemIndex].quantity += newItem.quantity;
          updatedCart[existingItemIndex].total += newItem.total;
          updatedCart[existingItemIndex].seats = [
            ...updatedCart[existingItemIndex].seats,
            ...newItem.seats,
          ];
        } else {
          // Nếu sự kiện chưa tồn tại, thêm mới
          updatedCart.push(newItem);
        }
      });
  
      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      setShowBadge(updatedCart.length > 0); // Cập nhật trạng thái badge
      alert("Đã thêm vào giỏ hàng!");
  
      // Xóa danh sách ghế đã chọn sau khi thêm vào giỏ hàng
      setSelectedSeats([]);
    } catch (error) {
      console.error("Lỗi khi lưu giỏ hàng:", error);
      alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
    }
  };

  if (!eventData) {
    return <div>Loading...</div>;
  }

  const handleSeatSelect = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId) // Bỏ chọn ghế nếu đã chọn
        : [...prev, seatId] // Thêm ghế vào danh sách đã chọn
    );
  };

  const getTotalSeatPrice = () => {
  return selectedSeats.reduce((total, seatId) => {
    const seat = seatMap.find((s) => s.id === seatId);
    return total + (seat.type === "vip" ? 200000 : 100000);
  }, 0);
};

  const ticketPrices = {
    adultWeekday: parseInt(eventData.prices[0].price.replace(/,/g, '')),
    childWeekday: parseInt(eventData.prices[0].price.replace(/,/g, '')) - 100000,
    adultWeekend: parseInt(eventData.prices[0].price.replace(/,/g, '')) + 100000,
    childWeekend: parseInt(eventData.prices[0].price.replace(/,/g, '')) + 50000,
  };

  const ticketOptions = [
    { type: 'adultWeekday', label: 'Người lớn - Vé Trong Tuần' },
    { type: 'childWeekday', label: 'Trẻ em (100 - 139 cm) - Vé Trong Tuần' },
    { type: 'adultWeekend', label: 'Người lớn - Vé Cuối Tuần và Lễ' },
    { type: 'childWeekend', label: 'Trẻ em (100 - 139cm) - Vé Cuối Tuần & Lễ' },
  ];

  const isOrderValid = () => {
    const totalTickets = Object.values(guestCount).reduce((sum, count) => sum + count, 0);
    return selectedDate && totalTickets > 0 && selectedSeats.length === totalTickets;
  };
  

  return (
    <div className="p-4 bg-white min-h-screen pb-24 relative">
      <IoChevronBackCircle
        className="text-2xl cursor-pointer absolute top-5 z-10"
        onClick={() => navigate(`/chitietsukien/${id}`)}
      />

      <div className="absolute right-4 top-4 cursor-pointer" onClick={() => navigate("/cart")}>
        <FaShoppingCart className="text-2xl" />
        {showBadge && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            1
          </span>
        )}
      </div>

      <h1 className="text-lg font-semibold text-center mb-1">Tùy chọn đơn hàng</h1>

      <div className="mb-4">
        <img
          src={eventData.img}
          alt={eventData.name}
          className="w-full h-64 object-cover rounded-lg shadow-md"
        />
      </div>

      <h2 className="text-base font-medium text-gray-800 mb-2">{eventData.name}</h2>
      <p className="text-sm text-gray-600">{eventData.date} - {eventData.time}</p>

      <div className="border rounded-xl p-4 mb-4">
        <p className="text-sm font-medium mb-1">Vui lòng chọn ngày tham quan</p>
        <input
          type="date"
          className="w-full border rounded p-2 text-sm"
          onChange={handleDateChange}
          value={selectedDate}
        />
      </div>

      <div className={`border rounded-xl divide-y text-sm ${!selectedDate ? 'opacity-50 pointer-events-none' : ''}`}>
        {ticketOptions.map(({ type, label }) => {
          const isDisabled =
            (!isWeekend && type.includes('Weekend')) || (isWeekend && type.includes('Weekday'));
          return (
            <div key={type} className={`flex justify-between items-center p-3 ${isDisabled ? 'opacity-40' : ''}`}>
              <div>
                <div>{label}</div>
                <div className="text-xs text-gray-500">Còn lại: {ticketRemaining[type]}</div>
                <div className="text-xs text-gray-500">Giá: {ticketPrices[type].toLocaleString('vi-VN')} đ</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecrement(type)}
                  className="w-7 h-7 bg-gray-100 rounded"
                  disabled={guestCount[type] === 0 || isDisabled}
                >-</button>
                <span>{guestCount[type]}</span>
                <button
                  onClick={() => handleIncrement(type)}
                  className="w-7 h-7 bg-gray-100 rounded"
                  disabled={isDisabled || ticketRemaining[type] === 0}
                >+</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Sơ đồ ghế</h3>
          <p className="text-xs text-gray-500">Ghế VIP +200,000đ</p>
          <p className="text-xs text-gray-500 mb-4">Ghế thường +100,000đ</p>
          {selectedSeats.length !== Object.values(guestCount).reduce((a, b) => a + b, 0) && (
              <p className="text-red-600 text-sm mt-2">
                Số ghế đã chọn không khớp với số lượng vé. Vui lòng chọn đủ ghế.
              </p>
            )}
        <div className="grid grid-cols-4 gap-2">
            {seatMap.map((seat) => (
            <button
              key={seat.id}
              onClick={() => handleSeatSelect(seat.id)}
              className={`w-12 h-12 rounded ${
                selectedSeats.includes(seat.id)
                  ? "bg-green-500 text-white"
                  : seat.type === "vip"
                  ? "bg-yellow-500"
                  : "bg-gray-300"
              }`}
            >
              {seat.id}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex justify-between items-center z-10">
        <div className="text-orange-600 font-semibold text-base">
          {getTotal().toLocaleString('vi-VN')} đ
        </div>
        <div className="flex gap-2">
          <button
            className="bg-yellow-400 text-black font-medium px-4 py-2 rounded"
            onClick={handleAddToCart}
            disabled={!isOrderValid()}
          >
            Thêm vào giỏ hàng
          </button>
          <button
            className="bg-orange-500 text-white font-medium px-4 py-2 rounded"
            disabled={!isOrderValid()}
            onClick={() =>
              navigate(`/thanhtoan`, {
                state: {
                  name: eventData.name,
                  date: selectedDate,
                  time: eventData.time,
                  location: eventData.location,
                  ticketDetails: Object.keys(guestCount)
                    .filter((type) => guestCount[type] > 0)
                    .map((type) => ({
                      type,
                      quantity: guestCount[type],
                      price: ticketPrices[type],
                      total: guestCount[type] * ticketPrices[type],
                    })),
                    seatDetails: selectedSeats.map((seatId) => {
                    const seat = seatMap.find((s) => s.id === seatId);
                    return {
                      seatId: seat.id,
                      seatType: seat.type === "vip" ? "Ghế VIP" : "Ghế thường",
                      seatPrice: seat.type === "vip" ? 200000 : 100000,
                    };
                  }),
                  totalAmount: getTotal(), // Truyền tổng cộng
                },
              })
            }
          >
            Đặt ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderOptions;