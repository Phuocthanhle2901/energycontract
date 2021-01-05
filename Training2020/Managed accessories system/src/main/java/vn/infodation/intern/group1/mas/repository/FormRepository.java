package vn.infodation.intern.group1.mas.repository;

import vn.infodation.intern.group1.mas.domain.Form;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Form entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FormRepository extends JpaRepository<Form, Long> {
}
