package intern.team3.obmr.repository;

import intern.team3.obmr.domain.AppUsers;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AppUsers entity.
 */
@Repository
public interface AppUsersRepository extends JpaRepository<AppUsers, Long> {
    @Query(
        value = "select distinct appUsers from AppUsers appUsers left join fetch appUsers.roles left join fetch appUsers.events",
        countQuery = "select count(distinct appUsers) from AppUsers appUsers"
    )
    Page<AppUsers> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct appUsers from AppUsers appUsers left join fetch appUsers.roles left join fetch appUsers.events")
    List<AppUsers> findAllWithEagerRelationships();

    @Query("select appUsers from AppUsers appUsers left join fetch appUsers.roles left join fetch appUsers.events where appUsers.id =:id")
    Optional<AppUsers> findOneWithEagerRelationships(@Param("id") Long id);
}
