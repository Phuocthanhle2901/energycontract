package vn.infodation.intern.group1.mas.repository;

import vn.infodation.intern.group1.mas.domain.PlaceToPerform;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the PlaceToPerform entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlaceToPerformRepository extends JpaRepository<PlaceToPerform, Long> {
}
