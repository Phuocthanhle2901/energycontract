package vn.infodation.intern.group1.mas.repository;

import vn.infodation.intern.group1.mas.domain.Area;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Area entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {
}
