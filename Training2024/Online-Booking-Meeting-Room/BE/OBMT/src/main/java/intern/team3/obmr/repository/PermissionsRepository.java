package intern.team3.obmr.repository;

import intern.team3.obmr.domain.Permissions;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Permissions entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PermissionsRepository extends JpaRepository<Permissions, Long> {}
