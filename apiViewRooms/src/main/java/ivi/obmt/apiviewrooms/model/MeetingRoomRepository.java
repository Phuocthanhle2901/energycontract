package ivi.obmt.apiviewrooms.model;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long> {
    List<MeetingRoom> findByIsAvailable(boolean isAvailable);
}