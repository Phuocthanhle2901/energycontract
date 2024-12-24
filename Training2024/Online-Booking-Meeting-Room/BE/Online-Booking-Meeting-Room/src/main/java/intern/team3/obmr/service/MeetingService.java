package intern.team3.obmr.service;

import intern.team3.obmr.model.*;
import intern.team3.obmr.repository.EventMeetingRepository;
import intern.team3.obmr.repository.MeetingRoomRepository;
import intern.team3.obmr.repository.EventsUsersRepository;
import intern.team3.obmr.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MeetingService {
    private final MeetingRoomRepository meetingRoomRepository;
    private final EventMeetingRepository eventMeetingRepository;
    private final EventsUsersRepository eventsUsersRepository;
    private final UsersRepository usersRepository;

    @Autowired
    public MeetingService(MeetingRoomRepository meetingRoomRepository, EventMeetingRepository eventMeetingRepository, EventsUsersRepository eventsUsersRepository, UsersRepository usersRepository) {
        this.meetingRoomRepository = meetingRoomRepository;
        this.eventMeetingRepository = eventMeetingRepository;
        this.eventsUsersRepository = eventsUsersRepository;
        this.usersRepository = usersRepository;
    }

    public List<MeetingRoom> getAllMeetingRooms() {
        return meetingRoomRepository.findAll();
    }

    public boolean bookMeetingRoom(Long meetingRoomId, String title, LocalDateTime startTime, LocalDateTime endTime, Long userId) {
        // Check for existing meetings in the same room during the time range
        List<EventMeeting> existingMeetings = eventMeetingRepository.findByMeetingRoomIdAndTimeRange(meetingRoomId, startTime, endTime);
        if (!existingMeetings.isEmpty()) {
            return false;
        }

        // Create a new EventMeeting
        EventMeeting newMeeting = new EventMeeting();
        MeetingRoom meetingRoom = meetingRoomRepository.findById(meetingRoomId)
                .orElseThrow(() -> new IllegalArgumentException("Meeting room not found"));
        newMeeting.setMeetingRoomId(meetingRoom); // Use the MeetingRoom object
        newMeeting.setTitle(title);
        newMeeting.setStartTime(Instant.from(startTime));
        newMeeting.setEndTime(Instant.from(endTime));
        newMeeting.setStatus(MeetingStatus.WAITING);
        newMeeting.setCreatedAt(Instant.from(LocalDateTime.now()));
        newMeeting.setUpdatedAt(Instant.from(LocalDateTime.now()));
        newMeeting = eventMeetingRepository.save(newMeeting); // Save and retrieve the persisted object

        // Create a new EventsUsers entry for the organizer
        EventsUsers organizer = new EventsUsers();
        organizer.setEventMeeting(newMeeting); // Set the entire EventMeeting object
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        organizer.setMember(user); // Use the Users object
        organizer.setOrganizer(true);
        eventsUsersRepository.save(organizer);

        return true;
    }


    public List<EventMeeting> getAllEvents() {
        return eventMeetingRepository.findAll();
    }
}
