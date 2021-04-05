package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.domain.PlaceToPerform;
import vn.infodation.intern.group1.mas.repository.PlaceToPerformRepository;
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
 * REST controller for managing {@link vn.infodation.intern.group1.mas.domain.PlaceToPerform}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PlaceToPerformResource {

    private final Logger log = LoggerFactory.getLogger(PlaceToPerformResource.class);

    private static final String ENTITY_NAME = "placeToPerform";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlaceToPerformRepository placeToPerformRepository;

    public PlaceToPerformResource(PlaceToPerformRepository placeToPerformRepository) {
        this.placeToPerformRepository = placeToPerformRepository;
    }

    /**
     * {@code POST  /place-to-performs} : Create a new placeToPerform.
     *
     * @param placeToPerform the placeToPerform to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new placeToPerform, or with status {@code 400 (Bad Request)} if the placeToPerform has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/place-to-performs")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<PlaceToPerform> createPlaceToPerform(@Valid @RequestBody PlaceToPerform placeToPerform) throws URISyntaxException {
        log.debug("REST request to save PlaceToPerform : {}", placeToPerform);
        if (placeToPerform.getId() != null) {
            throw new BadRequestAlertException("A new placeToPerform cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PlaceToPerform result = placeToPerformRepository.save(placeToPerform);
        return ResponseEntity.created(new URI("/api/place-to-performs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /place-to-performs} : Updates an existing placeToPerform.
     *
     * @param placeToPerform the placeToPerform to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated placeToPerform,
     * or with status {@code 400 (Bad Request)} if the placeToPerform is not valid,
     * or with status {@code 500 (Internal Server Error)} if the placeToPerform couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/place-to-performs")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<PlaceToPerform> updatePlaceToPerform(@Valid @RequestBody PlaceToPerform placeToPerform) throws URISyntaxException {
        log.debug("REST request to update PlaceToPerform : {}", placeToPerform);
        if (placeToPerform.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PlaceToPerform result = placeToPerformRepository.save(placeToPerform);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, placeToPerform.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /place-to-performs} : get all the placeToPerforms.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of placeToPerforms in body.
     */
    @GetMapping("/place-to-performs")
    public List<PlaceToPerform> getAllPlaceToPerforms() {
        log.debug("REST request to get all PlaceToPerforms");
        return placeToPerformRepository.findAll();
    }

    /**
     * {@code GET  /place-to-performs/:id} : get the "id" placeToPerform.
     *
     * @param id the id of the placeToPerform to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the placeToPerform, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/place-to-performs/{id}")
    public ResponseEntity<PlaceToPerform> getPlaceToPerform(@PathVariable Long id) {
        log.debug("REST request to get PlaceToPerform : {}", id);
        Optional<PlaceToPerform> placeToPerform = placeToPerformRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(placeToPerform);
    }

    /**
     * {@code DELETE  /place-to-performs/:id} : delete the "id" placeToPerform.
     *
     * @param id the id of the placeToPerform to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/place-to-performs/{id}")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deletePlaceToPerform(@PathVariable Long id) {
        log.debug("REST request to delete PlaceToPerform : {}", id);
        placeToPerformRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
