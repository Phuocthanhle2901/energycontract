package vn.infodation.intern.group1.mas.repository;

import vn.infodation.intern.group1.mas.domain.Employee;

import java.util.Optional;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import vn.infodation.intern.group1.mas.domain.User;

/**
 * Spring Data  repository for the Employee entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
	Optional<Employee> findOneById(Long id);

	Optional<Employee> findOneByUser(User user);
}
