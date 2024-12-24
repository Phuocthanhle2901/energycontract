package intern.team3.obmr.web.rest;

import intern.team3.obmr.repository.MeetingRoomsRepository;
import intern.team3.obmr.service.MeetingRoomsService;
import intern.team3.obmr.service.dto.MeetingRoomsDTO;
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
 * REST controller for managing {@link intern.team3.obmr.domain.MeetingRooms}.
 */
@RestController
@RequestMapping("/api")
public class MeetingRoomsResource {

    private final Logger log = LoggerFactory.getLogger(MeetingRoomsResource.class);

    private static final String ENTITY_NAME = "meetingRooms";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MeetingRoomsService meetingRoomsService;

    private final MeetingRoomsRepository meetingRoomsRepository;

    public MeetingRoomsResource(MeetingRoomsService meetingRoomsService, MeetingRoomsRepository meetingRoomsRepository) {
        this.meetingRoomsService = meetingRoomsService;
        this.meetingRoomsRepository = meetingRoomsRepository;
    }

    /**
     * {@code POST  /meeting-rooms} : Create a new meetingRooms.
     *
     * @param meetingRoomsDTO the meetingRoomsDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new meetingRoomsDTO, or with status {@code 400 (Bad Request)} if the meetingRooms has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/meeting-rooms")
    public ResponseEntity<MeetingRoomsDTO> createMeetingRooms(@Valid @RequestBody MeetingRoomsDTO meetingRoomsDTO)
        throws URISyntaxException {
        log.debug("REST request to save MeetingRooms : {}", meetingRoomsDTO);
        if (meetingRoomsDTO.getId() != null) {
            throw new BadRequestAlertException("A new meetingRooms cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MeetingRoomsDTO result = meetingRoomsService.save(meetingRoomsDTO);
        return ResponseEntity
            .created(new URI("/api/meeting-rooms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /meeting-rooms/:id} : Updates an existing meetingRooms.
     *
     * @param id the id of the meetingRoomsDTO to save.
     * @param meetingRoomsDTO the meetingRoomsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated meetingRoomsDTO,
     * or with status {@code 400 (Bad Request)} if the meetingRoomsDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the meetingRoomsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/meeting-rooms/{id}")
    public ResponseEntity<MeetingRoomsDTO> updateMeetingRooms(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MeetingRoomsDTO meetingRoomsDTO
    ) throws URISyntaxException {
        log.debug("REST request to update MeetingRooms : {}, {}", id, meetingRoomsDTO);
        if (meetingRoomsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, meetingRoomsDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!meetingRoomsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MeetingRoomsDTO result = meetingRoomsService.save(meetingRoomsDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, meetingRoomsDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /meeting-rooms/:id} : Partial updates given fields of an existing meetingRooms, field will ignore if it is null
     *
     * @param id the id of the meetingRoomsDTO to save.
     * @param meetingRoomsDTO the meetingRoomsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated meetingRoomsDTO,
     * or with status {@code 400 (Bad Request)} if the meetingRoomsDTO is not valid,
     * or with status {@code 404 (Not Found)} if the meetingRoomsDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the meetingRoomsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/meeting-rooms/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MeetingRoomsDTO> partialUpdateMeetingRooms(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MeetingRoomsDTO meetingRoomsDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update MeetingRooms partially : {}, {}", id, meetingRoomsDTO);
        if (meetingRoomsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, meetingRoomsDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!meetingRoomsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MeetingRoomsDTO> result = meetingRoomsService.partialUpdate(meetingRoomsDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, meetingRoomsDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /meeting-rooms} : get all the meetingRooms.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of meetingRooms in body.
     */
    @GetMapping("/meeting-rooms")
    public ResponseEntity<List<MeetingRoomsDTO>> getAllMeetingRooms(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of MeetingRooms");
        Page<MeetingRoomsDTO> page = meetingRoomsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /meeting-rooms/:id} : get the "id" meetingRooms.
     *
     * @param id the id of the meetingRoomsDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the meetingRoomsDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/meeting-rooms/{id}")
    public ResponseEntity<MeetingRoomsDTO> getMeetingRooms(@PathVariable Long id) {
        log.debug("REST request to get MeetingRooms : {}", id);
        Optional<MeetingRoomsDTO> meetingRoomsDTO = meetingRoomsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(meetingRoomsDTO);
    }

    /**
     * {@code DELETE  /meeting-rooms/:id} : delete the "id" meetingRooms.
     *
     * @param id the id of the meetingRoomsDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/meeting-rooms/{id}")
    public ResponseEntity<Void> deleteMeetingRooms(@PathVariable Long id) {
        log.debug("REST request to delete MeetingRooms : {}", id);
        meetingRoomsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
