package intern.team3.obmr.web.rest;

import static intern.team3.obmr.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import intern.team3.obmr.IntegrationTest;
import intern.team3.obmr.domain.EventMeetings;
import intern.team3.obmr.repository.EventMeetingsRepository;
import intern.team3.obmr.service.dto.EventMeetingsDTO;
import intern.team3.obmr.service.mapper.EventMeetingsMapper;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EventMeetingsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EventMeetingsResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_START_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_END_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_END_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/event-meetings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EventMeetingsRepository eventMeetingsRepository;

    @Autowired
    private EventMeetingsMapper eventMeetingsMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventMeetingsMockMvc;

    private EventMeetings eventMeetings;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventMeetings createEntity(EntityManager em) {
        EventMeetings eventMeetings = new EventMeetings()
            .title(DEFAULT_TITLE)
            .startTime(DEFAULT_START_TIME)
            .endTime(DEFAULT_END_TIME)
            .description(DEFAULT_DESCRIPTION)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .status(DEFAULT_STATUS);
        return eventMeetings;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventMeetings createUpdatedEntity(EntityManager em) {
        EventMeetings eventMeetings = new EventMeetings()
            .title(UPDATED_TITLE)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .description(UPDATED_DESCRIPTION)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .status(UPDATED_STATUS);
        return eventMeetings;
    }

    @BeforeEach
    public void initTest() {
        eventMeetings = createEntity(em);
    }

    @Test
    @Transactional
    void createEventMeetings() throws Exception {
        int databaseSizeBeforeCreate = eventMeetingsRepository.findAll().size();
        // Create the EventMeetings
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);
        restEventMeetingsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isCreated());

        // Validate the EventMeetings in the database
        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeCreate + 1);
        EventMeetings testEventMeetings = eventMeetingsList.get(eventMeetingsList.size() - 1);
        assertThat(testEventMeetings.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testEventMeetings.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testEventMeetings.getEndTime()).isEqualTo(DEFAULT_END_TIME);
        assertThat(testEventMeetings.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testEventMeetings.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testEventMeetings.getUpdatedAt()).isEqualTo(DEFAULT_UPDATED_AT);
        assertThat(testEventMeetings.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createEventMeetingsWithExistingId() throws Exception {
        // Create the EventMeetings with an existing ID
        eventMeetings.setId(1L);
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);

        int databaseSizeBeforeCreate = eventMeetingsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventMeetingsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventMeetings in the database
        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventMeetingsRepository.findAll().size();
        // set the field null
        eventMeetings.setTitle(null);

        // Create the EventMeetings, which fails.
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);

        restEventMeetingsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isBadRequest());

        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStartTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventMeetingsRepository.findAll().size();
        // set the field null
        eventMeetings.setStartTime(null);

        // Create the EventMeetings, which fails.
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);

        restEventMeetingsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isBadRequest());

        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEndTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventMeetingsRepository.findAll().size();
        // set the field null
        eventMeetings.setEndTime(null);

        // Create the EventMeetings, which fails.
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);

        restEventMeetingsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isBadRequest());

        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventMeetingsRepository.findAll().size();
        // set the field null
        eventMeetings.setDescription(null);

        // Create the EventMeetings, which fails.
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);

        restEventMeetingsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isBadRequest());

        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreatedAtIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventMeetingsRepository.findAll().size();
        // set the field null
        eventMeetings.setCreatedAt(null);

        // Create the EventMeetings, which fails.
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);

        restEventMeetingsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isBadRequest());

        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkUpdatedAtIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventMeetingsRepository.findAll().size();
        // set the field null
        eventMeetings.setUpdatedAt(null);

        // Create the EventMeetings, which fails.
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);

        restEventMeetingsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isBadRequest());

        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventMeetingsRepository.findAll().size();
        // set the field null
        eventMeetings.setStatus(null);

        // Create the EventMeetings, which fails.
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);

        restEventMeetingsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isBadRequest());

        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEventMeetings() throws Exception {
        // Initialize the database
        eventMeetingsRepository.saveAndFlush(eventMeetings);

        // Get all the eventMeetingsList
        restEventMeetingsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventMeetings.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(sameInstant(DEFAULT_START_TIME))))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(sameInstant(DEFAULT_END_TIME))))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getEventMeetings() throws Exception {
        // Initialize the database
        eventMeetingsRepository.saveAndFlush(eventMeetings);

        // Get the eventMeetings
        restEventMeetingsMockMvc
            .perform(get(ENTITY_API_URL_ID, eventMeetings.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(eventMeetings.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.startTime").value(sameInstant(DEFAULT_START_TIME)))
            .andExpect(jsonPath("$.endTime").value(sameInstant(DEFAULT_END_TIME)))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingEventMeetings() throws Exception {
        // Get the eventMeetings
        restEventMeetingsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEventMeetings() throws Exception {
        // Initialize the database
        eventMeetingsRepository.saveAndFlush(eventMeetings);

        int databaseSizeBeforeUpdate = eventMeetingsRepository.findAll().size();

        // Update the eventMeetings
        EventMeetings updatedEventMeetings = eventMeetingsRepository.findById(eventMeetings.getId()).get();
        // Disconnect from session so that the updates on updatedEventMeetings are not directly saved in db
        em.detach(updatedEventMeetings);
        updatedEventMeetings
            .title(UPDATED_TITLE)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .description(UPDATED_DESCRIPTION)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .status(UPDATED_STATUS);
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(updatedEventMeetings);

        restEventMeetingsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, eventMeetingsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isOk());

        // Validate the EventMeetings in the database
        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeUpdate);
        EventMeetings testEventMeetings = eventMeetingsList.get(eventMeetingsList.size() - 1);
        assertThat(testEventMeetings.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testEventMeetings.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testEventMeetings.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testEventMeetings.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testEventMeetings.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testEventMeetings.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
        assertThat(testEventMeetings.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingEventMeetings() throws Exception {
        int databaseSizeBeforeUpdate = eventMeetingsRepository.findAll().size();
        eventMeetings.setId(count.incrementAndGet());

        // Create the EventMeetings
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventMeetingsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, eventMeetingsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventMeetings in the database
        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEventMeetings() throws Exception {
        int databaseSizeBeforeUpdate = eventMeetingsRepository.findAll().size();
        eventMeetings.setId(count.incrementAndGet());

        // Create the EventMeetings
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMeetingsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventMeetings in the database
        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEventMeetings() throws Exception {
        int databaseSizeBeforeUpdate = eventMeetingsRepository.findAll().size();
        eventMeetings.setId(count.incrementAndGet());

        // Create the EventMeetings
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMeetingsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventMeetings in the database
        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventMeetingsWithPatch() throws Exception {
        // Initialize the database
        eventMeetingsRepository.saveAndFlush(eventMeetings);

        int databaseSizeBeforeUpdate = eventMeetingsRepository.findAll().size();

        // Update the eventMeetings using partial update
        EventMeetings partialUpdatedEventMeetings = new EventMeetings();
        partialUpdatedEventMeetings.setId(eventMeetings.getId());

        partialUpdatedEventMeetings
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .description(UPDATED_DESCRIPTION)
            .createdAt(UPDATED_CREATED_AT);

        restEventMeetingsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventMeetings.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventMeetings))
            )
            .andExpect(status().isOk());

        // Validate the EventMeetings in the database
        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeUpdate);
        EventMeetings testEventMeetings = eventMeetingsList.get(eventMeetingsList.size() - 1);
        assertThat(testEventMeetings.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testEventMeetings.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testEventMeetings.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testEventMeetings.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testEventMeetings.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testEventMeetings.getUpdatedAt()).isEqualTo(DEFAULT_UPDATED_AT);
        assertThat(testEventMeetings.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateEventMeetingsWithPatch() throws Exception {
        // Initialize the database
        eventMeetingsRepository.saveAndFlush(eventMeetings);

        int databaseSizeBeforeUpdate = eventMeetingsRepository.findAll().size();

        // Update the eventMeetings using partial update
        EventMeetings partialUpdatedEventMeetings = new EventMeetings();
        partialUpdatedEventMeetings.setId(eventMeetings.getId());

        partialUpdatedEventMeetings
            .title(UPDATED_TITLE)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .description(UPDATED_DESCRIPTION)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .status(UPDATED_STATUS);

        restEventMeetingsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventMeetings.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventMeetings))
            )
            .andExpect(status().isOk());

        // Validate the EventMeetings in the database
        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeUpdate);
        EventMeetings testEventMeetings = eventMeetingsList.get(eventMeetingsList.size() - 1);
        assertThat(testEventMeetings.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testEventMeetings.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testEventMeetings.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testEventMeetings.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testEventMeetings.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testEventMeetings.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
        assertThat(testEventMeetings.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingEventMeetings() throws Exception {
        int databaseSizeBeforeUpdate = eventMeetingsRepository.findAll().size();
        eventMeetings.setId(count.incrementAndGet());

        // Create the EventMeetings
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventMeetingsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, eventMeetingsDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventMeetings in the database
        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEventMeetings() throws Exception {
        int databaseSizeBeforeUpdate = eventMeetingsRepository.findAll().size();
        eventMeetings.setId(count.incrementAndGet());

        // Create the EventMeetings
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMeetingsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventMeetings in the database
        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEventMeetings() throws Exception {
        int databaseSizeBeforeUpdate = eventMeetingsRepository.findAll().size();
        eventMeetings.setId(count.incrementAndGet());

        // Create the EventMeetings
        EventMeetingsDTO eventMeetingsDTO = eventMeetingsMapper.toDto(eventMeetings);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMeetingsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventMeetingsDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventMeetings in the database
        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEventMeetings() throws Exception {
        // Initialize the database
        eventMeetingsRepository.saveAndFlush(eventMeetings);

        int databaseSizeBeforeDelete = eventMeetingsRepository.findAll().size();

        // Delete the eventMeetings
        restEventMeetingsMockMvc
            .perform(delete(ENTITY_API_URL_ID, eventMeetings.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EventMeetings> eventMeetingsList = eventMeetingsRepository.findAll();
        assertThat(eventMeetingsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
