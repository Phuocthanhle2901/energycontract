package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.domain.Equipment;
import vn.infodation.intern.group1.mas.repository.EquipmentRepository;
import vn.infodation.intern.group1.mas.security.AuthoritiesConstants;
import vn.infodation.intern.group1.mas.service.SaveFileService;
import vn.infodation.intern.group1.mas.web.rest.errors.BadRequestAlertException;
import vn.infodation.intern.group1.mas.web.rest.errors.EquipmentNotFoundException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link vn.infodation.intern.group1.mas.domain.Equipment}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EquipmentResource {
	
	private final SaveFileService fileService;

    private final Logger log = LoggerFactory.getLogger(EquipmentResource.class);

    private static final String ENTITY_NAME = "equipment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EquipmentRepository equipmentRepository;

    public EquipmentResource(EquipmentRepository equipmentRepository,
    		                             SaveFileService fileService) {
        this.equipmentRepository = equipmentRepository;
        this.fileService = fileService;
    }

    /**
     * {@code POST  /equipment} : Create a new equipment.
     *
     * @param equipment the equipment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new equipment, or with status {@code 400 (Bad Request)} if the equipment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/equipment")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Equipment> createEquipment(@Valid @RequestBody Equipment equipment) throws URISyntaxException {
        log.debug("REST request to save Equipment : {}", equipment);
        if (equipment.getId() != null) {
            throw new BadRequestAlertException("A new equipment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Equipment result = equipmentRepository.save(equipment);
        return ResponseEntity.created(new URI("/api/equipment/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /equipment} : Updates an existing equipment.
     *
     * @param equipment the equipment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated equipment,
     * or with status {@code 400 (Bad Request)} if the equipment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the equipment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/equipment")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Equipment> updateEquipment(@Valid @RequestBody Equipment equipment) throws URISyntaxException {
        log.debug("REST request to update Equipment : {}", equipment);
        if (equipment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Equipment result = equipmentRepository.save(equipment);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, equipment.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /equipment} : get all the equipment.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of equipment in body.
     */
    @GetMapping("/equipment")
    public List<Equipment> getAllEquipment() {
        log.debug("REST request to get all Equipment");
        return equipmentRepository.findAll();
    }

    /**
     * {@code GET  /equipment/:id} : get the "id" equipment.
     *
     * @param id the id of the equipment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the equipment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/equipment/{id}")
    public ResponseEntity<Equipment> getEquipment(@PathVariable Long id) {
        log.debug("REST request to get Equipment : {}", id);
        Optional<Equipment> equipment = equipmentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(equipment);
    }

    /**
     * {@code DELETE  /equipment/:id} : delete the "id" equipment.
     *
     * @param id the id of the equipment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/equipment/{id}")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id) {
        log.debug("REST request to delete Equipment : {}", id);
        Equipment equipment = equipmentRepository.findById(id).orElseThrow();
        if(equipment.getActionLogs().size() > 0 ||
        		equipment.getStatusLogs().size() > 0 ||
        		equipment.getUserEquipmentActivityLogs().size() > 0) {
        	return ResponseEntity.noContent().headers(HeaderUtil.createAlert(applicationName, "Cannot delete equipment", null)).build();
        }
        equipmentRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
    
    @GetMapping(value = "/equipment-export/{id}", produces = "text/csv; charset=utf-8")
    @ResponseStatus(HttpStatus.OK)
    public Resource exportEquipment(@PathVariable Long id, HttpServletResponse response){
        Equipment equipment = equipmentRepository.findById(id).orElseThrow(EquipmentNotFoundException::new);
        fileService.writeFile(equipment);

        return fileService.getEquipmentFile(equipment.getId() + ".csv", response);
    }

    @GetMapping(value = "/equipment-export", produces = "text/csv; charset=utf-8")
    @ResponseStatus(HttpStatus.OK)
    public Resource exportAllEquipment(HttpServletResponse response){
        fileService.writeFile();

        return fileService.getEquipmentFile("equipments.csv", response);
    }

    @PostMapping("/equipment-import")
    public void importAllEquipment(@RequestParam("file") MultipartFile file){
        fileService.handleEquipmentFile(file);
    }

}
