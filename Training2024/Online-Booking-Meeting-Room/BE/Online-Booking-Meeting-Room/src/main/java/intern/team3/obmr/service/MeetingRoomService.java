package intern.team3.obmr.service;

import intern.team3.obmr.model.MeetingRoom;
import intern.team3.obmr.repository.MeetingRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MeetingRoomService {
    @Autowired
    private MeetingRoomRepository meetingRoomRepository;

    public List<MeetingRoom> getAvailableMeetingRooms() {
        return meetingRoomRepository.findByIsAvailable(true);
    }
}
