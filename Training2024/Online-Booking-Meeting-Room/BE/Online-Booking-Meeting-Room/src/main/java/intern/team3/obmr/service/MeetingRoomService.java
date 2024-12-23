package intern.team3.obmr.service;

import intern.team3.obmr.model.MeetingRoom;
import intern.team3.obmr.repository.MeetingRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class MeetingRoomService {
    private final MeetingRoomRepository meetingRoomRepository;

    @Autowired
    public MeetingRoomService(MeetingRoomRepository meetingRoomRepository) {
        this.meetingRoomRepository = meetingRoomRepository;
    }

    // Lấy tất cả phòng họp
    public List<MeetingRoom> getAllMeetingRooms() {
        List<MeetingRoom> rooms = meetingRoomRepository.findAll();
        return rooms;
    }

    // Thêm phòng họp mới
    public MeetingRoom addMeetingRoom(MeetingRoom meetingRoom) {
        meetingRoom.setCreatedAt(Instant.from(LocalDateTime.now()));
        meetingRoom.setUpdatedAt(Instant.from(LocalDateTime.now()));
        return meetingRoomRepository.save(meetingRoom);  // Gọi phương thức save từ repository
    }

    // Cập nhật phòng họp
    public MeetingRoom updateMeetingRoom(Long id, MeetingRoom meetingRoom) {
        Optional<MeetingRoom> existingRoom = meetingRoomRepository.findById(id);
        if (existingRoom.isPresent()) {
            MeetingRoom room = existingRoom.get();
            room.setName(meetingRoom.getName());
            room.setDescription(meetingRoom.getDescription());
            room.setCapacity(meetingRoom.getCapacity());
            room.setUpdatedAt(Instant.from(LocalDateTime.now()));
            return meetingRoomRepository.save(room);  // Gọi phương thức save từ repository
        } else {
            throw new RuntimeException("Meeting room does not exist!");
        }
    }

    // Xóa phòng họp
    public void deleteMeetingRoom(Long id) {
        meetingRoomRepository.deleteById(id);  // Gọi phương thức deleteById từ repository
    }

    // Lấy phòng họp theo ID
    public MeetingRoom getMeetingRoomById(Long id) {
        return meetingRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting room does not exist!"));  // Gọi phương thức findById từ repository
    }
}
