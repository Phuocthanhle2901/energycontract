package vn.infodation.intern.group1.repository;

import vn.infodation.intern.group1.domain.Equipment;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Equipment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
}
