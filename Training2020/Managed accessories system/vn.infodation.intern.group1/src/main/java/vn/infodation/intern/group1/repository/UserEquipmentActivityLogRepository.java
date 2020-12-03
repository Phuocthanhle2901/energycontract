package vn.infodation.intern.group1.repository;

import vn.infodation.intern.group1.domain.UserEquipmentActivityLog;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the UserEquipmentActivityLog entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserEquipmentActivityLogRepository extends JpaRepository<UserEquipmentActivityLog, Long> {
}
