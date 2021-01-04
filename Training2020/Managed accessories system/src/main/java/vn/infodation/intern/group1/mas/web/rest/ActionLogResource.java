package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.domain.ActionLog;
import vn.infodation.intern.group1.mas.repository.ActionLogRepository;
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
 * REST controller for managing {@link vn.infodation.intern.group1.mas.domain.ActionLog}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActionLogResource {

    private final Logger log = LoggerFactory.getLogger(ActionLogResource.class);

    private static final String ENTITY_NAME = "actionLog";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActionLogRepository actionLogRepository;

    public ActionLogResource(ActionLogRepository actionLogRepository) {
        this.actionLogRepository = actionLogRepository;
    }

    /**
     * {@code POST  /action-logs} : Create a new actionLog.
     *
     * @param actionLog the actionLog to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new actionLog, or with status {@code 400 (Bad Request)} if the actionLog has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/action-logs")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<ActionLog> createActionLog(@Valid @RequestBody ActionLog actionLog) throws URISyntaxException {
        log.debug("REST request to save ActionLog : {}", actionLog);
        if (actionLog.getId() != null) {
            throw new BadRequestAlertException("A new actionLog cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ActionLog result = actionLogRepository.save(actionLog);
        return ResponseEntity.created(new URI("/api/action-logs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /action-logs} : Updates an existing actionLog.
     *
     * @param actionLog the actionLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actionLog,
     * or with status {@code 400 (Bad Request)} if the actionLog is not valid,
     * or with status {@code 500 (Internal Server Error)} if the actionLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/action-logs")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<ActionLog> updateActionLog(@Valid @RequestBody ActionLog actionLog) throws URISyntaxException {
        log.debug("REST request to update ActionLog : {}", actionLog);
        if (actionLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ActionLog result = actionLogRepository.save(actionLog);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, actionLog.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /action-logs} : get all the actionLogs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of actionLogs in body.
     */
    @GetMapping("/action-logs")
    public List<ActionLog> getAllActionLogs() {
        log.debug("REST request to get all ActionLogs");
        return actionLogRepository.findAll();
    }

    /**
     * {@code GET  /action-logs/:id} : get the "id" actionLog.
     *
     * @param id the id of the actionLog to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the actionLog, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/action-logs/{id}")
    public ResponseEntity<ActionLog> getActionLog(@PathVariable Long id) {
        log.debug("REST request to get ActionLog : {}", id);
        Optional<ActionLog> actionLog = actionLogRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(actionLog);
    }

    /**
     * {@code DELETE  /action-logs/:id} : delete the "id" actionLog.
     *
     * @param id the id of the actionLog to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/action-logs/{id}")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteActionLog(@PathVariable Long id) {
        log.debug("REST request to delete ActionLog : {}", id);
        actionLogRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
