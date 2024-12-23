package intern.team3.obmr.repository;

import intern.team3.obmr.domain.EventUsers;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EventUsers entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventUsersRepository extends JpaRepository<EventUsers, Long> {}
