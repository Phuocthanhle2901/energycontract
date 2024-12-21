import React, { useState } from "react";
const rightside = () => {
    return (
        <div
            className="rightside d-flex align-items-center justify-content-center position-relative"
            style={{
                backgroundImage: "url('/images/wall.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
            <div className="position-relative text-white text-center p-4 bg-dark bg-opacity-50 rounded" style={{ zIndex: 1 }}>
                <h2 className="fs-1 fw-bold mb-3">Company Event Meeting</h2>
                <p className="fs-5">
                    An online platform for booking meeting rooms offering convenience
                    and efficiency for virtual and in-person meetings.
                </p>
            </div>
        </div>
    );
};

export default rightside;
