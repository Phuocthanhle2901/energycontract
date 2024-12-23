package intern.team3.obmr.repository;

import intern.team3.obmr.model.EventMeeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventMeetingRepository extends JpaRepository<EventMeeting, Long> {

    @Query("SELECT e FROM EventMeeting e WHERE e.meetingRoomId = :meetingRoomId AND ((e.startTime < :endTime AND e.endTime > :startTime))")
    List<EventMeeting> findByMeetingRoomIdAndTimeRange(@Param("meetingRoomId") Long meetingRoomId,
                                                       @Param("startTime") LocalDateTime startTime,
                                                       @Param("endTime") LocalDateTime endTime);
}

