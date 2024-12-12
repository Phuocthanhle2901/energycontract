package ivi.obmt.apiviewrooms.service;

import ivi.obmt.apiviewrooms.model.MeetingRoom;
import ivi.obmt.apiviewrooms.model.MeetingRoomRepository;
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
