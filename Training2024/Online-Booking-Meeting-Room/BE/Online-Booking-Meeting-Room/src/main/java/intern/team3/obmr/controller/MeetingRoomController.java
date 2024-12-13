package intern.team3.obmr.controller;

import intern.team3.obmr.model.MeetingRoom;
import intern.team3.obmr.service.MeetingRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MeetingRoomController {
    @Autowired
    private MeetingRoomService meetingRoomService;

    @GetMapping("/meeting-rooms")
    public ResponseEntity<List<MeetingRoom>> getAvailableMeetingRooms() {
        List<MeetingRoom> availableRooms = meetingRoomService.getAvailableMeetingRooms();
        return new ResponseEntity<>(availableRooms, HttpStatus.OK);
    }
}
