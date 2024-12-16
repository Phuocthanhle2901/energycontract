package intern.team3.obmr.service;

import intern.team3.obmr.model.MeetingRoom;
import intern.team3.obmr.repository.MeetingRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
public class MeetingRoomService {

    @Autowired
    private MeetingRoomRepository meetingRoomRepository;

    // Kiểm tra xem người dùng có phải là Admin không
    public boolean isAdmin(Principal principal) {
        String username = principal.getName();
        // Kiểm tra quyền trong cơ sở dữ liệu hoặc logic cụ thể
        return "admin".equals(username); // Giả sử tên người dùng là "admin" có quyền Admin
    }

    // Lấy danh sách tất cả các phòng họp
    public List<MeetingRoom> getAllMeetingRooms() {
        return meetingRoomRepository.findAll();
    }

    // Thêm phòng họp mới
    public MeetingRoom addMeetingRoom(MeetingRoom meetingRoom, Principal principal) {
        if (!isAdmin(principal)) {
            throw new SecurityException("Không có quyền thực hiện thao tác này");
        }
        return meetingRoomRepository.save(meetingRoom);
    }

    // Cập nhật phòng họp
    public MeetingRoom updateMeetingRoom(Long id, MeetingRoom meetingRoom, Principal principal) {
        if (!isAdmin(principal)) {
            throw new SecurityException("Không có quyền thực hiện thao tác này");
        }
        // Logic cập nhật
        if (meetingRoomRepository.existsById(id)) {
            meetingRoom.setId(id);
            return meetingRoomRepository.save(meetingRoom);
        }
        return null;
    }

    // Xóa phòng họp
    public boolean deleteMeetingRoom(Long id, Principal principal) {
        if (!isAdmin(principal)) {
            throw new SecurityException("Không có quyền thực hiện thao tác này");
        }
        if (meetingRoomRepository.existsById(id)) {
            meetingRoomRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
