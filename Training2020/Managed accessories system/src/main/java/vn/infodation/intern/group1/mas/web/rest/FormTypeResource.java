package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.domain.FormType;
import vn.infodation.intern.group1.mas.repository.FormTypeRepository;
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
 * REST controller for managing {@link vn.infodation.intern.group1.mas.domain.FormType}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FormTypeResource {

    private final Logger log = LoggerFactory.getLogger(FormTypeResource.class);

    private static final String ENTITY_NAME = "formType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormTypeRepository formTypeRepository;

    public FormTypeResource(FormTypeRepository formTypeRepository) {
        this.formTypeRepository = formTypeRepository;
    }

    /**
     * {@code POST  /form-types} : Create a new formType.
     *
     * @param formType the formType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new formType, or with status {@code 400 (Bad Request)} if the formType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/form-types")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<FormType> createFormType(@Valid @RequestBody FormType formType) throws URISyntaxException {
        log.debug("REST request to save FormType : {}", formType);
        if (formType.getId() != null) {
            throw new BadRequestAlertException("A new formType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FormType result = formTypeRepository.save(formType);
        return ResponseEntity.created(new URI("/api/form-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /form-types} : Updates an existing formType.
     *
     * @param formType the formType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formType,
     * or with status {@code 400 (Bad Request)} if the formType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the formType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/form-types")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<FormType> updateFormType(@Valid @RequestBody FormType formType) throws URISyntaxException {
        log.debug("REST request to update FormType : {}", formType);
        if (formType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        FormType result = formTypeRepository.save(formType);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formType.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /form-types} : get all the formTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of formTypes in body.
     */
    @GetMapping("/form-types")
    public List<FormType> getAllFormTypes() {
        log.debug("REST request to get all FormTypes");
        return formTypeRepository.findAll();
    }

    /**
     * {@code GET  /form-types/:id} : get the "id" formType.
     *
     * @param id the id of the formType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the formType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/form-types/{id}")
    public ResponseEntity<FormType> getFormType(@PathVariable Long id) {
        log.debug("REST request to get FormType : {}", id);
        Optional<FormType> formType = formTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(formType);
    }

    /**
     * {@code DELETE  /form-types/:id} : delete the "id" formType.
     *
     * @param id the id of the formType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/form-types/{id}")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteFormType(@PathVariable Long id) {
        log.debug("REST request to delete FormType : {}", id);
        formTypeRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
