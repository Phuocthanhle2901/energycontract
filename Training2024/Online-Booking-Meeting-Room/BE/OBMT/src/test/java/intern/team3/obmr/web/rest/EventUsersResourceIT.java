package intern.team3.obmr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import intern.team3.obmr.IntegrationTest;
import intern.team3.obmr.domain.EventUsers;
import intern.team3.obmr.repository.EventUsersRepository;
import intern.team3.obmr.service.dto.EventUsersDTO;
import intern.team3.obmr.service.mapper.EventUsersMapper;
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
 * Integration tests for the {@link EventUsersResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EventUsersResourceIT {

    private static final Boolean DEFAULT_IS_ORGANIZER = false;
    private static final Boolean UPDATED_IS_ORGANIZER = true;

    private static final String ENTITY_API_URL = "/api/event-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EventUsersRepository eventUsersRepository;

    @Autowired
    private EventUsersMapper eventUsersMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventUsersMockMvc;

    private EventUsers eventUsers;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventUsers createEntity(EntityManager em) {
        EventUsers eventUsers = new EventUsers().isOrganizer(DEFAULT_IS_ORGANIZER);
        return eventUsers;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventUsers createUpdatedEntity(EntityManager em) {
        EventUsers eventUsers = new EventUsers().isOrganizer(UPDATED_IS_ORGANIZER);
        return eventUsers;
    }

    @BeforeEach
    public void initTest() {
        eventUsers = createEntity(em);
    }

    @Test
    @Transactional
    void createEventUsers() throws Exception {
        int databaseSizeBeforeCreate = eventUsersRepository.findAll().size();
        // Create the EventUsers
        EventUsersDTO eventUsersDTO = eventUsersMapper.toDto(eventUsers);
        restEventUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventUsersDTO)))
            .andExpect(status().isCreated());

        // Validate the EventUsers in the database
        List<EventUsers> eventUsersList = eventUsersRepository.findAll();
        assertThat(eventUsersList).hasSize(databaseSizeBeforeCreate + 1);
        EventUsers testEventUsers = eventUsersList.get(eventUsersList.size() - 1);
        assertThat(testEventUsers.getIsOrganizer()).isEqualTo(DEFAULT_IS_ORGANIZER);
    }

    @Test
    @Transactional
    void createEventUsersWithExistingId() throws Exception {
        // Create the EventUsers with an existing ID
        eventUsers.setId(1L);
        EventUsersDTO eventUsersDTO = eventUsersMapper.toDto(eventUsers);

        int databaseSizeBeforeCreate = eventUsersRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventUsersDTO)))
            .andExpect(status().isBadRequest());

        // Validate the EventUsers in the database
        List<EventUsers> eventUsersList = eventUsersRepository.findAll();
        assertThat(eventUsersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkIsOrganizerIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventUsersRepository.findAll().size();
        // set the field null
        eventUsers.setIsOrganizer(null);

        // Create the EventUsers, which fails.
        EventUsersDTO eventUsersDTO = eventUsersMapper.toDto(eventUsers);

        restEventUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventUsersDTO)))
            .andExpect(status().isBadRequest());

        List<EventUsers> eventUsersList = eventUsersRepository.findAll();
        assertThat(eventUsersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEventUsers() throws Exception {
        // Initialize the database
        eventUsersRepository.saveAndFlush(eventUsers);

        // Get all the eventUsersList
        restEventUsersMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventUsers.getId().intValue())))
            .andExpect(jsonPath("$.[*].isOrganizer").value(hasItem(DEFAULT_IS_ORGANIZER.booleanValue())));
    }

    @Test
    @Transactional
    void getEventUsers() throws Exception {
        // Initialize the database
        eventUsersRepository.saveAndFlush(eventUsers);

        // Get the eventUsers
        restEventUsersMockMvc
            .perform(get(ENTITY_API_URL_ID, eventUsers.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(eventUsers.getId().intValue()))
            .andExpect(jsonPath("$.isOrganizer").value(DEFAULT_IS_ORGANIZER.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingEventUsers() throws Exception {
        // Get the eventUsers
        restEventUsersMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEventUsers() throws Exception {
        // Initialize the database
        eventUsersRepository.saveAndFlush(eventUsers);

        int databaseSizeBeforeUpdate = eventUsersRepository.findAll().size();

        // Update the eventUsers
        EventUsers updatedEventUsers = eventUsersRepository.findById(eventUsers.getId()).get();
        // Disconnect from session so that the updates on updatedEventUsers are not directly saved in db
        em.detach(updatedEventUsers);
        updatedEventUsers.isOrganizer(UPDATED_IS_ORGANIZER);
        EventUsersDTO eventUsersDTO = eventUsersMapper.toDto(updatedEventUsers);

        restEventUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, eventUsersDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventUsersDTO))
            )
            .andExpect(status().isOk());

        // Validate the EventUsers in the database
        List<EventUsers> eventUsersList = eventUsersRepository.findAll();
        assertThat(eventUsersList).hasSize(databaseSizeBeforeUpdate);
        EventUsers testEventUsers = eventUsersList.get(eventUsersList.size() - 1);
        assertThat(testEventUsers.getIsOrganizer()).isEqualTo(UPDATED_IS_ORGANIZER);
    }

    @Test
    @Transactional
    void putNonExistingEventUsers() throws Exception {
        int databaseSizeBeforeUpdate = eventUsersRepository.findAll().size();
        eventUsers.setId(count.incrementAndGet());

        // Create the EventUsers
        EventUsersDTO eventUsersDTO = eventUsersMapper.toDto(eventUsers);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, eventUsersDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventUsersDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventUsers in the database
        List<EventUsers> eventUsersList = eventUsersRepository.findAll();
        assertThat(eventUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEventUsers() throws Exception {
        int databaseSizeBeforeUpdate = eventUsersRepository.findAll().size();
        eventUsers.setId(count.incrementAndGet());

        // Create the EventUsers
        EventUsersDTO eventUsersDTO = eventUsersMapper.toDto(eventUsers);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventUsersDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventUsers in the database
        List<EventUsers> eventUsersList = eventUsersRepository.findAll();
        assertThat(eventUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEventUsers() throws Exception {
        int databaseSizeBeforeUpdate = eventUsersRepository.findAll().size();
        eventUsers.setId(count.incrementAndGet());

        // Create the EventUsers
        EventUsersDTO eventUsersDTO = eventUsersMapper.toDto(eventUsers);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventUsersMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventUsersDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventUsers in the database
        List<EventUsers> eventUsersList = eventUsersRepository.findAll();
        assertThat(eventUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventUsersWithPatch() throws Exception {
        // Initialize the database
        eventUsersRepository.saveAndFlush(eventUsers);

        int databaseSizeBeforeUpdate = eventUsersRepository.findAll().size();

        // Update the eventUsers using partial update
        EventUsers partialUpdatedEventUsers = new EventUsers();
        partialUpdatedEventUsers.setId(eventUsers.getId());

        restEventUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventUsers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventUsers))
            )
            .andExpect(status().isOk());

        // Validate the EventUsers in the database
        List<EventUsers> eventUsersList = eventUsersRepository.findAll();
        assertThat(eventUsersList).hasSize(databaseSizeBeforeUpdate);
        EventUsers testEventUsers = eventUsersList.get(eventUsersList.size() - 1);
        assertThat(testEventUsers.getIsOrganizer()).isEqualTo(DEFAULT_IS_ORGANIZER);
    }

    @Test
    @Transactional
    void fullUpdateEventUsersWithPatch() throws Exception {
        // Initialize the database
        eventUsersRepository.saveAndFlush(eventUsers);

        int databaseSizeBeforeUpdate = eventUsersRepository.findAll().size();

        // Update the eventUsers using partial update
        EventUsers partialUpdatedEventUsers = new EventUsers();
        partialUpdatedEventUsers.setId(eventUsers.getId());

        partialUpdatedEventUsers.isOrganizer(UPDATED_IS_ORGANIZER);

        restEventUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventUsers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventUsers))
            )
            .andExpect(status().isOk());

        // Validate the EventUsers in the database
        List<EventUsers> eventUsersList = eventUsersRepository.findAll();
        assertThat(eventUsersList).hasSize(databaseSizeBeforeUpdate);
        EventUsers testEventUsers = eventUsersList.get(eventUsersList.size() - 1);
        assertThat(testEventUsers.getIsOrganizer()).isEqualTo(UPDATED_IS_ORGANIZER);
    }

    @Test
    @Transactional
    void patchNonExistingEventUsers() throws Exception {
        int databaseSizeBeforeUpdate = eventUsersRepository.findAll().size();
        eventUsers.setId(count.incrementAndGet());

        // Create the EventUsers
        EventUsersDTO eventUsersDTO = eventUsersMapper.toDto(eventUsers);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, eventUsersDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventUsersDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventUsers in the database
        List<EventUsers> eventUsersList = eventUsersRepository.findAll();
        assertThat(eventUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEventUsers() throws Exception {
        int databaseSizeBeforeUpdate = eventUsersRepository.findAll().size();
        eventUsers.setId(count.incrementAndGet());

        // Create the EventUsers
        EventUsersDTO eventUsersDTO = eventUsersMapper.toDto(eventUsers);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventUsersDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventUsers in the database
        List<EventUsers> eventUsersList = eventUsersRepository.findAll();
        assertThat(eventUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEventUsers() throws Exception {
        int databaseSizeBeforeUpdate = eventUsersRepository.findAll().size();
        eventUsers.setId(count.incrementAndGet());

        // Create the EventUsers
        EventUsersDTO eventUsersDTO = eventUsersMapper.toDto(eventUsers);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventUsersMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(eventUsersDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventUsers in the database
        List<EventUsers> eventUsersList = eventUsersRepository.findAll();
        assertThat(eventUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEventUsers() throws Exception {
        // Initialize the database
        eventUsersRepository.saveAndFlush(eventUsers);

        int databaseSizeBeforeDelete = eventUsersRepository.findAll().size();

        // Delete the eventUsers
        restEventUsersMockMvc
            .perform(delete(ENTITY_API_URL_ID, eventUsers.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EventUsers> eventUsersList = eventUsersRepository.findAll();
        assertThat(eventUsersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
