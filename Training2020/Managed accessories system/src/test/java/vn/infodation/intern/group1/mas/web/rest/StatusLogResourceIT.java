package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.ManagedAccessoriesSystemApp;
import vn.infodation.intern.group1.mas.domain.StatusLog;
import vn.infodation.intern.group1.mas.domain.StatusType;
import vn.infodation.intern.group1.mas.domain.Equipment;
import vn.infodation.intern.group1.mas.repository.StatusLogRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link StatusLogResource} REST controller.
 */
@SpringBootTest(classes = ManagedAccessoriesSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class StatusLogResourceIT {

    private static final Instant DEFAULT_STATUS_DATE_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_STATUS_DATE_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    @Autowired
    private StatusLogRepository statusLogRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStatusLogMockMvc;

    private StatusLog statusLog;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StatusLog createEntity(EntityManager em) {
        StatusLog statusLog = new StatusLog()
            .statusDateTime(DEFAULT_STATUS_DATE_TIME)
            .note(DEFAULT_NOTE);
        // Add required entity
        StatusType statusType;
        if (TestUtil.findAll(em, StatusType.class).isEmpty()) {
            statusType = StatusTypeResourceIT.createEntity(em);
            em.persist(statusType);
            em.flush();
        } else {
            statusType = TestUtil.findAll(em, StatusType.class).get(0);
        }
        statusLog.setStatusType(statusType);
        // Add required entity
        Equipment equipment;
        if (TestUtil.findAll(em, Equipment.class).isEmpty()) {
            equipment = EquipmentResourceIT.createEntity(em);
            em.persist(equipment);
            em.flush();
        } else {
            equipment = TestUtil.findAll(em, Equipment.class).get(0);
        }
        statusLog.setEquipment(equipment);
        return statusLog;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StatusLog createUpdatedEntity(EntityManager em) {
        StatusLog statusLog = new StatusLog()
            .statusDateTime(UPDATED_STATUS_DATE_TIME)
            .note(UPDATED_NOTE);
        // Add required entity
        StatusType statusType;
        if (TestUtil.findAll(em, StatusType.class).isEmpty()) {
            statusType = StatusTypeResourceIT.createUpdatedEntity(em);
            em.persist(statusType);
            em.flush();
        } else {
            statusType = TestUtil.findAll(em, StatusType.class).get(0);
        }
        statusLog.setStatusType(statusType);
        // Add required entity
        Equipment equipment;
        if (TestUtil.findAll(em, Equipment.class).isEmpty()) {
            equipment = EquipmentResourceIT.createUpdatedEntity(em);
            em.persist(equipment);
            em.flush();
        } else {
            equipment = TestUtil.findAll(em, Equipment.class).get(0);
        }
        statusLog.setEquipment(equipment);
        return statusLog;
    }

    @BeforeEach
    public void initTest() {
        statusLog = createEntity(em);
    }

    @Test
    @Transactional
    public void createStatusLog() throws Exception {
        int databaseSizeBeforeCreate = statusLogRepository.findAll().size();
        // Create the StatusLog
        restStatusLogMockMvc.perform(post("/api/status-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(statusLog)))
            .andExpect(status().isCreated());

        // Validate the StatusLog in the database
        List<StatusLog> statusLogList = statusLogRepository.findAll();
        assertThat(statusLogList).hasSize(databaseSizeBeforeCreate + 1);
        StatusLog testStatusLog = statusLogList.get(statusLogList.size() - 1);
        assertThat(testStatusLog.getStatusDateTime()).isEqualTo(DEFAULT_STATUS_DATE_TIME);
        assertThat(testStatusLog.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    public void createStatusLogWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = statusLogRepository.findAll().size();

        // Create the StatusLog with an existing ID
        statusLog.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restStatusLogMockMvc.perform(post("/api/status-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(statusLog)))
            .andExpect(status().isBadRequest());

        // Validate the StatusLog in the database
        List<StatusLog> statusLogList = statusLogRepository.findAll();
        assertThat(statusLogList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNoteIsRequired() throws Exception {
        int databaseSizeBeforeTest = statusLogRepository.findAll().size();
        // set the field null
        statusLog.setNote(null);

        // Create the StatusLog, which fails.


        restStatusLogMockMvc.perform(post("/api/status-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(statusLog)))
            .andExpect(status().isBadRequest());

        List<StatusLog> statusLogList = statusLogRepository.findAll();
        assertThat(statusLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllStatusLogs() throws Exception {
        // Initialize the database
        statusLogRepository.saveAndFlush(statusLog);

        // Get all the statusLogList
        restStatusLogMockMvc.perform(get("/api/status-logs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(statusLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].statusDateTime").value(hasItem(DEFAULT_STATUS_DATE_TIME.toString())))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE)));
    }
    
    @Test
    @Transactional
    public void getStatusLog() throws Exception {
        // Initialize the database
        statusLogRepository.saveAndFlush(statusLog);

        // Get the statusLog
        restStatusLogMockMvc.perform(get("/api/status-logs/{id}", statusLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(statusLog.getId().intValue()))
            .andExpect(jsonPath("$.statusDateTime").value(DEFAULT_STATUS_DATE_TIME.toString()))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE));
    }
    @Test
    @Transactional
    public void getNonExistingStatusLog() throws Exception {
        // Get the statusLog
        restStatusLogMockMvc.perform(get("/api/status-logs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateStatusLog() throws Exception {
        // Initialize the database
        statusLogRepository.saveAndFlush(statusLog);

        int databaseSizeBeforeUpdate = statusLogRepository.findAll().size();

        // Update the statusLog
        StatusLog updatedStatusLog = statusLogRepository.findById(statusLog.getId()).get();
        // Disconnect from session so that the updates on updatedStatusLog are not directly saved in db
        em.detach(updatedStatusLog);
        updatedStatusLog
            .statusDateTime(UPDATED_STATUS_DATE_TIME)
            .note(UPDATED_NOTE);

        restStatusLogMockMvc.perform(put("/api/status-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedStatusLog)))
            .andExpect(status().isOk());

        // Validate the StatusLog in the database
        List<StatusLog> statusLogList = statusLogRepository.findAll();
        assertThat(statusLogList).hasSize(databaseSizeBeforeUpdate);
        StatusLog testStatusLog = statusLogList.get(statusLogList.size() - 1);
        assertThat(testStatusLog.getStatusDateTime()).isEqualTo(UPDATED_STATUS_DATE_TIME);
        assertThat(testStatusLog.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    public void updateNonExistingStatusLog() throws Exception {
        int databaseSizeBeforeUpdate = statusLogRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStatusLogMockMvc.perform(put("/api/status-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(statusLog)))
            .andExpect(status().isBadRequest());

        // Validate the StatusLog in the database
        List<StatusLog> statusLogList = statusLogRepository.findAll();
        assertThat(statusLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteStatusLog() throws Exception {
        // Initialize the database
        statusLogRepository.saveAndFlush(statusLog);

        int databaseSizeBeforeDelete = statusLogRepository.findAll().size();

        // Delete the statusLog
        restStatusLogMockMvc.perform(delete("/api/status-logs/{id}", statusLog.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StatusLog> statusLogList = statusLogRepository.findAll();
        assertThat(statusLogList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
