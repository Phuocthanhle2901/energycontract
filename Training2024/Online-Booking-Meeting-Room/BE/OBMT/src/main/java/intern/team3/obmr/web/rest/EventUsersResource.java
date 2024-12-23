package intern.team3.obmr.web.rest;

import intern.team3.obmr.repository.EventUsersRepository;
import intern.team3.obmr.service.EventUsersService;
import intern.team3.obmr.service.dto.EventUsersDTO;
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
 * REST controller for managing {@link intern.team3.obmr.domain.EventUsers}.
 */
@RestController
@RequestMapping("/api")
public class EventUsersResource {

    private final Logger log = LoggerFactory.getLogger(EventUsersResource.class);

    private static final String ENTITY_NAME = "eventUsers";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventUsersService eventUsersService;

    private final EventUsersRepository eventUsersRepository;

    public EventUsersResource(EventUsersService eventUsersService, EventUsersRepository eventUsersRepository) {
        this.eventUsersService = eventUsersService;
        this.eventUsersRepository = eventUsersRepository;
    }

    /**
     * {@code POST  /event-users} : Create a new eventUsers.
     *
     * @param eventUsersDTO the eventUsersDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventUsersDTO, or with status {@code 400 (Bad Request)} if the eventUsers has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-users")
    public ResponseEntity<EventUsersDTO> createEventUsers(@Valid @RequestBody EventUsersDTO eventUsersDTO) throws URISyntaxException {
        log.debug("REST request to save EventUsers : {}", eventUsersDTO);
        if (eventUsersDTO.getId() != null) {
            throw new BadRequestAlertException("A new eventUsers cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventUsersDTO result = eventUsersService.save(eventUsersDTO);
        return ResponseEntity
            .created(new URI("/api/event-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-users/:id} : Updates an existing eventUsers.
     *
     * @param id the id of the eventUsersDTO to save.
     * @param eventUsersDTO the eventUsersDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventUsersDTO,
     * or with status {@code 400 (Bad Request)} if the eventUsersDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventUsersDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-users/{id}")
    public ResponseEntity<EventUsersDTO> updateEventUsers(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EventUsersDTO eventUsersDTO
    ) throws URISyntaxException {
        log.debug("REST request to update EventUsers : {}, {}", id, eventUsersDTO);
        if (eventUsersDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventUsersDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventUsersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EventUsersDTO result = eventUsersService.save(eventUsersDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, eventUsersDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /event-users/:id} : Partial updates given fields of an existing eventUsers, field will ignore if it is null
     *
     * @param id the id of the eventUsersDTO to save.
     * @param eventUsersDTO the eventUsersDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventUsersDTO,
     * or with status {@code 400 (Bad Request)} if the eventUsersDTO is not valid,
     * or with status {@code 404 (Not Found)} if the eventUsersDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the eventUsersDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/event-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EventUsersDTO> partialUpdateEventUsers(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EventUsersDTO eventUsersDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update EventUsers partially : {}, {}", id, eventUsersDTO);
        if (eventUsersDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventUsersDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventUsersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EventUsersDTO> result = eventUsersService.partialUpdate(eventUsersDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, eventUsersDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /event-users} : get all the eventUsers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventUsers in body.
     */
    @GetMapping("/event-users")
    public ResponseEntity<List<EventUsersDTO>> getAllEventUsers(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of EventUsers");
        Page<EventUsersDTO> page = eventUsersService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /event-users/:id} : get the "id" eventUsers.
     *
     * @param id the id of the eventUsersDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventUsersDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-users/{id}")
    public ResponseEntity<EventUsersDTO> getEventUsers(@PathVariable Long id) {
        log.debug("REST request to get EventUsers : {}", id);
        Optional<EventUsersDTO> eventUsersDTO = eventUsersService.findOne(id);
        return ResponseUtil.wrapOrNotFound(eventUsersDTO);
    }

    /**
     * {@code DELETE  /event-users/:id} : delete the "id" eventUsers.
     *
     * @param id the id of the eventUsersDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-users/{id}")
    public ResponseEntity<Void> deleteEventUsers(@PathVariable Long id) {
        log.debug("REST request to delete EventUsers : {}", id);
        eventUsersService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
