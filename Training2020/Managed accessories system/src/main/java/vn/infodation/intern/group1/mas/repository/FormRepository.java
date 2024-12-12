package vn.infodation.intern.group1.mas.repository;

import vn.infodation.intern.group1.mas.domain.Employee;
import vn.infodation.intern.group1.mas.domain.Form;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Form entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FormRepository extends JpaRepository<Form, Long> {
    List<Form> findAllByEmployeeId(Long id);
}
