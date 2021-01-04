package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.domain.UserEquipmentActivityLog;
import vn.infodation.intern.group1.mas.repository.UserEquipmentActivityLogRepository;
import vn.infodation.intern.group1.mas.security.AuthoritiesConstants;
import vn.infodation.intern.group1.mas.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link vn.infodation.intern.group1.mas.domain.UserEquipmentActivityLog}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserEquipmentActivityLogResource {

    private final Logger log = LoggerFactory.getLogger(UserEquipmentActivityLogResource.class);

    private static final String ENTITY_NAME = "userEquipmentActivityLog";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserEquipmentActivityLogRepository userEquipmentActivityLogRepository;

    public UserEquipmentActivityLogResource(UserEquipmentActivityLogRepository userEquipmentActivityLogRepository) {
        this.userEquipmentActivityLogRepository = userEquipmentActivityLogRepository;
    }

    /**
     * {@code POST  /user-equipment-activity-logs} : Create a new userEquipmentActivityLog.
     *
     * @param userEquipmentActivityLog the userEquipmentActivityLog to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userEquipmentActivityLog, or with status {@code 400 (Bad Request)} if the userEquipmentActivityLog has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-equipment-activity-logs")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<UserEquipmentActivityLog> createUserEquipmentActivityLog(@Valid @RequestBody UserEquipmentActivityLog userEquipmentActivityLog) throws URISyntaxException {
        log.debug("REST request to save UserEquipmentActivityLog : {}", userEquipmentActivityLog);
        if (userEquipmentActivityLog.getId() != null) {
            throw new BadRequestAlertException("A new userEquipmentActivityLog cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserEquipmentActivityLog result = userEquipmentActivityLogRepository.save(userEquipmentActivityLog);
        return ResponseEntity.created(new URI("/api/user-equipment-activity-logs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-equipment-activity-logs} : Updates an existing userEquipmentActivityLog.
     *
     * @param userEquipmentActivityLog the userEquipmentActivityLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userEquipmentActivityLog,
     * or with status {@code 400 (Bad Request)} if the userEquipmentActivityLog is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userEquipmentActivityLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-equipment-activity-logs")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<UserEquipmentActivityLog> updateUserEquipmentActivityLog(@Valid @RequestBody UserEquipmentActivityLog userEquipmentActivityLog) throws URISyntaxException {
        log.debug("REST request to update UserEquipmentActivityLog : {}", userEquipmentActivityLog);
        if (userEquipmentActivityLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UserEquipmentActivityLog result = userEquipmentActivityLogRepository.save(userEquipmentActivityLog);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userEquipmentActivityLog.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /user-equipment-activity-logs} : get all the userEquipmentActivityLogs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userEquipmentActivityLogs in body.
     */
    @GetMapping("/user-equipment-activity-logs")
    public List<UserEquipmentActivityLog> getAllUserEquipmentActivityLogs() {
        log.debug("REST request to get all UserEquipmentActivityLogs");
        return userEquipmentActivityLogRepository.findAll();
    }

    /**
     * {@code GET  /user-equipment-activity-logs/:id} : get the "id" userEquipmentActivityLog.
     *
     * @param id the id of the userEquipmentActivityLog to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userEquipmentActivityLog, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-equipment-activity-logs/{id}")
    public ResponseEntity<UserEquipmentActivityLog> getUserEquipmentActivityLog(@PathVariable Long id) {
        log.debug("REST request to get UserEquipmentActivityLog : {}", id);
        Optional<UserEquipmentActivityLog> userEquipmentActivityLog = userEquipmentActivityLogRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userEquipmentActivityLog);
    }

    /**
     * {@code DELETE  /user-equipment-activity-logs/:id} : delete the "id" userEquipmentActivityLog.
     *
     * @param id the id of the userEquipmentActivityLog to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-equipment-activity-logs/{id}")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteUserEquipmentActivityLog(@PathVariable Long id) {
        log.debug("REST request to delete UserEquipmentActivityLog : {}", id);
        userEquipmentActivityLogRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
