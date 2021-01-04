package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.domain.StatusLog;
import vn.infodation.intern.group1.mas.repository.StatusLogRepository;
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
 * REST controller for managing {@link vn.infodation.intern.group1.mas.domain.StatusLog}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StatusLogResource {

    private final Logger log = LoggerFactory.getLogger(StatusLogResource.class);

    private static final String ENTITY_NAME = "statusLog";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StatusLogRepository statusLogRepository;

    public StatusLogResource(StatusLogRepository statusLogRepository) {
        this.statusLogRepository = statusLogRepository;
    }

    /**
     * {@code POST  /status-logs} : Create a new statusLog.
     *
     * @param statusLog the statusLog to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new statusLog, or with status {@code 400 (Bad Request)} if the statusLog has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/status-logs")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<StatusLog> createStatusLog(@Valid @RequestBody StatusLog statusLog) throws URISyntaxException {
        log.debug("REST request to save StatusLog : {}", statusLog);
        if (statusLog.getId() != null) {
            throw new BadRequestAlertException("A new statusLog cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StatusLog result = statusLogRepository.save(statusLog);
        return ResponseEntity.created(new URI("/api/status-logs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /status-logs} : Updates an existing statusLog.
     *
     * @param statusLog the statusLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated statusLog,
     * or with status {@code 400 (Bad Request)} if the statusLog is not valid,
     * or with status {@code 500 (Internal Server Error)} if the statusLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/status-logs")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<StatusLog> updateStatusLog(@Valid @RequestBody StatusLog statusLog) throws URISyntaxException {
        log.debug("REST request to update StatusLog : {}", statusLog);
        if (statusLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        StatusLog result = statusLogRepository.save(statusLog);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, statusLog.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /status-logs} : get all the statusLogs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of statusLogs in body.
     */
    @GetMapping("/status-logs")
    public List<StatusLog> getAllStatusLogs() {
        log.debug("REST request to get all StatusLogs");
        return statusLogRepository.findAll();
    }

    /**
     * {@code GET  /status-logs/:id} : get the "id" statusLog.
     *
     * @param id the id of the statusLog to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the statusLog, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/status-logs/{id}")
    public ResponseEntity<StatusLog> getStatusLog(@PathVariable Long id) {
        log.debug("REST request to get StatusLog : {}", id);
        Optional<StatusLog> statusLog = statusLogRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(statusLog);
    }

    /**
     * {@code DELETE  /status-logs/:id} : delete the "id" statusLog.
     *
     * @param id the id of the statusLog to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/status-logs/{id}")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteStatusLog(@PathVariable Long id) {
        log.debug("REST request to delete StatusLog : {}", id);
        statusLogRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
