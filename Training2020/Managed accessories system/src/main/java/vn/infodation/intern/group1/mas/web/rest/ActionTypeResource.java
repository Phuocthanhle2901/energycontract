package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.domain.ActionType;
import vn.infodation.intern.group1.mas.repository.ActionTypeRepository;
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
 * REST controller for managing {@link vn.infodation.intern.group1.mas.domain.ActionType}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActionTypeResource {

    private final Logger log = LoggerFactory.getLogger(ActionTypeResource.class);

    private static final String ENTITY_NAME = "actionType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActionTypeRepository actionTypeRepository;

    public ActionTypeResource(ActionTypeRepository actionTypeRepository) {
        this.actionTypeRepository = actionTypeRepository;
    }

    /**
     * {@code POST  /action-types} : Create a new actionType.
     *
     * @param actionType the actionType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new actionType, or with status {@code 400 (Bad Request)} if the actionType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/action-types")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<ActionType> createActionType(@Valid @RequestBody ActionType actionType) throws URISyntaxException {
        log.debug("REST request to save ActionType : {}", actionType);
        if (actionType.getId() != null) {
            throw new BadRequestAlertException("A new actionType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ActionType result = actionTypeRepository.save(actionType);
        return ResponseEntity.created(new URI("/api/action-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /action-types} : Updates an existing actionType.
     *
     * @param actionType the actionType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actionType,
     * or with status {@code 400 (Bad Request)} if the actionType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the actionType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/action-types")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<ActionType> updateActionType(@Valid @RequestBody ActionType actionType) throws URISyntaxException {
        log.debug("REST request to update ActionType : {}", actionType);
        if (actionType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ActionType result = actionTypeRepository.save(actionType);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, actionType.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /action-types} : get all the actionTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of actionTypes in body.
     */
    @GetMapping("/action-types")
    public List<ActionType> getAllActionTypes() {
        log.debug("REST request to get all ActionTypes");
        return actionTypeRepository.findAll();
    }

    /**
     * {@code GET  /action-types/:id} : get the "id" actionType.
     *
     * @param id the id of the actionType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the actionType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/action-types/{id}")
    public ResponseEntity<ActionType> getActionType(@PathVariable Long id) {
        log.debug("REST request to get ActionType : {}", id);
        Optional<ActionType> actionType = actionTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(actionType);
    }

    /**
     * {@code DELETE  /action-types/:id} : delete the "id" actionType.
     *
     * @param id the id of the actionType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/action-types/{id}")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteActionType(@PathVariable Long id) {
        log.debug("REST request to delete ActionType : {}", id);
        actionTypeRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
