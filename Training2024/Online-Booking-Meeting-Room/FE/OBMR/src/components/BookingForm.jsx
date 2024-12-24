import { format } from "date-fns";
import React, { useEffect, useState } from "react";

const BookingForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    description: "",
    menber: "",
  });

  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState(format(new Date(), 'HH:mm'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endTime, setEndTime] = useState(format(new Date(), 'HH:mm'));

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Xử lý riêng từng trường
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "startTime") {
      setStartTime(value);
    } else if (name === "endDate") {
      setEndDate(value);
    } else if (name === "endTime") {
      setEndTime(value);
    } else {
      // Các trường khác
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const finalData = {
      ...formData,
      startDate,
      startTime,
      endDate,
      endTime,
    };
  
    console.log("Submitted Data:", finalData);
    onSubmit(finalData);
    onClose();
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
      <div className="bg-white p-5 rounded shadow" style={{ width: "800px", position: "relative" }}>
      <button
      onClick={onClose}
      className="close-button position-absolute top-0 end-0 btn btn-link"
      style={{
        fontSize: "1.5rem",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: "0.5rem",
        height: "50px",
        width: "50px",
        color: "#1B374D",
      }}
    >
      <i className="fa-solid fa-xmark"></i>
    </button>
        <div className="d-flex justify-content-center">
          <h4 className="mb-3 fw-bold" style={{color:"#1B374D"}}>EVENT MEETING</h4>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 flex-grow-1">
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="Add title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 flex-grow-1">
            <input
              type="text"
              id="member"
              name="member"
              className="form-control"
              placeholder="Add menber"
              value={formData.member}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 d-flex align-items-center">
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="form-control"
              value={startDate}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              id="startTime"
              name="startTime"
              className="form-control ms-2"
              value={startTime}
              onChange={handleChange}
              required
            />
            <i className="fa-solid fa-arrow-right mx-3"></i>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="form-control"
              value={endDate}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              id="endTime"
              name="endTime"
              className="form-control ms-2"
              value={endTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 flex-grow-1">
            <select
              id="location"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
            >
              <option value="">Location</option>
              <option value="Location 1">Location 1</option>
              <option value="Location 2">Location 2</option>
              <option value="Location 3">Location 3</option>

            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-new-meeting px-5">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
