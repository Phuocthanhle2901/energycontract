package intern.team3.obmr.web.rest;

import intern.team3.obmr.repository.EventMeetingsRepository;
import intern.team3.obmr.service.EventMeetingsService;
import intern.team3.obmr.service.dto.EventMeetingsDTO;
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
 * REST controller for managing {@link intern.team3.obmr.domain.EventMeetings}.
 */
@RestController
@RequestMapping("/api")
public class EventMeetingsResource {

    private final Logger log = LoggerFactory.getLogger(EventMeetingsResource.class);

    private static final String ENTITY_NAME = "eventMeetings";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventMeetingsService eventMeetingsService;

    private final EventMeetingsRepository eventMeetingsRepository;

    public EventMeetingsResource(EventMeetingsService eventMeetingsService, EventMeetingsRepository eventMeetingsRepository) {
        this.eventMeetingsService = eventMeetingsService;
        this.eventMeetingsRepository = eventMeetingsRepository;
    }

    /**
     * {@code POST  /event-meetings} : Create a new eventMeetings.
     *
     * @param eventMeetingsDTO the eventMeetingsDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventMeetingsDTO, or with status {@code 400 (Bad Request)} if the eventMeetings has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-meetings")
    public ResponseEntity<EventMeetingsDTO> createEventMeetings(@Valid @RequestBody EventMeetingsDTO eventMeetingsDTO)
        throws URISyntaxException {
        log.debug("REST request to save EventMeetings : {}", eventMeetingsDTO);
        if (eventMeetingsDTO.getId() != null) {
            throw new BadRequestAlertException("A new eventMeetings cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventMeetingsDTO result = eventMeetingsService.save(eventMeetingsDTO);
        return ResponseEntity
            .created(new URI("/api/event-meetings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-meetings/:id} : Updates an existing eventMeetings.
     *
     * @param id the id of the eventMeetingsDTO to save.
     * @param eventMeetingsDTO the eventMeetingsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventMeetingsDTO,
     * or with status {@code 400 (Bad Request)} if the eventMeetingsDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventMeetingsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-meetings/{id}")
    public ResponseEntity<EventMeetingsDTO> updateEventMeetings(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EventMeetingsDTO eventMeetingsDTO
    ) throws URISyntaxException {
        log.debug("REST request to update EventMeetings : {}, {}", id, eventMeetingsDTO);
        if (eventMeetingsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventMeetingsDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventMeetingsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EventMeetingsDTO result = eventMeetingsService.save(eventMeetingsDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, eventMeetingsDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /event-meetings/:id} : Partial updates given fields of an existing eventMeetings, field will ignore if it is null
     *
     * @param id the id of the eventMeetingsDTO to save.
     * @param eventMeetingsDTO the eventMeetingsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventMeetingsDTO,
     * or with status {@code 400 (Bad Request)} if the eventMeetingsDTO is not valid,
     * or with status {@code 404 (Not Found)} if the eventMeetingsDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the eventMeetingsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/event-meetings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EventMeetingsDTO> partialUpdateEventMeetings(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EventMeetingsDTO eventMeetingsDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update EventMeetings partially : {}, {}", id, eventMeetingsDTO);
        if (eventMeetingsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventMeetingsDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventMeetingsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EventMeetingsDTO> result = eventMeetingsService.partialUpdate(eventMeetingsDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, eventMeetingsDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /event-meetings} : get all the eventMeetings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventMeetings in body.
     */
    @GetMapping("/event-meetings")
    public ResponseEntity<List<EventMeetingsDTO>> getAllEventMeetings(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of EventMeetings");
        Page<EventMeetingsDTO> page = eventMeetingsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /event-meetings/:id} : get the "id" eventMeetings.
     *
     * @param id the id of the eventMeetingsDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventMeetingsDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-meetings/{id}")
    public ResponseEntity<EventMeetingsDTO> getEventMeetings(@PathVariable Long id) {
        log.debug("REST request to get EventMeetings : {}", id);
        Optional<EventMeetingsDTO> eventMeetingsDTO = eventMeetingsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(eventMeetingsDTO);
    }

    /**
     * {@code DELETE  /event-meetings/:id} : delete the "id" eventMeetings.
     *
     * @param id the id of the eventMeetingsDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-meetings/{id}")
    public ResponseEntity<Void> deleteEventMeetings(@PathVariable Long id) {
        log.debug("REST request to delete EventMeetings : {}", id);
        eventMeetingsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
