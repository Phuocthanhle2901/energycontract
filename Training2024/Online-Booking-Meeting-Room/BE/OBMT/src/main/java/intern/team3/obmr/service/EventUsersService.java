package intern.team3.obmr.service;

import intern.team3.obmr.service.dto.EventUsersDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link intern.team3.obmr.domain.EventUsers}.
 */
public interface EventUsersService {
    /**
     * Save a eventUsers.
     *
     * @param eventUsersDTO the entity to save.
     * @return the persisted entity.
     */
    EventUsersDTO save(EventUsersDTO eventUsersDTO);

    /**
     * Partially updates a eventUsers.
     *
     * @param eventUsersDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EventUsersDTO> partialUpdate(EventUsersDTO eventUsersDTO);

    /**
     * Get all the eventUsers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EventUsersDTO> findAll(Pageable pageable);

    /**
     * Get the "id" eventUsers.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EventUsersDTO> findOne(Long id);

    /**
     * Delete the "id" eventUsers.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
