package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.ManagedAccessoriesSystemApp;
import vn.infodation.intern.group1.mas.domain.EquipmentType;
import vn.infodation.intern.group1.mas.repository.EquipmentTypeRepository;

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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link EquipmentTypeResource} REST controller.
 */
@SpringBootTest(classes = ManagedAccessoriesSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class EquipmentTypeResourceIT {

    private static final String DEFAULT_EQUIPMENT_TYPE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_EQUIPMENT_TYPE_NAME = "BBBBBBBBBB";

    @Autowired
    private EquipmentTypeRepository equipmentTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEquipmentTypeMockMvc;

    private EquipmentType equipmentType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EquipmentType createEntity(EntityManager em) {
        EquipmentType equipmentType = new EquipmentType()
            .equipmentTypeName(DEFAULT_EQUIPMENT_TYPE_NAME);
        return equipmentType;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EquipmentType createUpdatedEntity(EntityManager em) {
        EquipmentType equipmentType = new EquipmentType()
            .equipmentTypeName(UPDATED_EQUIPMENT_TYPE_NAME);
        return equipmentType;
    }

    @BeforeEach
    public void initTest() {
        equipmentType = createEntity(em);
    }

    @Test
    @Transactional
    public void createEquipmentType() throws Exception {
        int databaseSizeBeforeCreate = equipmentTypeRepository.findAll().size();
        // Create the EquipmentType
        restEquipmentTypeMockMvc.perform(post("/api/equipment-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipmentType)))
            .andExpect(status().isCreated());

        // Validate the EquipmentType in the database
        List<EquipmentType> equipmentTypeList = equipmentTypeRepository.findAll();
        assertThat(equipmentTypeList).hasSize(databaseSizeBeforeCreate + 1);
        EquipmentType testEquipmentType = equipmentTypeList.get(equipmentTypeList.size() - 1);
        assertThat(testEquipmentType.getEquipmentTypeName()).isEqualTo(DEFAULT_EQUIPMENT_TYPE_NAME);
    }

    @Test
    @Transactional
    public void createEquipmentTypeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = equipmentTypeRepository.findAll().size();

        // Create the EquipmentType with an existing ID
        equipmentType.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEquipmentTypeMockMvc.perform(post("/api/equipment-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipmentType)))
            .andExpect(status().isBadRequest());

        // Validate the EquipmentType in the database
        List<EquipmentType> equipmentTypeList = equipmentTypeRepository.findAll();
        assertThat(equipmentTypeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkEquipmentTypeNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = equipmentTypeRepository.findAll().size();
        // set the field null
        equipmentType.setEquipmentTypeName(null);

        // Create the EquipmentType, which fails.


        restEquipmentTypeMockMvc.perform(post("/api/equipment-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipmentType)))
            .andExpect(status().isBadRequest());

        List<EquipmentType> equipmentTypeList = equipmentTypeRepository.findAll();
        assertThat(equipmentTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEquipmentTypes() throws Exception {
        // Initialize the database
        equipmentTypeRepository.saveAndFlush(equipmentType);

        // Get all the equipmentTypeList
        restEquipmentTypeMockMvc.perform(get("/api/equipment-types?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(equipmentType.getId().intValue())))
            .andExpect(jsonPath("$.[*].equipmentTypeName").value(hasItem(DEFAULT_EQUIPMENT_TYPE_NAME)));
    }
    
    @Test
    @Transactional
    public void getEquipmentType() throws Exception {
        // Initialize the database
        equipmentTypeRepository.saveAndFlush(equipmentType);

        // Get the equipmentType
        restEquipmentTypeMockMvc.perform(get("/api/equipment-types/{id}", equipmentType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(equipmentType.getId().intValue()))
            .andExpect(jsonPath("$.equipmentTypeName").value(DEFAULT_EQUIPMENT_TYPE_NAME));
    }
    @Test
    @Transactional
    public void getNonExistingEquipmentType() throws Exception {
        // Get the equipmentType
        restEquipmentTypeMockMvc.perform(get("/api/equipment-types/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEquipmentType() throws Exception {
        // Initialize the database
        equipmentTypeRepository.saveAndFlush(equipmentType);

        int databaseSizeBeforeUpdate = equipmentTypeRepository.findAll().size();

        // Update the equipmentType
        EquipmentType updatedEquipmentType = equipmentTypeRepository.findById(equipmentType.getId()).get();
        // Disconnect from session so that the updates on updatedEquipmentType are not directly saved in db
        em.detach(updatedEquipmentType);
        updatedEquipmentType
            .equipmentTypeName(UPDATED_EQUIPMENT_TYPE_NAME);

        restEquipmentTypeMockMvc.perform(put("/api/equipment-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedEquipmentType)))
            .andExpect(status().isOk());

        // Validate the EquipmentType in the database
        List<EquipmentType> equipmentTypeList = equipmentTypeRepository.findAll();
        assertThat(equipmentTypeList).hasSize(databaseSizeBeforeUpdate);
        EquipmentType testEquipmentType = equipmentTypeList.get(equipmentTypeList.size() - 1);
        assertThat(testEquipmentType.getEquipmentTypeName()).isEqualTo(UPDATED_EQUIPMENT_TYPE_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingEquipmentType() throws Exception {
        int databaseSizeBeforeUpdate = equipmentTypeRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEquipmentTypeMockMvc.perform(put("/api/equipment-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipmentType)))
            .andExpect(status().isBadRequest());

        // Validate the EquipmentType in the database
        List<EquipmentType> equipmentTypeList = equipmentTypeRepository.findAll();
        assertThat(equipmentTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteEquipmentType() throws Exception {
        // Initialize the database
        equipmentTypeRepository.saveAndFlush(equipmentType);

        int databaseSizeBeforeDelete = equipmentTypeRepository.findAll().size();

        // Delete the equipmentType
        restEquipmentTypeMockMvc.perform(delete("/api/equipment-types/{id}", equipmentType.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EquipmentType> equipmentTypeList = equipmentTypeRepository.findAll();
        assertThat(equipmentTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
