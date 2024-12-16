package intern.team3.obmr.controller;

import intern.team3.obmr.model.MeetingRoom;
import intern.team3.obmr.service.MeetingRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/meetingrooms")
public class MeetingRoomController {

    @Autowired
    private MeetingRoomService meetingRoomService;

    // Endpoint để lấy danh sách tất cả phòng họp
    @GetMapping
    public ResponseEntity<List<MeetingRoom>> getAllMeetingRooms() {
        List<MeetingRoom> rooms = meetingRoomService.getAllMeetingRooms();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    // Thêm phòng họp mới (chỉ Admin mới có quyền)
    @PostMapping
    public ResponseEntity<MeetingRoom> addMeetingRoom(@RequestBody MeetingRoom meetingRoom, Principal principal) {
        if (!meetingRoomService.isAdmin(principal)) {
            // Trả về một ResponseEntity với mã lỗi 403 (Forbidden)
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        MeetingRoom savedRoom = meetingRoomService.addMeetingRoom(meetingRoom, principal);
        return new ResponseEntity<>(savedRoom, HttpStatus.CREATED);
    }

    // Cập nhật phòng họp (chỉ Admin mới có quyền)
    @PutMapping("/{id}")
    public ResponseEntity<MeetingRoom> updateMeetingRoom(@PathVariable Long id, @RequestBody MeetingRoom meetingRoom, Principal principal) {
        if (!meetingRoomService.isAdmin(principal)) {
            // Trả về một ResponseEntity với mã lỗi 403 (Forbidden)
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        MeetingRoom updatedRoom = meetingRoomService.updateMeetingRoom(id, meetingRoom, principal);
        if (updatedRoom == null) {
            // Trả về mã lỗi 404 nếu phòng họp không tồn tại
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
    }

    // Xóa phòng họp (chỉ Admin mới có quyền)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMeetingRoom(@PathVariable Long id, Principal principal) {
        if (!meetingRoomService.isAdmin(principal)) {
            // Trả về một ResponseEntity với mã lỗi 403 (Forbidden)
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        boolean deleted = meetingRoomService.deleteMeetingRoom(id, principal);
        if (!deleted) {
            // Trả về mã lỗi 404 nếu phòng họp không tồn tại
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Phòng họp đã bị xóa", HttpStatus.NO_CONTENT);
    }
}
