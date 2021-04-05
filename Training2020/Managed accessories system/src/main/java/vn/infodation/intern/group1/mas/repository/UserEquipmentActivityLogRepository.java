package vn.infodation.intern.group1.mas.repository;

import vn.infodation.intern.group1.mas.domain.UserEquipmentActivityLog;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the UserEquipmentActivityLog entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserEquipmentActivityLogRepository extends JpaRepository<UserEquipmentActivityLog, Long> {
}
