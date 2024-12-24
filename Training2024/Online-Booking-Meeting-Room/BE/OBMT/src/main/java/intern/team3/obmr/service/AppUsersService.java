package intern.team3.obmr.service;

import intern.team3.obmr.service.dto.AppUsersDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link intern.team3.obmr.domain.AppUsers}.
 */
public interface AppUsersService {
    /**
     * Save a appUsers.
     *
     * @param appUsersDTO the entity to save.
     * @return the persisted entity.
     */
    AppUsersDTO save(AppUsersDTO appUsersDTO);

    /**
     * Partially updates a appUsers.
     *
     * @param appUsersDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AppUsersDTO> partialUpdate(AppUsersDTO appUsersDTO);

    /**
     * Get all the appUsers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<AppUsersDTO> findAll(Pageable pageable);

    /**
     * Get all the appUsers with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<AppUsersDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" appUsers.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AppUsersDTO> findOne(Long id);

    /**
     * Delete the "id" appUsers.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
