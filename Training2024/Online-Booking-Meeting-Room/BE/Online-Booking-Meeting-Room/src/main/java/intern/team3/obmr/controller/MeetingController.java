package intern.team3.obmr.controller;

import intern.team3.obmr.model.EventMeeting;
import intern.team3.obmr.model.MeetingRoom;
import intern.team3.obmr.model.Users;
import intern.team3.obmr.repository.UsersRepository;
import intern.team3.obmr.service.MeetingRoomService;
import intern.team3.obmr.service.MeetingService;
import intern.team3.obmr.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("/meeting")
public class MeetingController {
    private final MeetingRoomService meetingRoomService;
    private final UsersService usersService;
    private final MeetingService meetingService;

    @Autowired
    public MeetingController(UsersService usersService, MeetingRoomService meetingRoomService, MeetingService meetingService) {
        this.usersService = usersService;
        this.meetingRoomService = meetingRoomService;
        this.meetingService = meetingService;
    }

    @GetMapping("/home")
    public String index() {
        return "index.html";
    }

    @GetMapping("/rooms")
    public String viewMeetingRooms(Model model) {
        List<MeetingRoom> rooms = meetingRoomService.getAllMeetingRooms();
        List<Users> users = usersService.getAllUsers();

        model.addAttribute("users", users);
        model.addAttribute("rooms", rooms);
        return "meetingRooms.html";
    }

    @PostMapping("/book")
    public String bookMeetingRoom(@RequestParam Long meetingRoomId,
                                  @RequestParam String title,
                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
                                  @RequestParam Long userId, Model model) {
        boolean success = meetingService.bookMeetingRoom(meetingRoomId, title, startTime, endTime, userId);
        if (success) {
            model.addAttribute("message", "Meeting room booked successfully.");
        } else {
            model.addAttribute("message", "Meeting room is unavailable during the selected time.");
        }
        return "redirect:/meeting/rooms";
    }

    @GetMapping("/calendar")
    public String viewMeetingCalendar(Model model) {
        List<EventMeeting> events = meetingService.getAllEvents();
        model.addAttribute("events", events);
        return "calendar.html";
    }
}
