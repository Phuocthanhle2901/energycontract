package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.domain.EquipmentType;
import vn.infodation.intern.group1.mas.repository.EquipmentTypeRepository;
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
 * REST controller for managing {@link vn.infodation.intern.group1.mas.domain.EquipmentType}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EquipmentTypeResource {

    private final Logger log = LoggerFactory.getLogger(EquipmentTypeResource.class);

    private static final String ENTITY_NAME = "equipmentType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EquipmentTypeRepository equipmentTypeRepository;

    public EquipmentTypeResource(EquipmentTypeRepository equipmentTypeRepository) {
        this.equipmentTypeRepository = equipmentTypeRepository;
    }

    /**
     * {@code POST  /equipment-types} : Create a new equipmentType.
     *
     * @param equipmentType the equipmentType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new equipmentType, or with status {@code 400 (Bad Request)} if the equipmentType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/equipment-types")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<EquipmentType> createEquipmentType(@Valid @RequestBody EquipmentType equipmentType) throws URISyntaxException {
        log.debug("REST request to save EquipmentType : {}", equipmentType);
        if (equipmentType.getId() != null) {
            throw new BadRequestAlertException("A new equipmentType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EquipmentType result = equipmentTypeRepository.save(equipmentType);
        return ResponseEntity.created(new URI("/api/equipment-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /equipment-types} : Updates an existing equipmentType.
     *
     * @param equipmentType the equipmentType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated equipmentType,
     * or with status {@code 400 (Bad Request)} if the equipmentType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the equipmentType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/equipment-types")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<EquipmentType> updateEquipmentType(@Valid @RequestBody EquipmentType equipmentType) throws URISyntaxException {
        log.debug("REST request to update EquipmentType : {}", equipmentType);
        if (equipmentType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        EquipmentType result = equipmentTypeRepository.save(equipmentType);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, equipmentType.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /equipment-types} : get all the equipmentTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of equipmentTypes in body.
     */
    @GetMapping("/equipment-types")
    public List<EquipmentType> getAllEquipmentTypes() {
        log.debug("REST request to get all EquipmentTypes");
        return equipmentTypeRepository.findAll();
    }

    /**
     * {@code GET  /equipment-types/:id} : get the "id" equipmentType.
     *
     * @param id the id of the equipmentType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the equipmentType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/equipment-types/{id}")
    public ResponseEntity<EquipmentType> getEquipmentType(@PathVariable Long id) {
        log.debug("REST request to get EquipmentType : {}", id);
        Optional<EquipmentType> equipmentType = equipmentTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(equipmentType);
    }

    /**
     * {@code DELETE  /equipment-types/:id} : delete the "id" equipmentType.
     *
     * @param id the id of the equipmentType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/equipment-types/{id}")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteEquipmentType(@PathVariable Long id) {
        log.debug("REST request to delete EquipmentType : {}", id);
        equipmentTypeRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
