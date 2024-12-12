package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.domain.EquipmentGroup;
import vn.infodation.intern.group1.mas.repository.EquipmentGroupRepository;
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
 * REST controller for managing {@link vn.infodation.intern.group1.mas.domain.EquipmentGroup}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EquipmentGroupResource {

    private final Logger log = LoggerFactory.getLogger(EquipmentGroupResource.class);

    private static final String ENTITY_NAME = "equipmentGroup";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EquipmentGroupRepository equipmentGroupRepository;

    public EquipmentGroupResource(EquipmentGroupRepository equipmentGroupRepository) {
        this.equipmentGroupRepository = equipmentGroupRepository;
    }

    /**
     * {@code POST  /equipment-groups} : Create a new equipmentGroup.
     *
     * @param equipmentGroup the equipmentGroup to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new equipmentGroup, or with status {@code 400 (Bad Request)} if the equipmentGroup has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/equipment-groups")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<EquipmentGroup> createEquipmentGroup(@Valid @RequestBody EquipmentGroup equipmentGroup) throws URISyntaxException {
        log.debug("REST request to save EquipmentGroup : {}", equipmentGroup);
        if (equipmentGroup.getId() != null) {
            throw new BadRequestAlertException("A new equipmentGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EquipmentGroup result = equipmentGroupRepository.save(equipmentGroup);
        return ResponseEntity.created(new URI("/api/equipment-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /equipment-groups} : Updates an existing equipmentGroup.
     *
     * @param equipmentGroup the equipmentGroup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated equipmentGroup,
     * or with status {@code 400 (Bad Request)} if the equipmentGroup is not valid,
     * or with status {@code 500 (Internal Server Error)} if the equipmentGroup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/equipment-groups")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<EquipmentGroup> updateEquipmentGroup(@Valid @RequestBody EquipmentGroup equipmentGroup) throws URISyntaxException {
        log.debug("REST request to update EquipmentGroup : {}", equipmentGroup);
        if (equipmentGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        EquipmentGroup result = equipmentGroupRepository.save(equipmentGroup);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, equipmentGroup.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /equipment-groups} : get all the equipmentGroups.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of equipmentGroups in body.
     */
    @GetMapping("/equipment-groups")
    public List<EquipmentGroup> getAllEquipmentGroups() {
        log.debug("REST request to get all EquipmentGroups");
        return equipmentGroupRepository.findAll();
    }

    /**
     * {@code GET  /equipment-groups/:id} : get the "id" equipmentGroup.
     *
     * @param id the id of the equipmentGroup to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the equipmentGroup, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/equipment-groups/{id}")
    public ResponseEntity<EquipmentGroup> getEquipmentGroup(@PathVariable Long id) {
        log.debug("REST request to get EquipmentGroup : {}", id);
        Optional<EquipmentGroup> equipmentGroup = equipmentGroupRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(equipmentGroup);
    }

    /**
     * {@code DELETE  /equipment-groups/:id} : delete the "id" equipmentGroup.
     *
     * @param id the id of the equipmentGroup to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/equipment-groups/{id}")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteEquipmentGroup(@PathVariable Long id) {
        log.debug("REST request to delete EquipmentGroup : {}", id);
        equipmentGroupRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
