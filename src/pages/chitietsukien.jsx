import React, { useEffect, useState } from 'react';
import '../css/chitietsukien.css';
import bg_event from '../static/bg_event.png';
import {
  FaStar, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaChevronRight, FaTelegram
} from 'react-icons/fa';
import { BsFillTicketPerforatedFill } from "react-icons/bs";
import { IoChevronBackCircle } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import special from "../Data/special";
import music from "../Data/music";
import sport from "../Data/sport";
import cmt from "../Data/cmt";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ChiTietSukien = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Ưu tiên lấy từ Firebase
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEventData({ id: docSnap.id, ...docSnap.data() });
          setLoading(false);
          return;
        }

        // Nếu không có trong Firebase, lấy từ dữ liệu cục bộ
        const allData = [...special, ...music, ...sport];
        const foundEvent = allData.find((item) => item.id === id);

        if (foundEvent) {
          setEventData(foundEvent);
        } else {
          console.error("Không tìm thấy sự kiện ở Firebase hoặc dữ liệu cục bộ.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sự kiện:", error);
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  if (loading) return <div className="loading">Đang tải dữ liệu sự kiện...</div>;

  if (!eventData) return <div className="error">Không tìm thấy sự kiện.</div>;

  return (
    <div className="container page-scrollable">
      {/* Header */}
      <div className="Header">
        <img src={bg_event} alt="Ảnh nền" className="background-image" />
        <IoChevronBackCircle
          className="text-2xl cursor-pointer return relative z-10"
          onClick={() => navigate("/home")}
        />
        <img src={eventData?.img} alt="Ảnh sự kiện" className="image" />
      </div>

      <div className="content page-body-scrollable">
        {/* Thông tin sự kiện */}
        <div className="B1">
          <h1>{eventData?.name}</h1>
          <p className="rating flex">
            <FaStar className="star-icon" /> {eventData?.vote || "Chưa có"} (1.35K+ đánh giá)
          </p>
          <p className="time flex">
            <FaClock className="clock-icon" /> {eventData?.time}
          </p>
          <p className="date flex">
            <FaCalendarAlt className="calendar-icon" />{" "}
            {eventData?.date?.seconds
              ? new Date(eventData.date.seconds * 1000).toLocaleDateString("vi-VN")
              : eventData?.date}
          </p>
          <p className="location flex">
            <FaMapMarkerAlt className="location-icon" /> {eventData?.location}
          </p>
        </div>

        {/* Ưu đãi */}
        <div className="B2 flex">
          <h3 className="pr-20">Ưu đãi cho bạn</h3>
          <div className="sale flex">
            <BsFillTicketPerforatedFill />
            <p className="pl-2 pr-2">Giảm 10%</p>
          </div>
          <FaChevronRight />
        </div>

        {/* Giới thiệu sự kiện */}
        <div className="B3">
          <h2>Giới thiệu về sự kiện</h2>
          <p>{eventData?.description}</p>
          <h3>Giá vé:</h3>
          <ul>
            {eventData?.prices?.map((price, index) => (
              <li key={index}>
                {price.price} {price.currency}
              </li>
            ))}
          </ul>
          <h3>Quy định:</h3>
          <ul>
            <li>- Trẻ em dưới 1m1 ngồi cùng bố mẹ được miễn phí. Trên 1m1 tính như người lớn.</li>
            <li>- Đặt bàn tính theo đầu người, bao gồm 1 voucher đồ uống.</li>
            <li>- Yêu cầu chuyển khoản 100% phí đặt bàn để giữ chỗ.</li>
            <li>- Chi phí phát sinh (ngoài combo đã đặt) sẽ thanh toán riêng tại phòng thu ngân.</li>
          </ul>
          <p className="pt-2">* Hotline hỗ trợ mua vé: 09.999.80.818 - 0243.793.00.99</p>
        </div>

        {/* Đánh giá */}
        <div className="B4">
          <h2>Đánh giá</h2>
          <div className="cmt">
            {cmt.map((comment) => (
              <div className="review-item" key={comment.id}>
                <div className="reviewer-info flex">
                  <img src={comment.img} alt="Avatar" className="cmt1 pr-2" />
                  <div>
                    <p className="reviewer-name">{comment.name}</p>
                    <p className="review-time">{comment.time}</p>
                  </div>
                </div>
                <p className="review-text">{comment.review}</p>
              </div>
            ))}
          </div>
          <div className="cmt_update">
            <input type="text" placeholder="Viết đánh giá của bạn..." />
            <button className="btn">Đăng</button>
          </div>
        </div>

        {/* Câu hỏi thường gặp */}
        <div className="B5 p-5">
          <h2>Câu hỏi thường gặp</h2>
          <div className="question_mini">
            <p>Hỗ trợ khách hàng</p>
            <FaChevronRight className="icon_ques" />
          </div>
        </div>

        {/* Footer mua vé */}
        <div className="footer-buy">
          <div className="footer-price">
            <span className="label">Từ</span>
            <span className="price">
              {eventData?.prices?.[0]?.currency} {eventData?.prices?.[0]?.price}
            </span>
          </div>
          <button className="buy-btn" onClick={() => navigate(`/tuychon/${id}`)}>
            CHỌN
            <FaTelegram className="tele" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChiTietSukien;
