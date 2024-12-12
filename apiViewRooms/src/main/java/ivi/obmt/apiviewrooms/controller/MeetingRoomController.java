package ivi.obmt.apiviewrooms.controller;

import ivi.obmt.apiviewrooms.model.MeetingRoom;
import ivi.obmt.apiviewrooms.service.MeetingRoomService;
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
