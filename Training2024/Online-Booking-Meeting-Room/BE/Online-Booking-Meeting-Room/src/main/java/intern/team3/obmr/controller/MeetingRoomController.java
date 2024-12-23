package intern.team3.obmr.controller;

import intern.team3.obmr.model.MeetingRoom;
import intern.team3.obmr.service.MeetingRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meeting-rooms")
public class MeetingRoomController {

    @Autowired
    private MeetingRoomService meetingRoomService;

    // API lấy tất cả phòng họp
    @GetMapping
    public List<MeetingRoom> getAllMeetingRooms() {
        return meetingRoomService.getAllMeetingRooms();
    }

    // API lấy phòng họp theo ID
    @GetMapping("/{id}")
    public ResponseEntity<MeetingRoom> getMeetingRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(meetingRoomService.getMeetingRoomById(id));
    }

    // API tạo phòng họp mới
    @PostMapping
    public ResponseEntity<MeetingRoom> addMeetingRoom(@RequestBody MeetingRoom meetingRoom) {
        return ResponseEntity.ok(meetingRoomService.addMeetingRoom(meetingRoom));
    }

    // API cập nhật phòng họp
    @PutMapping("/{id}")
    public ResponseEntity<MeetingRoom> updateMeetingRoom(@PathVariable Long id, @RequestBody MeetingRoom meetingRoom) {
        return ResponseEntity.ok(meetingRoomService.updateMeetingRoom(id, meetingRoom));
    }

    // API xóa phòng họp
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeetingRoom(@PathVariable Long id) {
        meetingRoomService.deleteMeetingRoom(id);
        return ResponseEntity.noContent().build();
    }
}
