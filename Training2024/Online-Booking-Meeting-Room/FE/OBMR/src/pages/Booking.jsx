import React, { useState, useEffect } from "react";
import "../styles/Booking.css";
import BasicDateCalendar from "../components/calender";
import ScheduleApp from "../components/Schedule";
import BookingForm from "../components/BookingForm";
import { format, parse } from 'date-fns';
import { events } from '../data/eventData';
import BookingItem from "../components/BookingItem";
import { useOutletContext } from "react-router-dom";

const Booking = () => {
    const { isSidebarOpen } = useOutletContext();
    const [todayEvents, setTodayEvents] = useState([]);
    
    useEffect(() => {
        // Lọc các sự kiện có ngày trùng với ngày hôm nay
        const eventsToday = events.filter(event => {
          // Phân tích chuỗi ngày giờ của event.start
          const eventDate = parse(event.start, 'yyyy-MM-dd HH:mm', new Date());
          const currentDate = new Date();
          
          // So sánh ngày của event với ngày hiện tại
          return format(eventDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
        });
    
        setTodayEvents(eventsToday);
      }, [events]);

    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleNewMeetingClick = () => {
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
    };

    const handleFormSubmit = (formData) => {
        console.log("Meeting Data Submitted:", formData);
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className={`sidebar shadow ${isSidebarOpen ? "open" : "closed"}`}>
                <div className="sidebar-content px-3 py-3">
                    {/* New meeting btn */}
                    <div className="d-flex justify-content-center mb-3">
                        <button className="btn btn-new-meeting" onClick={handleNewMeetingClick}>+ New meeting</button>
                    </div>
                    {isFormOpen && (
                        <BookingForm
                            onClose={handleFormClose}
                            onSubmit={handleFormSubmit}
                        />
                    )}
                    {/* Calendar */}
                    <BasicDateCalendar />
                    <hr />
                    {/* Today's Meetings */}
                    <div className="mx-2">
                        <div className="d-flex justify-content-between">
                            <h4>Today</h4>
                            <h4>{format(new Date(), 'dd/MM')}</h4>
                        </div>
                        {todayEvents.length > 0 ? (
                            todayEvents.map(event => (
                                <BookingItem key={event.id} event={event}/>
                            ))
                        ) : (
                            <p>No meetings today</p>
                        )}
                    </div>
                </div>
            </div>
            {/* Schedule */}
            <div className="main-content flex-grow-1 p-3">
                {/* <div className="d-flex">
                    <h2>Your booking</h2>
                </div> */}
                <div>
                    <ScheduleApp></ScheduleApp>
                </div>
            </div>
        </div>
    );
};

export default Booking;
