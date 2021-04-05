package vn.infodation.intern.group1.mas.repository;

import vn.infodation.intern.group1.mas.domain.FormType;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the FormType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FormTypeRepository extends JpaRepository<FormType, Long> {
}
