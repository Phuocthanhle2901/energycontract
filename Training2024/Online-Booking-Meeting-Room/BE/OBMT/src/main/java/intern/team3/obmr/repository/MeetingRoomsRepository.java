package intern.team3.obmr.repository;

import intern.team3.obmr.domain.MeetingRooms;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the MeetingRooms entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MeetingRoomsRepository extends JpaRepository<MeetingRooms, Long> {}
