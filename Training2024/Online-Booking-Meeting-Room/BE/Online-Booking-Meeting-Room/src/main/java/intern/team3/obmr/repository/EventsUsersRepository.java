package intern.team3.obmr.repository;

import intern.team3.obmr.model.EventsUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventsUsersRepository extends JpaRepository<EventsUsers, Long> {

}
