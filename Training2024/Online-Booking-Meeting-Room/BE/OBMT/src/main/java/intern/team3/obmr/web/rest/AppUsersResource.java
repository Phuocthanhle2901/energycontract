package intern.team3.obmr.web.rest;

import intern.team3.obmr.repository.AppUsersRepository;
import intern.team3.obmr.service.AppUsersService;
import intern.team3.obmr.service.dto.AppUsersDTO;
import intern.team3.obmr.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link intern.team3.obmr.domain.AppUsers}.
 */
@RestController
@RequestMapping("/api")
public class AppUsersResource {

    private final Logger log = LoggerFactory.getLogger(AppUsersResource.class);

    private static final String ENTITY_NAME = "appUsers";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AppUsersService appUsersService;

    private final AppUsersRepository appUsersRepository;

    public AppUsersResource(AppUsersService appUsersService, AppUsersRepository appUsersRepository) {
        this.appUsersService = appUsersService;
        this.appUsersRepository = appUsersRepository;
    }

    /**
     * {@code POST  /app-users} : Create a new appUsers.
     *
     * @param appUsersDTO the appUsersDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new appUsersDTO, or with status {@code 400 (Bad Request)} if the appUsers has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/app-users")
    public ResponseEntity<AppUsersDTO> createAppUsers(@Valid @RequestBody AppUsersDTO appUsersDTO) throws URISyntaxException {
        log.debug("REST request to save AppUsers : {}", appUsersDTO);
        if (appUsersDTO.getId() != null) {
            throw new BadRequestAlertException("A new appUsers cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AppUsersDTO result = appUsersService.save(appUsersDTO);
        return ResponseEntity
            .created(new URI("/api/app-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /app-users/:id} : Updates an existing appUsers.
     *
     * @param id the id of the appUsersDTO to save.
     * @param appUsersDTO the appUsersDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appUsersDTO,
     * or with status {@code 400 (Bad Request)} if the appUsersDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the appUsersDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/app-users/{id}")
    public ResponseEntity<AppUsersDTO> updateAppUsers(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AppUsersDTO appUsersDTO
    ) throws URISyntaxException {
        log.debug("REST request to update AppUsers : {}, {}", id, appUsersDTO);
        if (appUsersDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appUsersDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appUsersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AppUsersDTO result = appUsersService.save(appUsersDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, appUsersDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /app-users/:id} : Partial updates given fields of an existing appUsers, field will ignore if it is null
     *
     * @param id the id of the appUsersDTO to save.
     * @param appUsersDTO the appUsersDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appUsersDTO,
     * or with status {@code 400 (Bad Request)} if the appUsersDTO is not valid,
     * or with status {@code 404 (Not Found)} if the appUsersDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the appUsersDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/app-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AppUsersDTO> partialUpdateAppUsers(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AppUsersDTO appUsersDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update AppUsers partially : {}, {}", id, appUsersDTO);
        if (appUsersDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appUsersDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appUsersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AppUsersDTO> result = appUsersService.partialUpdate(appUsersDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, appUsersDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /app-users} : get all the appUsers.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of appUsers in body.
     */
    @GetMapping("/app-users")
    public ResponseEntity<List<AppUsersDTO>> getAllAppUsers(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of AppUsers");
        Page<AppUsersDTO> page;
        if (eagerload) {
            page = appUsersService.findAllWithEagerRelationships(pageable);
        } else {
            page = appUsersService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /app-users/:id} : get the "id" appUsers.
     *
     * @param id the id of the appUsersDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the appUsersDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/app-users/{id}")
    public ResponseEntity<AppUsersDTO> getAppUsers(@PathVariable Long id) {
        log.debug("REST request to get AppUsers : {}", id);
        Optional<AppUsersDTO> appUsersDTO = appUsersService.findOne(id);
        return ResponseUtil.wrapOrNotFound(appUsersDTO);
    }

    /**
     * {@code DELETE  /app-users/:id} : delete the "id" appUsers.
     *
     * @param id the id of the appUsersDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/app-users/{id}")
    public ResponseEntity<Void> deleteAppUsers(@PathVariable Long id) {
        log.debug("REST request to delete AppUsers : {}", id);
        appUsersService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
