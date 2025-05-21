import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import '../css/Login.css';
import logo from '../static/logo.png';

const RegisterForm = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullname.trim()) {
      setError('Vui lòng nhập họ tên!');
      clearMessages();
      return;
    }

    if (!validateEmail(email)) {
      setError('Email không đúng định dạng!');
      clearMessages();
      return;
    }

    if (!/^\d{10,11}$/.test(phone)) {
        setError('Số điện thoại không hợp lệ!');
        clearMessages();
        return;
      }
      
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      clearMessages();
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      clearMessages();
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullname });

      await addDoc(collection(db, 'users'), {
        fullname,
        email,
        phone,
        uid: user.uid,
      });

        localStorage.setItem('userName', fullname);
        localStorage.setItem('email', email);
        localStorage.setItem('phone', phone);
        localStorage.setItem('points', 0); // Mặc định 0 điểm
        localStorage.setItem('level', 'Lv.1');
        localStorage.setItem('rank', 'Bạc');

      setSuccessMessage('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
      setError('');
      setFullname('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error('Lỗi đăng ký:', error);

      if (error.code === 'auth/email-already-in-use') {
        setError('Email này đã được đăng ký!');
      } else {
        setError('Đăng ký thất bại! Vui lòng thử lại.');
      }

      clearMessages();
    }
  };

  // Hàm ẩn thông báo lỗi sau 5 giây
  const clearMessages = () => {
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  return (
    <div className="container">
      <div className="logo">
        <img src={logo} alt="Logo" />
        <h1>GDOUBLEH</h1>
      </div>
      <h2>ĐĂNG KÝ TÀI KHOẢN</h2>
      <form className="form" onSubmit={handleRegister}>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <input
          type="text"
          placeholder="Họ và tên"
          required
          className="input-field"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
            type="tel"
            placeholder="Số điện thoại"
            required
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          required
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          required
          className="input-field"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className="btn-login">
          Đăng Ký
        </button>
      </form>
      <p className="footer-text">
        Đã có tài khoản? <a href="/">Đăng nhập</a>
      </p>
    </div>
  );
};

export default RegisterForm;
