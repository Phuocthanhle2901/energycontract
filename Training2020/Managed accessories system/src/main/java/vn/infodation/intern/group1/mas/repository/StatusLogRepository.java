package vn.infodation.intern.group1.mas.repository;

import vn.infodation.intern.group1.mas.domain.StatusLog;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the StatusLog entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StatusLogRepository extends JpaRepository<StatusLog, Long> {
}
