package intern.team3.obmr.controller;

import intern.team3.obmr.model.MeetingRoom;
import intern.team3.obmr.service.MeetingRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class ViewRoomsController {
    @Autowired
    private MeetingRoomService meetingRoomService;

    @GetMapping("/view")
    public String viewMeetingRooms(Model model) {
        List<MeetingRoom> rooms = meetingRoomService.getAllMeetingRooms();
        model.addAttribute("rooms", rooms);
        return "ViewRooms.html";
    }
}
