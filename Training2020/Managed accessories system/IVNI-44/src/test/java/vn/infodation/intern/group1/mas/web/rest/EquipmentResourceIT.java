package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.ManagedAccessoriesSystemApp;
import vn.infodation.intern.group1.mas.domain.Equipment;
import vn.infodation.intern.group1.mas.domain.Employee;
import vn.infodation.intern.group1.mas.domain.EquipmentGroup;
import vn.infodation.intern.group1.mas.domain.EquipmentType;
import vn.infodation.intern.group1.mas.domain.Area;
import vn.infodation.intern.group1.mas.repository.EquipmentRepository;

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
 * Integration tests for the {@link EquipmentResource} REST controller.
 */
@SpringBootTest(classes = ManagedAccessoriesSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class EquipmentResourceIT {

    private static final Instant DEFAULT_PURCHASE_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_PURCHASE_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_EQUIPMENT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_EQUIPMENT_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TECHNICAL_FEATURES = "AAAAAAAAAA";
    private static final String UPDATED_TECHNICAL_FEATURES = "BBBBBBBBBB";

    private static final String DEFAULT_SERIAL_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_SERIAL_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEquipmentMockMvc;

    private Equipment equipment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Equipment createEntity(EntityManager em) {
        Equipment equipment = new Equipment()
            .purchaseDate(DEFAULT_PURCHASE_DATE)
            .equipmentName(DEFAULT_EQUIPMENT_NAME)
            .technicalFeatures(DEFAULT_TECHNICAL_FEATURES)
            .serialNumber(DEFAULT_SERIAL_NUMBER)
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
        equipment.setUser(employee);
        // Add required entity
        EquipmentGroup equipmentGroup;
        if (TestUtil.findAll(em, EquipmentGroup.class).isEmpty()) {
            equipmentGroup = EquipmentGroupResourceIT.createEntity(em);
            em.persist(equipmentGroup);
            em.flush();
        } else {
            equipmentGroup = TestUtil.findAll(em, EquipmentGroup.class).get(0);
        }
        equipment.setEquipmentGroup(equipmentGroup);
        // Add required entity
        EquipmentType equipmentType;
        if (TestUtil.findAll(em, EquipmentType.class).isEmpty()) {
            equipmentType = EquipmentTypeResourceIT.createEntity(em);
            em.persist(equipmentType);
            em.flush();
        } else {
            equipmentType = TestUtil.findAll(em, EquipmentType.class).get(0);
        }
        equipment.setEquipmentType(equipmentType);
        // Add required entity
        Area area;
        if (TestUtil.findAll(em, Area.class).isEmpty()) {
            area = AreaResourceIT.createEntity(em);
            em.persist(area);
            em.flush();
        } else {
            area = TestUtil.findAll(em, Area.class).get(0);
        }
        equipment.setArea(area);
        return equipment;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Equipment createUpdatedEntity(EntityManager em) {
        Equipment equipment = new Equipment()
            .purchaseDate(UPDATED_PURCHASE_DATE)
            .equipmentName(UPDATED_EQUIPMENT_NAME)
            .technicalFeatures(UPDATED_TECHNICAL_FEATURES)
            .serialNumber(UPDATED_SERIAL_NUMBER)
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
        equipment.setUser(employee);
        // Add required entity
        EquipmentGroup equipmentGroup;
        if (TestUtil.findAll(em, EquipmentGroup.class).isEmpty()) {
            equipmentGroup = EquipmentGroupResourceIT.createUpdatedEntity(em);
            em.persist(equipmentGroup);
            em.flush();
        } else {
            equipmentGroup = TestUtil.findAll(em, EquipmentGroup.class).get(0);
        }
        equipment.setEquipmentGroup(equipmentGroup);
        // Add required entity
        EquipmentType equipmentType;
        if (TestUtil.findAll(em, EquipmentType.class).isEmpty()) {
            equipmentType = EquipmentTypeResourceIT.createUpdatedEntity(em);
            em.persist(equipmentType);
            em.flush();
        } else {
            equipmentType = TestUtil.findAll(em, EquipmentType.class).get(0);
        }
        equipment.setEquipmentType(equipmentType);
        // Add required entity
        Area area;
        if (TestUtil.findAll(em, Area.class).isEmpty()) {
            area = AreaResourceIT.createUpdatedEntity(em);
            em.persist(area);
            em.flush();
        } else {
            area = TestUtil.findAll(em, Area.class).get(0);
        }
        equipment.setArea(area);
        return equipment;
    }

    @BeforeEach
    public void initTest() {
        equipment = createEntity(em);
    }

    @Test
    @Transactional
    public void createEquipment() throws Exception {
        int databaseSizeBeforeCreate = equipmentRepository.findAll().size();
        // Create the Equipment
        restEquipmentMockMvc.perform(post("/api/equipment")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipment)))
            .andExpect(status().isCreated());

        // Validate the Equipment in the database
        List<Equipment> equipmentList = equipmentRepository.findAll();
        assertThat(equipmentList).hasSize(databaseSizeBeforeCreate + 1);
        Equipment testEquipment = equipmentList.get(equipmentList.size() - 1);
        assertThat(testEquipment.getPurchaseDate()).isEqualTo(DEFAULT_PURCHASE_DATE);
        assertThat(testEquipment.getEquipmentName()).isEqualTo(DEFAULT_EQUIPMENT_NAME);
        assertThat(testEquipment.getTechnicalFeatures()).isEqualTo(DEFAULT_TECHNICAL_FEATURES);
        assertThat(testEquipment.getSerialNumber()).isEqualTo(DEFAULT_SERIAL_NUMBER);
        assertThat(testEquipment.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    public void createEquipmentWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = equipmentRepository.findAll().size();

        // Create the Equipment with an existing ID
        equipment.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEquipmentMockMvc.perform(post("/api/equipment")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipment)))
            .andExpect(status().isBadRequest());

        // Validate the Equipment in the database
        List<Equipment> equipmentList = equipmentRepository.findAll();
        assertThat(equipmentList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkEquipmentNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = equipmentRepository.findAll().size();
        // set the field null
        equipment.setEquipmentName(null);

        // Create the Equipment, which fails.


        restEquipmentMockMvc.perform(post("/api/equipment")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipment)))
            .andExpect(status().isBadRequest());

        List<Equipment> equipmentList = equipmentRepository.findAll();
        assertThat(equipmentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTechnicalFeaturesIsRequired() throws Exception {
        int databaseSizeBeforeTest = equipmentRepository.findAll().size();
        // set the field null
        equipment.setTechnicalFeatures(null);

        // Create the Equipment, which fails.


        restEquipmentMockMvc.perform(post("/api/equipment")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipment)))
            .andExpect(status().isBadRequest());

        List<Equipment> equipmentList = equipmentRepository.findAll();
        assertThat(equipmentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSerialNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = equipmentRepository.findAll().size();
        // set the field null
        equipment.setSerialNumber(null);

        // Create the Equipment, which fails.


        restEquipmentMockMvc.perform(post("/api/equipment")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipment)))
            .andExpect(status().isBadRequest());

        List<Equipment> equipmentList = equipmentRepository.findAll();
        assertThat(equipmentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNoteIsRequired() throws Exception {
        int databaseSizeBeforeTest = equipmentRepository.findAll().size();
        // set the field null
        equipment.setNote(null);

        // Create the Equipment, which fails.


        restEquipmentMockMvc.perform(post("/api/equipment")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipment)))
            .andExpect(status().isBadRequest());

        List<Equipment> equipmentList = equipmentRepository.findAll();
        assertThat(equipmentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEquipment() throws Exception {
        // Initialize the database
        equipmentRepository.saveAndFlush(equipment);

        // Get all the equipmentList
        restEquipmentMockMvc.perform(get("/api/equipment?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(equipment.getId().intValue())))
            .andExpect(jsonPath("$.[*].purchaseDate").value(hasItem(DEFAULT_PURCHASE_DATE.toString())))
            .andExpect(jsonPath("$.[*].equipmentName").value(hasItem(DEFAULT_EQUIPMENT_NAME)))
            .andExpect(jsonPath("$.[*].technicalFeatures").value(hasItem(DEFAULT_TECHNICAL_FEATURES)))
            .andExpect(jsonPath("$.[*].serialNumber").value(hasItem(DEFAULT_SERIAL_NUMBER)))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE)));
    }
    
    @Test
    @Transactional
    public void getEquipment() throws Exception {
        // Initialize the database
        equipmentRepository.saveAndFlush(equipment);

        // Get the equipment
        restEquipmentMockMvc.perform(get("/api/equipment/{id}", equipment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(equipment.getId().intValue()))
            .andExpect(jsonPath("$.purchaseDate").value(DEFAULT_PURCHASE_DATE.toString()))
            .andExpect(jsonPath("$.equipmentName").value(DEFAULT_EQUIPMENT_NAME))
            .andExpect(jsonPath("$.technicalFeatures").value(DEFAULT_TECHNICAL_FEATURES))
            .andExpect(jsonPath("$.serialNumber").value(DEFAULT_SERIAL_NUMBER))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE));
    }
    @Test
    @Transactional
    public void getNonExistingEquipment() throws Exception {
        // Get the equipment
        restEquipmentMockMvc.perform(get("/api/equipment/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEquipment() throws Exception {
        // Initialize the database
        equipmentRepository.saveAndFlush(equipment);

        int databaseSizeBeforeUpdate = equipmentRepository.findAll().size();

        // Update the equipment
        Equipment updatedEquipment = equipmentRepository.findById(equipment.getId()).get();
        // Disconnect from session so that the updates on updatedEquipment are not directly saved in db
        em.detach(updatedEquipment);
        updatedEquipment
            .purchaseDate(UPDATED_PURCHASE_DATE)
            .equipmentName(UPDATED_EQUIPMENT_NAME)
            .technicalFeatures(UPDATED_TECHNICAL_FEATURES)
            .serialNumber(UPDATED_SERIAL_NUMBER)
            .note(UPDATED_NOTE);

        restEquipmentMockMvc.perform(put("/api/equipment")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedEquipment)))
            .andExpect(status().isOk());

        // Validate the Equipment in the database
        List<Equipment> equipmentList = equipmentRepository.findAll();
        assertThat(equipmentList).hasSize(databaseSizeBeforeUpdate);
        Equipment testEquipment = equipmentList.get(equipmentList.size() - 1);
        assertThat(testEquipment.getPurchaseDate()).isEqualTo(UPDATED_PURCHASE_DATE);
        assertThat(testEquipment.getEquipmentName()).isEqualTo(UPDATED_EQUIPMENT_NAME);
        assertThat(testEquipment.getTechnicalFeatures()).isEqualTo(UPDATED_TECHNICAL_FEATURES);
        assertThat(testEquipment.getSerialNumber()).isEqualTo(UPDATED_SERIAL_NUMBER);
        assertThat(testEquipment.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    public void updateNonExistingEquipment() throws Exception {
        int databaseSizeBeforeUpdate = equipmentRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEquipmentMockMvc.perform(put("/api/equipment")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipment)))
            .andExpect(status().isBadRequest());

        // Validate the Equipment in the database
        List<Equipment> equipmentList = equipmentRepository.findAll();
        assertThat(equipmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteEquipment() throws Exception {
        // Initialize the database
        equipmentRepository.saveAndFlush(equipment);

        int databaseSizeBeforeDelete = equipmentRepository.findAll().size();

        // Delete the equipment
        restEquipmentMockMvc.perform(delete("/api/equipment/{id}", equipment.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Equipment> equipmentList = equipmentRepository.findAll();
        assertThat(equipmentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
