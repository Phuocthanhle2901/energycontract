package intern.team3.obmr.service;

import intern.team3.obmr.service.dto.PermissionsDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link intern.team3.obmr.domain.Permissions}.
 */
public interface PermissionsService {
    /**
     * Save a permissions.
     *
     * @param permissionsDTO the entity to save.
     * @return the persisted entity.
     */
    PermissionsDTO save(PermissionsDTO permissionsDTO);

    /**
     * Partially updates a permissions.
     *
     * @param permissionsDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<PermissionsDTO> partialUpdate(PermissionsDTO permissionsDTO);

    /**
     * Get all the permissions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<PermissionsDTO> findAll(Pageable pageable);

    /**
     * Get the "id" permissions.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PermissionsDTO> findOne(Long id);

    /**
     * Delete the "id" permissions.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
