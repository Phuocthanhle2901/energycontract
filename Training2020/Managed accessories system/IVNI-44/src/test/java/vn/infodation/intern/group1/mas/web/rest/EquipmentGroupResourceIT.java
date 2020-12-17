package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.ManagedAccessoriesSystemApp;
import vn.infodation.intern.group1.mas.domain.EquipmentGroup;
import vn.infodation.intern.group1.mas.repository.EquipmentGroupRepository;

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
 * Integration tests for the {@link EquipmentGroupResource} REST controller.
 */
@SpringBootTest(classes = ManagedAccessoriesSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class EquipmentGroupResourceIT {

    private static final String DEFAULT_EQUIPMENT_GROUP_NAME = "AAAAAAAAAA";
    private static final String UPDATED_EQUIPMENT_GROUP_NAME = "BBBBBBBBBB";

    @Autowired
    private EquipmentGroupRepository equipmentGroupRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEquipmentGroupMockMvc;

    private EquipmentGroup equipmentGroup;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EquipmentGroup createEntity(EntityManager em) {
        EquipmentGroup equipmentGroup = new EquipmentGroup()
            .equipmentGroupName(DEFAULT_EQUIPMENT_GROUP_NAME);
        return equipmentGroup;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EquipmentGroup createUpdatedEntity(EntityManager em) {
        EquipmentGroup equipmentGroup = new EquipmentGroup()
            .equipmentGroupName(UPDATED_EQUIPMENT_GROUP_NAME);
        return equipmentGroup;
    }

    @BeforeEach
    public void initTest() {
        equipmentGroup = createEntity(em);
    }

    @Test
    @Transactional
    public void createEquipmentGroup() throws Exception {
        int databaseSizeBeforeCreate = equipmentGroupRepository.findAll().size();
        // Create the EquipmentGroup
        restEquipmentGroupMockMvc.perform(post("/api/equipment-groups")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipmentGroup)))
            .andExpect(status().isCreated());

        // Validate the EquipmentGroup in the database
        List<EquipmentGroup> equipmentGroupList = equipmentGroupRepository.findAll();
        assertThat(equipmentGroupList).hasSize(databaseSizeBeforeCreate + 1);
        EquipmentGroup testEquipmentGroup = equipmentGroupList.get(equipmentGroupList.size() - 1);
        assertThat(testEquipmentGroup.getEquipmentGroupName()).isEqualTo(DEFAULT_EQUIPMENT_GROUP_NAME);
    }

    @Test
    @Transactional
    public void createEquipmentGroupWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = equipmentGroupRepository.findAll().size();

        // Create the EquipmentGroup with an existing ID
        equipmentGroup.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEquipmentGroupMockMvc.perform(post("/api/equipment-groups")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipmentGroup)))
            .andExpect(status().isBadRequest());

        // Validate the EquipmentGroup in the database
        List<EquipmentGroup> equipmentGroupList = equipmentGroupRepository.findAll();
        assertThat(equipmentGroupList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkEquipmentGroupNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = equipmentGroupRepository.findAll().size();
        // set the field null
        equipmentGroup.setEquipmentGroupName(null);

        // Create the EquipmentGroup, which fails.


        restEquipmentGroupMockMvc.perform(post("/api/equipment-groups")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipmentGroup)))
            .andExpect(status().isBadRequest());

        List<EquipmentGroup> equipmentGroupList = equipmentGroupRepository.findAll();
        assertThat(equipmentGroupList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEquipmentGroups() throws Exception {
        // Initialize the database
        equipmentGroupRepository.saveAndFlush(equipmentGroup);

        // Get all the equipmentGroupList
        restEquipmentGroupMockMvc.perform(get("/api/equipment-groups?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(equipmentGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].equipmentGroupName").value(hasItem(DEFAULT_EQUIPMENT_GROUP_NAME)));
    }
    
    @Test
    @Transactional
    public void getEquipmentGroup() throws Exception {
        // Initialize the database
        equipmentGroupRepository.saveAndFlush(equipmentGroup);

        // Get the equipmentGroup
        restEquipmentGroupMockMvc.perform(get("/api/equipment-groups/{id}", equipmentGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(equipmentGroup.getId().intValue()))
            .andExpect(jsonPath("$.equipmentGroupName").value(DEFAULT_EQUIPMENT_GROUP_NAME));
    }
    @Test
    @Transactional
    public void getNonExistingEquipmentGroup() throws Exception {
        // Get the equipmentGroup
        restEquipmentGroupMockMvc.perform(get("/api/equipment-groups/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEquipmentGroup() throws Exception {
        // Initialize the database
        equipmentGroupRepository.saveAndFlush(equipmentGroup);

        int databaseSizeBeforeUpdate = equipmentGroupRepository.findAll().size();

        // Update the equipmentGroup
        EquipmentGroup updatedEquipmentGroup = equipmentGroupRepository.findById(equipmentGroup.getId()).get();
        // Disconnect from session so that the updates on updatedEquipmentGroup are not directly saved in db
        em.detach(updatedEquipmentGroup);
        updatedEquipmentGroup
            .equipmentGroupName(UPDATED_EQUIPMENT_GROUP_NAME);

        restEquipmentGroupMockMvc.perform(put("/api/equipment-groups")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedEquipmentGroup)))
            .andExpect(status().isOk());

        // Validate the EquipmentGroup in the database
        List<EquipmentGroup> equipmentGroupList = equipmentGroupRepository.findAll();
        assertThat(equipmentGroupList).hasSize(databaseSizeBeforeUpdate);
        EquipmentGroup testEquipmentGroup = equipmentGroupList.get(equipmentGroupList.size() - 1);
        assertThat(testEquipmentGroup.getEquipmentGroupName()).isEqualTo(UPDATED_EQUIPMENT_GROUP_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingEquipmentGroup() throws Exception {
        int databaseSizeBeforeUpdate = equipmentGroupRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEquipmentGroupMockMvc.perform(put("/api/equipment-groups")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipmentGroup)))
            .andExpect(status().isBadRequest());

        // Validate the EquipmentGroup in the database
        List<EquipmentGroup> equipmentGroupList = equipmentGroupRepository.findAll();
        assertThat(equipmentGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteEquipmentGroup() throws Exception {
        // Initialize the database
        equipmentGroupRepository.saveAndFlush(equipmentGroup);

        int databaseSizeBeforeDelete = equipmentGroupRepository.findAll().size();

        // Delete the equipmentGroup
        restEquipmentGroupMockMvc.perform(delete("/api/equipment-groups/{id}", equipmentGroup.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EquipmentGroup> equipmentGroupList = equipmentGroupRepository.findAll();
        assertThat(equipmentGroupList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
