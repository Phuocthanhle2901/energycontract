import { useState } from "react";
import RoomTable from "../../components/room_table/RoomTable";
import "../../styles/RoomController.css"
import AddRoomForm from "../../components/AddRoomForm";

const RoomController = () => {
    const [isAddRoomVisible, setAddRoomVisible] = useState(false);

    const handleAddRoom = (newRoomData) => {
        console.log("New Room Added:", newRoomData);
        // TODO: Thêm logic để thêm phòng vào danh sách
        setAddRoomVisible(false);
    };
    return (
        <div className="px-3 py-3 room-page">
            <h4>Room Controller</h4>
            <div className="room-table p-3 shadow rounded">
                <div className="d-flex justify-content-between">
                    <div className="room-filter d-flex justify-content-start">
                        <button className="btn btn-filter shadow"><i className="fa-solid fa-filter"></i></button>
                        <input id="searchRoom" className="px-2 rounded ms-3 shadow search-input" type="text" placeholder="Search..." />
                        <button id="" className="btn btn-search shadow rounded ms-2">Seach</button>
                    </div>
                    <button id="addRoom" className="btn btn-add-room shadow rounded me-3 px-4" onClick={() => setAddRoomVisible(true)}>+ Add New Room</button>
                    {isAddRoomVisible && (
                        <AddRoomForm
                            onClose={() => setAddRoomVisible(false)}
                            onSubmit={handleAddRoom}
                        />
                    )}
                </div>
                <div className="p-3">
                    <RoomTable />
                </div>
            </div>
        </div>
    );
}
export default RoomController;