package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.ManagedAccessoriesSystemApp;
import vn.infodation.intern.group1.mas.domain.UserEquipmentActivityLog;
import vn.infodation.intern.group1.mas.domain.Employee;
import vn.infodation.intern.group1.mas.domain.Equipment;
import vn.infodation.intern.group1.mas.repository.UserEquipmentActivityLogRepository;

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
 * Integration tests for the {@link UserEquipmentActivityLogResource} REST controller.
 */
@SpringBootTest(classes = ManagedAccessoriesSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class UserEquipmentActivityLogResourceIT {

    private static final String DEFAULT_ACTIVITY = "AAAAAAAAAA";
    private static final String UPDATED_ACTIVITY = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private UserEquipmentActivityLogRepository userEquipmentActivityLogRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserEquipmentActivityLogMockMvc;

    private UserEquipmentActivityLog userEquipmentActivityLog;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserEquipmentActivityLog createEntity(EntityManager em) {
        UserEquipmentActivityLog userEquipmentActivityLog = new UserEquipmentActivityLog()
            .activity(DEFAULT_ACTIVITY)
            .date(DEFAULT_DATE);
        // Add required entity
        Employee employee;
        if (TestUtil.findAll(em, Employee.class).isEmpty()) {
            employee = EmployeeResourceIT.createEntity(em);
            em.persist(employee);
            em.flush();
        } else {
            employee = TestUtil.findAll(em, Employee.class).get(0);
        }
        userEquipmentActivityLog.setUser(employee);
        // Add required entity
        Equipment equipment;
        if (TestUtil.findAll(em, Equipment.class).isEmpty()) {
            equipment = EquipmentResourceIT.createEntity(em);
            em.persist(equipment);
            em.flush();
        } else {
            equipment = TestUtil.findAll(em, Equipment.class).get(0);
        }
        userEquipmentActivityLog.setEquipment(equipment);
        return userEquipmentActivityLog;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserEquipmentActivityLog createUpdatedEntity(EntityManager em) {
        UserEquipmentActivityLog userEquipmentActivityLog = new UserEquipmentActivityLog()
            .activity(UPDATED_ACTIVITY)
            .date(UPDATED_DATE);
        // Add required entity
        Employee employee;
        if (TestUtil.findAll(em, Employee.class).isEmpty()) {
            employee = EmployeeResourceIT.createUpdatedEntity(em);
            em.persist(employee);
            em.flush();
        } else {
            employee = TestUtil.findAll(em, Employee.class).get(0);
        }
        userEquipmentActivityLog.setUser(employee);
        // Add required entity
        Equipment equipment;
        if (TestUtil.findAll(em, Equipment.class).isEmpty()) {
            equipment = EquipmentResourceIT.createUpdatedEntity(em);
            em.persist(equipment);
            em.flush();
        } else {
            equipment = TestUtil.findAll(em, Equipment.class).get(0);
        }
        userEquipmentActivityLog.setEquipment(equipment);
        return userEquipmentActivityLog;
    }

    @BeforeEach
    public void initTest() {
        userEquipmentActivityLog = createEntity(em);
    }

    @Test
    @Transactional
    public void createUserEquipmentActivityLog() throws Exception {
        int databaseSizeBeforeCreate = userEquipmentActivityLogRepository.findAll().size();
        // Create the UserEquipmentActivityLog
        restUserEquipmentActivityLogMockMvc.perform(post("/api/user-equipment-activity-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(userEquipmentActivityLog)))
            .andExpect(status().isCreated());

        // Validate the UserEquipmentActivityLog in the database
        List<UserEquipmentActivityLog> userEquipmentActivityLogList = userEquipmentActivityLogRepository.findAll();
        assertThat(userEquipmentActivityLogList).hasSize(databaseSizeBeforeCreate + 1);
        UserEquipmentActivityLog testUserEquipmentActivityLog = userEquipmentActivityLogList.get(userEquipmentActivityLogList.size() - 1);
        assertThat(testUserEquipmentActivityLog.getActivity()).isEqualTo(DEFAULT_ACTIVITY);
        assertThat(testUserEquipmentActivityLog.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createUserEquipmentActivityLogWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = userEquipmentActivityLogRepository.findAll().size();

        // Create the UserEquipmentActivityLog with an existing ID
        userEquipmentActivityLog.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserEquipmentActivityLogMockMvc.perform(post("/api/user-equipment-activity-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(userEquipmentActivityLog)))
            .andExpect(status().isBadRequest());

        // Validate the UserEquipmentActivityLog in the database
        List<UserEquipmentActivityLog> userEquipmentActivityLogList = userEquipmentActivityLogRepository.findAll();
        assertThat(userEquipmentActivityLogList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkActivityIsRequired() throws Exception {
        int databaseSizeBeforeTest = userEquipmentActivityLogRepository.findAll().size();
        // set the field null
        userEquipmentActivityLog.setActivity(null);

        // Create the UserEquipmentActivityLog, which fails.


        restUserEquipmentActivityLogMockMvc.perform(post("/api/user-equipment-activity-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(userEquipmentActivityLog)))
            .andExpect(status().isBadRequest());

        List<UserEquipmentActivityLog> userEquipmentActivityLogList = userEquipmentActivityLogRepository.findAll();
        assertThat(userEquipmentActivityLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllUserEquipmentActivityLogs() throws Exception {
        // Initialize the database
        userEquipmentActivityLogRepository.saveAndFlush(userEquipmentActivityLog);

        // Get all the userEquipmentActivityLogList
        restUserEquipmentActivityLogMockMvc.perform(get("/api/user-equipment-activity-logs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userEquipmentActivityLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].activity").value(hasItem(DEFAULT_ACTIVITY)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getUserEquipmentActivityLog() throws Exception {
        // Initialize the database
        userEquipmentActivityLogRepository.saveAndFlush(userEquipmentActivityLog);

        // Get the userEquipmentActivityLog
        restUserEquipmentActivityLogMockMvc.perform(get("/api/user-equipment-activity-logs/{id}", userEquipmentActivityLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userEquipmentActivityLog.getId().intValue()))
            .andExpect(jsonPath("$.activity").value(DEFAULT_ACTIVITY))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingUserEquipmentActivityLog() throws Exception {
        // Get the userEquipmentActivityLog
        restUserEquipmentActivityLogMockMvc.perform(get("/api/user-equipment-activity-logs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUserEquipmentActivityLog() throws Exception {
        // Initialize the database
        userEquipmentActivityLogRepository.saveAndFlush(userEquipmentActivityLog);

        int databaseSizeBeforeUpdate = userEquipmentActivityLogRepository.findAll().size();

        // Update the userEquipmentActivityLog
        UserEquipmentActivityLog updatedUserEquipmentActivityLog = userEquipmentActivityLogRepository.findById(userEquipmentActivityLog.getId()).get();
        // Disconnect from session so that the updates on updatedUserEquipmentActivityLog are not directly saved in db
        em.detach(updatedUserEquipmentActivityLog);
        updatedUserEquipmentActivityLog
            .activity(UPDATED_ACTIVITY)
            .date(UPDATED_DATE);

        restUserEquipmentActivityLogMockMvc.perform(put("/api/user-equipment-activity-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedUserEquipmentActivityLog)))
            .andExpect(status().isOk());

        // Validate the UserEquipmentActivityLog in the database
        List<UserEquipmentActivityLog> userEquipmentActivityLogList = userEquipmentActivityLogRepository.findAll();
        assertThat(userEquipmentActivityLogList).hasSize(databaseSizeBeforeUpdate);
        UserEquipmentActivityLog testUserEquipmentActivityLog = userEquipmentActivityLogList.get(userEquipmentActivityLogList.size() - 1);
        assertThat(testUserEquipmentActivityLog.getActivity()).isEqualTo(UPDATED_ACTIVITY);
        assertThat(testUserEquipmentActivityLog.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingUserEquipmentActivityLog() throws Exception {
        int databaseSizeBeforeUpdate = userEquipmentActivityLogRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserEquipmentActivityLogMockMvc.perform(put("/api/user-equipment-activity-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(userEquipmentActivityLog)))
            .andExpect(status().isBadRequest());

        // Validate the UserEquipmentActivityLog in the database
        List<UserEquipmentActivityLog> userEquipmentActivityLogList = userEquipmentActivityLogRepository.findAll();
        assertThat(userEquipmentActivityLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUserEquipmentActivityLog() throws Exception {
        // Initialize the database
        userEquipmentActivityLogRepository.saveAndFlush(userEquipmentActivityLog);

        int databaseSizeBeforeDelete = userEquipmentActivityLogRepository.findAll().size();

        // Delete the userEquipmentActivityLog
        restUserEquipmentActivityLogMockMvc.perform(delete("/api/user-equipment-activity-logs/{id}", userEquipmentActivityLog.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserEquipmentActivityLog> userEquipmentActivityLogList = userEquipmentActivityLogRepository.findAll();
        assertThat(userEquipmentActivityLogList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
