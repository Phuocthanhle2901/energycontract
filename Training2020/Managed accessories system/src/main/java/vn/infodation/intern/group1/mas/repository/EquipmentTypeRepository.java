package vn.infodation.intern.group1.mas.repository;

import vn.infodation.intern.group1.mas.domain.EquipmentType;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the EquipmentType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EquipmentTypeRepository extends JpaRepository<EquipmentType, Long> {
}
