import React, { useState, useEffect } from "react";
import {
    collection,
    setDoc,
    deleteDoc,
    doc,
    onSnapshot,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../css/Admin.css";

const Admin = () => {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        id: "",
        name: "",
        date: "",
        time: "",
        vote: "",
        location: "",
        description: "",
        img: "",
        price: "",
    });
    const [editEventId, setEditEventId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showAllEvents, setShowAllEvents] = useState(false); // Trạng thái hiển thị toàn bộ sự kiện
    const visibleEvents = showAllEvents ? events : events.slice(0, 2); // Hiển thị 2 sự kiện hoặc toàn bộ

    // Lấy danh sách sự kiện từ Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
            const eventsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEvents(eventsData);
        });

        return () => unsubscribe();
    }, []);

    // Ẩn thông báo sau 3 giây
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Thêm hoặc cập nhật sự kiện
    const handleAddOrUpdateEvent = async () => {
        try {
            if (editEventId) {
                // Cập nhật sự kiện
                const eventRef = doc(db, "events", editEventId);
                await updateDoc(eventRef, {
                    name: newEvent.name,
                    date: Timestamp.fromDate(new Date(newEvent.date)),
                    time: newEvent.time,
                    vote: newEvent.vote,
                    location: newEvent.location,
                    description: newEvent.description,
                    img: newEvent.img,
                    prices: [{ price: newEvent.price, currency: "₫" }],
                });
                setSuccessMessage("✅ Cập nhật sự kiện thành công!");
                setEditEventId(null);
            } else {
                // Kiểm tra xem id đã tồn tại chưa
                const eventRef = doc(db, "events", newEvent.id);
                const eventSnap = await getDoc(eventRef);
    
                if (eventSnap.exists()) {
                    // Nếu id đã tồn tại, hiển thị thông báo lỗi
                    setErrorMessage("❌ ID sự kiện đã tồn tại. Vui lòng chọn ID khác.");
                    return;
                }
    
                // Thêm sự kiện mới
                await setDoc(eventRef, {
                    name: newEvent.name,
                    date: Timestamp.fromDate(new Date(newEvent.date)),
                    time: newEvent.time,
                    vote: newEvent.vote,
                    location: newEvent.location,
                    description: newEvent.description,
                    img: newEvent.img,
                    prices: [{ price: newEvent.price, currency: "₫" }],
                });
                setSuccessMessage("✅ Thêm sự kiện mới thành công!");
            }
    
            // Reset form sau khi thêm hoặc cập nhật
            setNewEvent({
                id: "",
                name: "",
                date: "",
                time: "",
                vote: 0,
                location: "",
                description: "",
                img: "",
                price: "",
            });
        } catch (error) {
            console.error("Lỗi khi thêm hoặc cập nhật sự kiện:", error);
            setErrorMessage("❌ Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    // Xóa sự kiện
    const handleDeleteEvent = async (id) => {
        try {
            await deleteDoc(doc(db, "events", id));
            setSuccessMessage("🗑️ Xóa sự kiện thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa sự kiện:", error);
        }
    };

    // Chỉnh sửa sự kiện
    const handleEditEvent = (event) => {
        setEditEventId(event.id);
        setNewEvent({
            id: event.id,
            name: event.name,
            date: event.date.toDate().toISOString().split("T")[0],
            time: event.time,
            vote: event.vote,
            location: event.location,
            description: event.description,
            img: event.img,
            price: event.prices?.[0]?.price || "",
        });
    };

    return (
        <div className="admin-container">
            <h2>Quản lý sự kiện</h2>

            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}

            <div className="add-event-form">
                <h3>{editEventId ? "Sửa sự kiện" : "Thêm sự kiện mới"}</h3>
                <input
                    type="text"
                    placeholder="ID sự kiện (tùy chỉnh)"
                    value={newEvent.id}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, id: e.target.value })
                    }
                    disabled={!!editEventId}
                />
                <input
                    type="text"
                    placeholder="Tên sự kiện"
                    value={newEvent.name}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, name: e.target.value })
                    }
                />
                <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, date: e.target.value })
                    }
                />
                <input
                    type="time"
                    placeholder="Thời gian"
                    value={newEvent.time}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, time: e.target.value })
                    }
                />
                <input
                    type="text"
                    placeholder="Đánh giá"
                    value={newEvent.vote}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, vote: e.target.value })
                    }
                />
                <input
                    type="text"
                    placeholder="Địa điểm"
                    value={newEvent.location}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, location: e.target.value })
                    }
                />
                <textarea
                    placeholder="Mô tả"
                    value={newEvent.description}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, description: e.target.value })
                    }
                ></textarea>
                <input
                    type="text"
                    placeholder="URL hình ảnh"
                    value={newEvent.img}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, img: e.target.value })
                    }
                />
                <input
                    type="text"
                    placeholder="Giá vé"
                    value={newEvent.price}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, price: e.target.value })
                    }
                />
                <button onClick={handleAddOrUpdateEvent}>
                    {editEventId ? "Cập nhật sự kiện" : "Thêm sự kiện"}
                </button>
            </div>

            <div className="event-list">
                <h3>Danh sách sự kiện</h3>
                {visibleEvents.map((event) => (
                    <div key={event.id} className="event-item">
                        <h4>{event.name}</h4>
                        <p>
                            Ngày:{" "}
                            {event.date?.seconds
                                ? new Date(event.date.seconds * 1000).toLocaleDateString(
                                      "vi-VN"
                                  )
                                : event.date}
                        </p>
                        <p>Thời gian: {event.time}</p>
                        <p>Địa điểm: {event.location}</p>
                        <p>Mô tả: {event.description}</p>
                        <button className="mr-10" onClick={() => handleEditEvent(event)}>
                            Sửa
                        </button>
                        <button onClick={() => handleDeleteEvent(event.id)}>Xóa</button>
                    </div>
                ))}

                {/* Nút Xem chi tiết */}
                {events.length > 2 && (
                    <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setShowAllEvents(!showAllEvents)}
                    >
                        {showAllEvents ? "Ẩn bớt" : "Xem chi tiết"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Admin;
