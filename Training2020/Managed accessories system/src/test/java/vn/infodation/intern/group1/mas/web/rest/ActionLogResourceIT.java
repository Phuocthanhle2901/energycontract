package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.ManagedAccessoriesSystemApp;
import vn.infodation.intern.group1.mas.domain.ActionLog;
import vn.infodation.intern.group1.mas.domain.Employee;
import vn.infodation.intern.group1.mas.domain.ActionType;
import vn.infodation.intern.group1.mas.domain.PlaceToPerform;
import vn.infodation.intern.group1.mas.domain.Equipment;
import vn.infodation.intern.group1.mas.repository.ActionLogRepository;

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
 * Integration tests for the {@link ActionLogResource} REST controller.
 */
@SpringBootTest(classes = ManagedAccessoriesSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class ActionLogResourceIT {

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_EXPECTED_END_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_EXPECTED_END_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_ACTUAL_END_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ACTUAL_END_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_PRICE = 1L;
    private static final Long UPDATED_PRICE = 2L;

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    @Autowired
    private ActionLogRepository actionLogRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActionLogMockMvc;

    private ActionLog actionLog;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActionLog createEntity(EntityManager em) {
        ActionLog actionLog = new ActionLog()
            .startDate(DEFAULT_START_DATE)
            .expectedEndDate(DEFAULT_EXPECTED_END_DATE)
            .actualEndDate(DEFAULT_ACTUAL_END_DATE)
            .price(DEFAULT_PRICE)
            .note(DEFAULT_NOTE);
        // Add required entity
        Employee employee;
        if (TestUtil.findAll(em, Employee.class).isEmpty()) {
            employee = EmployeeResourceIT.createEntity(em);
            em.persist(employee);
            em.flush();
        } else {
            employee = TestUtil.findAll(em, Employee.class).get(0);
        }
        actionLog.setUser(employee);
        // Add required entity
        ActionType actionType;
        if (TestUtil.findAll(em, ActionType.class).isEmpty()) {
            actionType = ActionTypeResourceIT.createEntity(em);
            em.persist(actionType);
            em.flush();
        } else {
            actionType = TestUtil.findAll(em, ActionType.class).get(0);
        }
        actionLog.setActionType(actionType);
        // Add required entity
        PlaceToPerform placeToPerform;
        if (TestUtil.findAll(em, PlaceToPerform.class).isEmpty()) {
            placeToPerform = PlaceToPerformResourceIT.createEntity(em);
            em.persist(placeToPerform);
            em.flush();
        } else {
            placeToPerform = TestUtil.findAll(em, PlaceToPerform.class).get(0);
        }
        actionLog.setPlaceToPerform(placeToPerform);
        // Add required entity
        Equipment equipment;
        if (TestUtil.findAll(em, Equipment.class).isEmpty()) {
            equipment = EquipmentResourceIT.createEntity(em);
            em.persist(equipment);
            em.flush();
        } else {
            equipment = TestUtil.findAll(em, Equipment.class).get(0);
        }
        actionLog.setEquipment(equipment);
        return actionLog;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActionLog createUpdatedEntity(EntityManager em) {
        ActionLog actionLog = new ActionLog()
            .startDate(UPDATED_START_DATE)
            .expectedEndDate(UPDATED_EXPECTED_END_DATE)
            .actualEndDate(UPDATED_ACTUAL_END_DATE)
            .price(UPDATED_PRICE)
            .note(UPDATED_NOTE);
        // Add required entity
        Employee employee;
        if (TestUtil.findAll(em, Employee.class).isEmpty()) {
            employee = EmployeeResourceIT.createUpdatedEntity(em);
            em.persist(employee);
            em.flush();
        } else {
            employee = TestUtil.findAll(em, Employee.class).get(0);
        }
        actionLog.setUser(employee);
        // Add required entity
        ActionType actionType;
        if (TestUtil.findAll(em, ActionType.class).isEmpty()) {
            actionType = ActionTypeResourceIT.createUpdatedEntity(em);
            em.persist(actionType);
            em.flush();
        } else {
            actionType = TestUtil.findAll(em, ActionType.class).get(0);
        }
        actionLog.setActionType(actionType);
        // Add required entity
        PlaceToPerform placeToPerform;
        if (TestUtil.findAll(em, PlaceToPerform.class).isEmpty()) {
            placeToPerform = PlaceToPerformResourceIT.createUpdatedEntity(em);
            em.persist(placeToPerform);
            em.flush();
        } else {
            placeToPerform = TestUtil.findAll(em, PlaceToPerform.class).get(0);
        }
        actionLog.setPlaceToPerform(placeToPerform);
        // Add required entity
        Equipment equipment;
        if (TestUtil.findAll(em, Equipment.class).isEmpty()) {
            equipment = EquipmentResourceIT.createUpdatedEntity(em);
            em.persist(equipment);
            em.flush();
        } else {
            equipment = TestUtil.findAll(em, Equipment.class).get(0);
        }
        actionLog.setEquipment(equipment);
        return actionLog;
    }

    @BeforeEach
    public void initTest() {
        actionLog = createEntity(em);
    }

    @Test
    @Transactional
    public void createActionLog() throws Exception {
        int databaseSizeBeforeCreate = actionLogRepository.findAll().size();
        // Create the ActionLog
        restActionLogMockMvc.perform(post("/api/action-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(actionLog)))
            .andExpect(status().isCreated());

        // Validate the ActionLog in the database
        List<ActionLog> actionLogList = actionLogRepository.findAll();
        assertThat(actionLogList).hasSize(databaseSizeBeforeCreate + 1);
        ActionLog testActionLog = actionLogList.get(actionLogList.size() - 1);
        assertThat(testActionLog.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testActionLog.getExpectedEndDate()).isEqualTo(DEFAULT_EXPECTED_END_DATE);
        assertThat(testActionLog.getActualEndDate()).isEqualTo(DEFAULT_ACTUAL_END_DATE);
        assertThat(testActionLog.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testActionLog.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    public void createActionLogWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = actionLogRepository.findAll().size();

        // Create the ActionLog with an existing ID
        actionLog.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restActionLogMockMvc.perform(post("/api/action-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(actionLog)))
            .andExpect(status().isBadRequest());

        // Validate the ActionLog in the database
        List<ActionLog> actionLogList = actionLogRepository.findAll();
        assertThat(actionLogList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkStartDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = actionLogRepository.findAll().size();
        // set the field null
        actionLog.setStartDate(null);

        // Create the ActionLog, which fails.


        restActionLogMockMvc.perform(post("/api/action-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(actionLog)))
            .andExpect(status().isBadRequest());

        List<ActionLog> actionLogList = actionLogRepository.findAll();
        assertThat(actionLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = actionLogRepository.findAll().size();
        // set the field null
        actionLog.setPrice(null);

        // Create the ActionLog, which fails.


        restActionLogMockMvc.perform(post("/api/action-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(actionLog)))
            .andExpect(status().isBadRequest());

        List<ActionLog> actionLogList = actionLogRepository.findAll();
        assertThat(actionLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllActionLogs() throws Exception {
        // Initialize the database
        actionLogRepository.saveAndFlush(actionLog);

        // Get all the actionLogList
        restActionLogMockMvc.perform(get("/api/action-logs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(actionLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].expectedEndDate").value(hasItem(DEFAULT_EXPECTED_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].actualEndDate").value(hasItem(DEFAULT_ACTUAL_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE)));
    }
    
    @Test
    @Transactional
    public void getActionLog() throws Exception {
        // Initialize the database
        actionLogRepository.saveAndFlush(actionLog);

        // Get the actionLog
        restActionLogMockMvc.perform(get("/api/action-logs/{id}", actionLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(actionLog.getId().intValue()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.expectedEndDate").value(DEFAULT_EXPECTED_END_DATE.toString()))
            .andExpect(jsonPath("$.actualEndDate").value(DEFAULT_ACTUAL_END_DATE.toString()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.intValue()))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE));
    }
    @Test
    @Transactional
    public void getNonExistingActionLog() throws Exception {
        // Get the actionLog
        restActionLogMockMvc.perform(get("/api/action-logs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateActionLog() throws Exception {
        // Initialize the database
        actionLogRepository.saveAndFlush(actionLog);

        int databaseSizeBeforeUpdate = actionLogRepository.findAll().size();

        // Update the actionLog
        ActionLog updatedActionLog = actionLogRepository.findById(actionLog.getId()).get();
        // Disconnect from session so that the updates on updatedActionLog are not directly saved in db
        em.detach(updatedActionLog);
        updatedActionLog
            .startDate(UPDATED_START_DATE)
            .expectedEndDate(UPDATED_EXPECTED_END_DATE)
            .actualEndDate(UPDATED_ACTUAL_END_DATE)
            .price(UPDATED_PRICE)
            .note(UPDATED_NOTE);

        restActionLogMockMvc.perform(put("/api/action-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedActionLog)))
            .andExpect(status().isOk());

        // Validate the ActionLog in the database
        List<ActionLog> actionLogList = actionLogRepository.findAll();
        assertThat(actionLogList).hasSize(databaseSizeBeforeUpdate);
        ActionLog testActionLog = actionLogList.get(actionLogList.size() - 1);
        assertThat(testActionLog.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testActionLog.getExpectedEndDate()).isEqualTo(UPDATED_EXPECTED_END_DATE);
        assertThat(testActionLog.getActualEndDate()).isEqualTo(UPDATED_ACTUAL_END_DATE);
        assertThat(testActionLog.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testActionLog.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    public void updateNonExistingActionLog() throws Exception {
        int databaseSizeBeforeUpdate = actionLogRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActionLogMockMvc.perform(put("/api/action-logs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(actionLog)))
            .andExpect(status().isBadRequest());

        // Validate the ActionLog in the database
        List<ActionLog> actionLogList = actionLogRepository.findAll();
        assertThat(actionLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteActionLog() throws Exception {
        // Initialize the database
        actionLogRepository.saveAndFlush(actionLog);

        int databaseSizeBeforeDelete = actionLogRepository.findAll().size();

        // Delete the actionLog
        restActionLogMockMvc.perform(delete("/api/action-logs/{id}", actionLog.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActionLog> actionLogList = actionLogRepository.findAll();
        assertThat(actionLogList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
