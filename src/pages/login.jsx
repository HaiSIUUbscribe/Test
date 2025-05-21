import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithRedirect } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
import '../css/Login.css';
import logo from '../static/logo.png';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Lưu thông tin vào localStorage
      localStorage.setItem('userName', user.displayName || 'GDOUBLEH User');
      localStorage.setItem('email', user.email);
      localStorage.setItem('uid', user.uid);
      if (!localStorage.getItem('level')) localStorage.setItem('level', 'Lv.1');
      if (!localStorage.getItem('rank')) localStorage.setItem('rank', 'Bạc');
      if (!localStorage.getItem('points')) localStorage.setItem('points', 0);
  
      setError('');
      navigate('/home');
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setError('Email hoặc mật khẩu không đúng!');
      setTimeout(() => setError(''), 5000);
    }
  };
  

  const handleGoogleLogin = () => {
    signInWithRedirect(auth, googleProvider);
  };
  
  const handleForgotPassword = async () => {
    if (!validateEmail(resetEmail)) {
      setResetError('Vui lòng nhập email hợp lệ!');
      setTimeout(() => setResetError(''), 5000);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage('Email đặt lại mật khẩu đã được gửi!');
      setResetError('');
      setTimeout(() => {
        setShowResetModal(false);
        setResetMessage('');
        setResetEmail('');
      }, 5000);
    } catch (error) {
      console.error('Lỗi gửi email:', error);
      setResetError('Không thể gửi email. Vui lòng thử lại!');
      setTimeout(() => setResetError(''), 5000);
    }
  };

  return (
    <div className="container">
      <div className="logo">
        <img src={logo} alt="Logo" />
        <h1>GDOUBLEH</h1>
      </div>
      <h2>ĐĂNG NHẬP/ĐĂNG KÝ</h2>
      <form className="form" onSubmit={handleLogin}>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          required
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn-login">Đăng Nhập</button>

        <div className="forgot-password">
          <button type="button" className="link-button" onClick={() => setShowResetModal(true)}>
            Quên mật khẩu?
          </button>
        </div>

        <div className="text">Hoặc đăng nhập với</div>
      </form>

      <div className="social-login">
        <button className="btn-facebook">Facebook</button>
        <button className="btn-google" onClick={handleGoogleLogin}>Google</button>
      </div>

      <p className="footer-text">
        Bạn chưa có tài khoản? <a onClick={() => navigate("/dangky")}>Đăng ký ngay</a>
      </p>

      {/* Modal quên mật khẩu */}
      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Quên mật khẩu</h3>
            <input
              type="email"
              placeholder="Nhập email"
              className="input-field"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            {resetError && <p className="error-message">{resetError}</p>}
            {resetMessage && <p className="success-message">{resetMessage}</p>}
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowResetModal(false)}>Hủy</button>
              <button className="btn-submit" onClick={handleForgotPassword}>Gửi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
