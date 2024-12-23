package intern.team3.obmr.service;

import intern.team3.obmr.service.dto.MeetingRoomsDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link intern.team3.obmr.domain.MeetingRooms}.
 */
public interface MeetingRoomsService {
    /**
     * Save a meetingRooms.
     *
     * @param meetingRoomsDTO the entity to save.
     * @return the persisted entity.
     */
    MeetingRoomsDTO save(MeetingRoomsDTO meetingRoomsDTO);

    /**
     * Partially updates a meetingRooms.
     *
     * @param meetingRoomsDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<MeetingRoomsDTO> partialUpdate(MeetingRoomsDTO meetingRoomsDTO);

    /**
     * Get all the meetingRooms.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<MeetingRoomsDTO> findAll(Pageable pageable);

    /**
     * Get the "id" meetingRooms.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<MeetingRoomsDTO> findOne(Long id);

    /**
     * Delete the "id" meetingRooms.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
