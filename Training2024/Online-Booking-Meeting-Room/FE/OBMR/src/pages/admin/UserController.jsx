import UserTable from "../../components/users_table/UsersTable";
import "../../styles/RoomController.css"

const UserController = () =>{
    return (
        <div className="px-3 py-3 room-page">
            <h4>User Controller</h4>
            <div className="room-table p-3 shadow rounded">
                <div className="room-filter d-flex justify-content-start">
                        <button className="btn btn-filter shadow"><i className="fa-solid fa-filter"></i></button>
                        <input className="px-2 rounded ms-3 shadow search-input" type="text" placeholder="Search..."/>
                        <button className="btn btn-search shadow rounded ms-2">Seach</button>
                </div>
                <div className="p-3">
                    <UserTable/>

                </div>
            </div>
        </div>
    );
}
export default UserController;