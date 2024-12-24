package intern.team3.obmr.web.rest;

import static intern.team3.obmr.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import intern.team3.obmr.IntegrationTest;
import intern.team3.obmr.domain.MeetingRooms;
import intern.team3.obmr.repository.MeetingRoomsRepository;
import intern.team3.obmr.service.dto.MeetingRoomsDTO;
import intern.team3.obmr.service.mapper.MeetingRoomsMapper;
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
 * Integration tests for the {@link MeetingRoomsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MeetingRoomsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_CAPACITY = 1;
    private static final Integer UPDATED_CAPACITY = 2;

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/meeting-rooms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MeetingRoomsRepository meetingRoomsRepository;

    @Autowired
    private MeetingRoomsMapper meetingRoomsMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMeetingRoomsMockMvc;

    private MeetingRooms meetingRooms;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MeetingRooms createEntity(EntityManager em) {
        MeetingRooms meetingRooms = new MeetingRooms()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .capacity(DEFAULT_CAPACITY)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT);
        return meetingRooms;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MeetingRooms createUpdatedEntity(EntityManager em) {
        MeetingRooms meetingRooms = new MeetingRooms()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .capacity(UPDATED_CAPACITY)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);
        return meetingRooms;
    }

    @BeforeEach
    public void initTest() {
        meetingRooms = createEntity(em);
    }

    @Test
    @Transactional
    void createMeetingRooms() throws Exception {
        int databaseSizeBeforeCreate = meetingRoomsRepository.findAll().size();
        // Create the MeetingRooms
        MeetingRoomsDTO meetingRoomsDTO = meetingRoomsMapper.toDto(meetingRooms);
        restMeetingRoomsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meetingRoomsDTO))
            )
            .andExpect(status().isCreated());

        // Validate the MeetingRooms in the database
        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeCreate + 1);
        MeetingRooms testMeetingRooms = meetingRoomsList.get(meetingRoomsList.size() - 1);
        assertThat(testMeetingRooms.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMeetingRooms.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMeetingRooms.getCapacity()).isEqualTo(DEFAULT_CAPACITY);
        assertThat(testMeetingRooms.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testMeetingRooms.getUpdatedAt()).isEqualTo(DEFAULT_UPDATED_AT);
    }

    @Test
    @Transactional
    void createMeetingRoomsWithExistingId() throws Exception {
        // Create the MeetingRooms with an existing ID
        meetingRooms.setId(1L);
        MeetingRoomsDTO meetingRoomsDTO = meetingRoomsMapper.toDto(meetingRooms);

        int databaseSizeBeforeCreate = meetingRoomsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMeetingRoomsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meetingRoomsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the MeetingRooms in the database
        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = meetingRoomsRepository.findAll().size();
        // set the field null
        meetingRooms.setName(null);

        // Create the MeetingRooms, which fails.
        MeetingRoomsDTO meetingRoomsDTO = meetingRoomsMapper.toDto(meetingRooms);

        restMeetingRoomsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meetingRoomsDTO))
            )
            .andExpect(status().isBadRequest());

        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = meetingRoomsRepository.findAll().size();
        // set the field null
        meetingRooms.setDescription(null);

        // Create the MeetingRooms, which fails.
        MeetingRoomsDTO meetingRoomsDTO = meetingRoomsMapper.toDto(meetingRooms);

        restMeetingRoomsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meetingRoomsDTO))
            )
            .andExpect(status().isBadRequest());

        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCapacityIsRequired() throws Exception {
        int databaseSizeBeforeTest = meetingRoomsRepository.findAll().size();
        // set the field null
        meetingRooms.setCapacity(null);

        // Create the MeetingRooms, which fails.
        MeetingRoomsDTO meetingRoomsDTO = meetingRoomsMapper.toDto(meetingRooms);

        restMeetingRoomsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meetingRoomsDTO))
            )
            .andExpect(status().isBadRequest());

        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreatedAtIsRequired() throws Exception {
        int databaseSizeBeforeTest = meetingRoomsRepository.findAll().size();
        // set the field null
        meetingRooms.setCreatedAt(null);

        // Create the MeetingRooms, which fails.
        MeetingRoomsDTO meetingRoomsDTO = meetingRoomsMapper.toDto(meetingRooms);

        restMeetingRoomsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meetingRoomsDTO))
            )
            .andExpect(status().isBadRequest());

        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkUpdatedAtIsRequired() throws Exception {
        int databaseSizeBeforeTest = meetingRoomsRepository.findAll().size();
        // set the field null
        meetingRooms.setUpdatedAt(null);

        // Create the MeetingRooms, which fails.
        MeetingRoomsDTO meetingRoomsDTO = meetingRoomsMapper.toDto(meetingRooms);

        restMeetingRoomsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meetingRoomsDTO))
            )
            .andExpect(status().isBadRequest());

        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMeetingRooms() throws Exception {
        // Initialize the database
        meetingRoomsRepository.saveAndFlush(meetingRooms);

        // Get all the meetingRoomsList
        restMeetingRoomsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(meetingRooms.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].capacity").value(hasItem(DEFAULT_CAPACITY)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))));
    }

    @Test
    @Transactional
    void getMeetingRooms() throws Exception {
        // Initialize the database
        meetingRoomsRepository.saveAndFlush(meetingRooms);

        // Get the meetingRooms
        restMeetingRoomsMockMvc
            .perform(get(ENTITY_API_URL_ID, meetingRooms.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(meetingRooms.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.capacity").value(DEFAULT_CAPACITY))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)));
    }

    @Test
    @Transactional
    void getNonExistingMeetingRooms() throws Exception {
        // Get the meetingRooms
        restMeetingRoomsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMeetingRooms() throws Exception {
        // Initialize the database
        meetingRoomsRepository.saveAndFlush(meetingRooms);

        int databaseSizeBeforeUpdate = meetingRoomsRepository.findAll().size();

        // Update the meetingRooms
        MeetingRooms updatedMeetingRooms = meetingRoomsRepository.findById(meetingRooms.getId()).get();
        // Disconnect from session so that the updates on updatedMeetingRooms are not directly saved in db
        em.detach(updatedMeetingRooms);
        updatedMeetingRooms
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .capacity(UPDATED_CAPACITY)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);
        MeetingRoomsDTO meetingRoomsDTO = meetingRoomsMapper.toDto(updatedMeetingRooms);

        restMeetingRoomsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, meetingRoomsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(meetingRoomsDTO))
            )
            .andExpect(status().isOk());

        // Validate the MeetingRooms in the database
        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeUpdate);
        MeetingRooms testMeetingRooms = meetingRoomsList.get(meetingRoomsList.size() - 1);
        assertThat(testMeetingRooms.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMeetingRooms.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMeetingRooms.getCapacity()).isEqualTo(UPDATED_CAPACITY);
        assertThat(testMeetingRooms.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testMeetingRooms.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void putNonExistingMeetingRooms() throws Exception {
        int databaseSizeBeforeUpdate = meetingRoomsRepository.findAll().size();
        meetingRooms.setId(count.incrementAndGet());

        // Create the MeetingRooms
        MeetingRoomsDTO meetingRoomsDTO = meetingRoomsMapper.toDto(meetingRooms);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMeetingRoomsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, meetingRoomsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(meetingRoomsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the MeetingRooms in the database
        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMeetingRooms() throws Exception {
        int databaseSizeBeforeUpdate = meetingRoomsRepository.findAll().size();
        meetingRooms.setId(count.incrementAndGet());

        // Create the MeetingRooms
        MeetingRoomsDTO meetingRoomsDTO = meetingRoomsMapper.toDto(meetingRooms);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeetingRoomsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(meetingRoomsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the MeetingRooms in the database
        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMeetingRooms() throws Exception {
        int databaseSizeBeforeUpdate = meetingRoomsRepository.findAll().size();
        meetingRooms.setId(count.incrementAndGet());

        // Create the MeetingRooms
        MeetingRoomsDTO meetingRoomsDTO = meetingRoomsMapper.toDto(meetingRooms);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeetingRoomsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meetingRoomsDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MeetingRooms in the database
        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMeetingRoomsWithPatch() throws Exception {
        // Initialize the database
        meetingRoomsRepository.saveAndFlush(meetingRooms);

        int databaseSizeBeforeUpdate = meetingRoomsRepository.findAll().size();

        // Update the meetingRooms using partial update
        MeetingRooms partialUpdatedMeetingRooms = new MeetingRooms();
        partialUpdatedMeetingRooms.setId(meetingRooms.getId());

        partialUpdatedMeetingRooms.description(UPDATED_DESCRIPTION).createdAt(UPDATED_CREATED_AT);

        restMeetingRoomsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMeetingRooms.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMeetingRooms))
            )
            .andExpect(status().isOk());

        // Validate the MeetingRooms in the database
        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeUpdate);
        MeetingRooms testMeetingRooms = meetingRoomsList.get(meetingRoomsList.size() - 1);
        assertThat(testMeetingRooms.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMeetingRooms.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMeetingRooms.getCapacity()).isEqualTo(DEFAULT_CAPACITY);
        assertThat(testMeetingRooms.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testMeetingRooms.getUpdatedAt()).isEqualTo(DEFAULT_UPDATED_AT);
    }

    @Test
    @Transactional
    void fullUpdateMeetingRoomsWithPatch() throws Exception {
        // Initialize the database
        meetingRoomsRepository.saveAndFlush(meetingRooms);

        int databaseSizeBeforeUpdate = meetingRoomsRepository.findAll().size();

        // Update the meetingRooms using partial update
        MeetingRooms partialUpdatedMeetingRooms = new MeetingRooms();
        partialUpdatedMeetingRooms.setId(meetingRooms.getId());

        partialUpdatedMeetingRooms
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .capacity(UPDATED_CAPACITY)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);

        restMeetingRoomsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMeetingRooms.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMeetingRooms))
            )
            .andExpect(status().isOk());

        // Validate the MeetingRooms in the database
        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeUpdate);
        MeetingRooms testMeetingRooms = meetingRoomsList.get(meetingRoomsList.size() - 1);
        assertThat(testMeetingRooms.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMeetingRooms.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMeetingRooms.getCapacity()).isEqualTo(UPDATED_CAPACITY);
        assertThat(testMeetingRooms.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testMeetingRooms.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void patchNonExistingMeetingRooms() throws Exception {
        int databaseSizeBeforeUpdate = meetingRoomsRepository.findAll().size();
        meetingRooms.setId(count.incrementAndGet());

        // Create the MeetingRooms
        MeetingRoomsDTO meetingRoomsDTO = meetingRoomsMapper.toDto(meetingRooms);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMeetingRoomsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, meetingRoomsDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(meetingRoomsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the MeetingRooms in the database
        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMeetingRooms() throws Exception {
        int databaseSizeBeforeUpdate = meetingRoomsRepository.findAll().size();
        meetingRooms.setId(count.incrementAndGet());

        // Create the MeetingRooms
        MeetingRoomsDTO meetingRoomsDTO = meetingRoomsMapper.toDto(meetingRooms);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeetingRoomsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(meetingRoomsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the MeetingRooms in the database
        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMeetingRooms() throws Exception {
        int databaseSizeBeforeUpdate = meetingRoomsRepository.findAll().size();
        meetingRooms.setId(count.incrementAndGet());

        // Create the MeetingRooms
        MeetingRoomsDTO meetingRoomsDTO = meetingRoomsMapper.toDto(meetingRooms);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeetingRoomsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(meetingRoomsDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MeetingRooms in the database
        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMeetingRooms() throws Exception {
        // Initialize the database
        meetingRoomsRepository.saveAndFlush(meetingRooms);

        int databaseSizeBeforeDelete = meetingRoomsRepository.findAll().size();

        // Delete the meetingRooms
        restMeetingRoomsMockMvc
            .perform(delete(ENTITY_API_URL_ID, meetingRooms.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MeetingRooms> meetingRoomsList = meetingRoomsRepository.findAll();
        assertThat(meetingRoomsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
