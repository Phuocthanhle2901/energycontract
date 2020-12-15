package vn.infodation.intern.group1.mas.repository;

import vn.infodation.intern.group1.mas.domain.EquipmentGroup;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the EquipmentGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EquipmentGroupRepository extends JpaRepository<EquipmentGroup, Long> {
}
