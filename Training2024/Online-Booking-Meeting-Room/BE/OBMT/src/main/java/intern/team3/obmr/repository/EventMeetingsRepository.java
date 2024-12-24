package intern.team3.obmr.repository;

import intern.team3.obmr.domain.EventMeetings;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EventMeetings entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventMeetingsRepository extends JpaRepository<EventMeetings, Long> {}
