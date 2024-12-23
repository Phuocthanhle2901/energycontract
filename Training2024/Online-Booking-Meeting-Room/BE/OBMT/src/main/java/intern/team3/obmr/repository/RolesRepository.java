package intern.team3.obmr.repository;

import intern.team3.obmr.domain.Roles;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Roles entity.
 */
@Repository
public interface RolesRepository extends JpaRepository<Roles, Long> {
    @Query(
        value = "select distinct roles from Roles roles left join fetch roles.permissions",
        countQuery = "select count(distinct roles) from Roles roles"
    )
    Page<Roles> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct roles from Roles roles left join fetch roles.permissions")
    List<Roles> findAllWithEagerRelationships();

    @Query("select roles from Roles roles left join fetch roles.permissions where roles.id =:id")
    Optional<Roles> findOneWithEagerRelationships(@Param("id") Long id);
}
