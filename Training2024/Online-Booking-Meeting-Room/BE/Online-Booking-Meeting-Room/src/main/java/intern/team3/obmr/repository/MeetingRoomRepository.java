package intern.team3.obmr.repository;

import intern.team3.obmr.model.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long> {
    List<MeetingRoom> findByIsAvailable(boolean isAvailable);
}