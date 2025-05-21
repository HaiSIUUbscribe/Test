import React, { useState } from "react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        setError("Không tìm thấy người dùng. Vui lòng đăng nhập lại!");
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      setSuccessMessage("Đổi mật khẩu thành công!");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);

      if (error.code === "auth/wrong-password") {
        setError("Mật khẩu hiện tại không đúng!");
      } else if (error.code === "auth/too-many-requests") {
        setError("Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau!");
      } else if (error.code === "auth/requires-recent-login") {
        setError("Vui lòng đăng nhập lại để đổi mật khẩu!");
      } else {
        setError("Đổi mật khẩu thất bại! Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#FC692A]">Đổi mật khẩu</h2>
        <form className="space-y-4" onSubmit={handleChangePassword}>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

          <input
            type="password"
            placeholder="Mật khẩu hiện tại"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-[#FC692A] text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
          >
            Đổi mật khẩu
          </button>
        </form>

        <button
          className="w-full mt-4 text-500 hover:underline text-sm"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
