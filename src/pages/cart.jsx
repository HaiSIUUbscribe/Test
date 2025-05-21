import React from 'react';
import { Box, Page, Text, Button } from 'zmp-ui';
import { IoChevronBackCircle } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import '../css/cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const storedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
      setCartItems(storedCart);
      setSelectedItems(new Array(storedCart.length).fill(false));
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error);
    }
  };

  const handleRemoveItem = (index) => {
    try {
      const updatedCart = [...cartItems];
      updatedCart.splice(index, 1);

      const updatedSelected = [...selectedItems];
      updatedSelected.splice(index, 1);

      sessionStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      setSelectedItems(updatedSelected);
    } catch (error) {
      console.error('Lỗi khi xóa mục khỏi giỏ hàng:', error);
    }
  };

  const handleClearCart = () => {
    try {
      sessionStorage.removeItem('cart');
      setCartItems([]);
      setSelectedItems([]);
      alert('Giỏ hàng đã được xóa!');
    } catch (error) {
      console.error('Lỗi khi xóa giỏ hàng:', error);
    }
  };

  const handleSelectItem = (index) => {
    const updatedSelected = [...selectedItems];
    updatedSelected[index] = !updatedSelected[index];
    setSelectedItems(updatedSelected);
  };

  const selectedCartItems = cartItems.filter((_, index) => selectedItems[index]);

  const totalAmount = selectedCartItems.reduce((sum, item) => {
    const ticketTotal = item.total || 0;
    const seatTotal = item.seats
      ? item.seats.reduce((seatSum, seat) => seatSum + (seat.seatPrice || 0), 0)
      : 0;
    return sum + ticketTotal + seatTotal;
  }, 0);
  console.log('Tổng tiền hiển thị:', totalAmount);

  React.useEffect(() => {
    loadCart();
  }, []);

  const calculateTotalAmount = (items) => {
    return items.reduce((sum, item) => {
      const ticketTotal = item.total || 0;
      const seatTotal = item.seats
        ? item.seats.reduce((seatSum, seat) => seatSum + (seat.seatPrice || 0), 0)
        : 0;
      return sum + ticketTotal + seatTotal;
    }, 0);
  };
  

  return (
    <Page className="page-scrollable bg-white">
      <Box className="p-4">
        <IoChevronBackCircle
          className="text-2xl cursor-pointer mb-4"
          onClick={() => navigate(-1)}
        />
        <Text.Title className="text-xl mb-4">Giỏ hàng</Text.Title>

        {cartItems.length === 0 ? (
          <Text className="text-gray-500">Giỏ hàng của bạn đang trống.</Text>
        ) : (
          <Box className="space-y-4">
            {cartItems.map((item, index) => (
              <Box
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center"
              >
                <Box>
                  <Box className="mb-2">
                    <input
                      type="checkbox"
                      checked={selectedItems[index] || false}
                      onChange={() => handleSelectItem(index)}
                      className="mr-2"
                    />
                    <Text.Title className="text-base font-medium inline">
                      {item.name}
                    </Text.Title>
                  </Box>
                  <Text className="text-sm text-gray-500">Ngày: {item.date}</Text>
                  <Text className="text-sm text-gray-500">Thời gian: {item.time}</Text>
                  <Text className="text-sm text-gray-500">Địa điểm: {item.location}</Text>
                  <Text className="text-sm text-gray-500">Loại vé: {item.type}</Text>
                  <Text className="text-sm text-gray-500">Số lượng: {item.quantity}</Text>
                  <Text className="text-sm text-gray-500">
                    Giá: {(item.price || 0).toLocaleString('vi-VN')} đ
                  </Text>
                  {item.seats && item.seats.length > 0 && (
                      <Box className="mt-2">
                        <Text className="text-sm font-medium text-gray-700">Danh sách ghế:</Text>
                        {item.seats.map((seat, seatIndex) => (
                          <Text key={seatIndex} className="text-sm text-gray-500">
                            - Ghế: {seat.seatId}, Loại: {seat.seatType}, Giá:{" "}
                            {seat.seatPrice.toLocaleString("vi-VN")} đ
                          </Text>
                        ))}
                      </Box>
                    )}
                  <Text className="text-sm font-semibold text-orange-600">
                    Tổng:{' '}
                    {(
                      (item.total || 0) +
                      (item.seats
                        ? item.seats.reduce((seatSum, seat) => seatSum + (seat.seatPrice || 0), 0)
                        : 0)
                    ).toLocaleString('vi-VN')}{' '}
                    đ
                  </Text>
                </Box>
                <Box className="flex flex-col space-y-2">
                  <Button
                    size="small"
                    variant="tertiary"
                    className="text-red-500"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Xóa
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}

          {cartItems.length > 0 && (
            <Box className="mt-4">
              <Text.Title className="text-lg font-semibold text-orange-600">
                Tổng cộng: {totalAmount.toLocaleString('vi-VN')} đ
              </Text.Title>
              <Button
                  className="w-full mt-4 bg-orange-500 text-white"
                  onClick={() => {
                    const itemsToPay = selectedCartItems.length > 0 ? selectedCartItems : cartItems;
                    console.log('Các mục được thanh toán:', itemsToPay);

                    const total = calculateTotalAmount(itemsToPay);
                    console.log('Tổng tiền được tính:', total); 
                    // Log dữ liệu trước khi điều hướng
                    console.log("Dữ liệu được truyền đi:", { cartItems: itemsToPay, totalAmount: total });

                    navigate('/thanhtoan', {
                      state: {
                        cartItems: itemsToPay, // Nếu có mục được chọn, chỉ thanh toán các mục đó. Nếu không, thanh toán toàn bộ giỏ hàng.
                        totalAmount: total,
                      },
                    });
                  }}
                  disabled={cartItems.length === 0} // Vô hiệu hóa nếu giỏ hàng trống
                >
                  Thanh toán
                </Button>
              <Button
                className="w-full mt-4 bg-red-500 text-white"
                onClick={handleClearCart}
              >
                Xóa tất cả
              </Button>
            </Box>
          )}
      </Box>
    </Page>
  );
};

export default Cart;
