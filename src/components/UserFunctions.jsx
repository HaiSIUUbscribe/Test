import React, { useState } from "react";
import "../css/taikhoan.css";

export const EditUserInfo = ({ userInfo, setUserInfo, onClose }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    alert("Thông tin đã được cập nhật!");
    onClose();
  };

  return (
    <div className="edit-info">
      <h3>Chỉnh sửa thông tin cá nhân</h3>
      <div className="form-group">
        <label>Tên:</label>
        <input
          type="text"
          name="name"
          value={userInfo.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={userInfo.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Số điện thoại:</label>
        <input
          type="text"
          name="phone"
          value={userInfo.phone}
          onChange={handleInputChange}
        />
      </div>
      <button className="save-button" onClick={handleSave}>
        Lưu thông tin
      </button>
    </div>
  );
};

export const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    alert("Mật khẩu đã được thay đổi!");
  };

  return (
    <div className="change-password">
      <h3>Đổi mật khẩu</h3>
      <div className="form-group">
        <label>Mật khẩu mới:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Nhập lại mật khẩu:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button className="save-button" onClick={handleChangePassword}>
        Đổi mật khẩu
      </button>
    </div>
  );
};

export const TransactionHistory = () => {
  const transactions = [
    { id: 1, date: "01/01/2023", amount: "100,000 VND" },
    { id: 2, date: "02/01/2023", amount: "200,000 VND" },
    { id: 3, date: "03/01/2023", amount: "300,000 VND" },
  ];

  return (
    <div className="transaction-history">
      <h3>Lịch sử giao dịch</h3>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            Ngày: {transaction.date} - Số tiền: {transaction.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};