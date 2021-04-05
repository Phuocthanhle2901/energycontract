package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.ManagedAccessoriesSystemApp;
import vn.infodation.intern.group1.mas.domain.StatusType;
import vn.infodation.intern.group1.mas.repository.StatusTypeRepository;

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
 * Integration tests for the {@link StatusTypeResource} REST controller.
 */
@SpringBootTest(classes = ManagedAccessoriesSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class StatusTypeResourceIT {

    private static final String DEFAULT_STATUS_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_STATUS_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private StatusTypeRepository statusTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStatusTypeMockMvc;

    private StatusType statusType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StatusType createEntity(EntityManager em) {
        StatusType statusType = new StatusType()
            .statusTitle(DEFAULT_STATUS_TITLE)
            .description(DEFAULT_DESCRIPTION);
        return statusType;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StatusType createUpdatedEntity(EntityManager em) {
        StatusType statusType = new StatusType()
            .statusTitle(UPDATED_STATUS_TITLE)
            .description(UPDATED_DESCRIPTION);
        return statusType;
    }

    @BeforeEach
    public void initTest() {
        statusType = createEntity(em);
    }

    @Test
    @Transactional
    public void createStatusType() throws Exception {
        int databaseSizeBeforeCreate = statusTypeRepository.findAll().size();
        // Create the StatusType
        restStatusTypeMockMvc.perform(post("/api/status-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(statusType)))
            .andExpect(status().isCreated());

        // Validate the StatusType in the database
        List<StatusType> statusTypeList = statusTypeRepository.findAll();
        assertThat(statusTypeList).hasSize(databaseSizeBeforeCreate + 1);
        StatusType testStatusType = statusTypeList.get(statusTypeList.size() - 1);
        assertThat(testStatusType.getStatusTitle()).isEqualTo(DEFAULT_STATUS_TITLE);
        assertThat(testStatusType.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createStatusTypeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = statusTypeRepository.findAll().size();

        // Create the StatusType with an existing ID
        statusType.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restStatusTypeMockMvc.perform(post("/api/status-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(statusType)))
            .andExpect(status().isBadRequest());

        // Validate the StatusType in the database
        List<StatusType> statusTypeList = statusTypeRepository.findAll();
        assertThat(statusTypeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkStatusTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = statusTypeRepository.findAll().size();
        // set the field null
        statusType.setStatusTitle(null);

        // Create the StatusType, which fails.


        restStatusTypeMockMvc.perform(post("/api/status-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(statusType)))
            .andExpect(status().isBadRequest());

        List<StatusType> statusTypeList = statusTypeRepository.findAll();
        assertThat(statusTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = statusTypeRepository.findAll().size();
        // set the field null
        statusType.setDescription(null);

        // Create the StatusType, which fails.


        restStatusTypeMockMvc.perform(post("/api/status-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(statusType)))
            .andExpect(status().isBadRequest());

        List<StatusType> statusTypeList = statusTypeRepository.findAll();
        assertThat(statusTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllStatusTypes() throws Exception {
        // Initialize the database
        statusTypeRepository.saveAndFlush(statusType);

        // Get all the statusTypeList
        restStatusTypeMockMvc.perform(get("/api/status-types?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(statusType.getId().intValue())))
            .andExpect(jsonPath("$.[*].statusTitle").value(hasItem(DEFAULT_STATUS_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }
    
    @Test
    @Transactional
    public void getStatusType() throws Exception {
        // Initialize the database
        statusTypeRepository.saveAndFlush(statusType);

        // Get the statusType
        restStatusTypeMockMvc.perform(get("/api/status-types/{id}", statusType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(statusType.getId().intValue()))
            .andExpect(jsonPath("$.statusTitle").value(DEFAULT_STATUS_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }
    @Test
    @Transactional
    public void getNonExistingStatusType() throws Exception {
        // Get the statusType
        restStatusTypeMockMvc.perform(get("/api/status-types/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateStatusType() throws Exception {
        // Initialize the database
        statusTypeRepository.saveAndFlush(statusType);

        int databaseSizeBeforeUpdate = statusTypeRepository.findAll().size();

        // Update the statusType
        StatusType updatedStatusType = statusTypeRepository.findById(statusType.getId()).get();
        // Disconnect from session so that the updates on updatedStatusType are not directly saved in db
        em.detach(updatedStatusType);
        updatedStatusType
            .statusTitle(UPDATED_STATUS_TITLE)
            .description(UPDATED_DESCRIPTION);

        restStatusTypeMockMvc.perform(put("/api/status-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedStatusType)))
            .andExpect(status().isOk());

        // Validate the StatusType in the database
        List<StatusType> statusTypeList = statusTypeRepository.findAll();
        assertThat(statusTypeList).hasSize(databaseSizeBeforeUpdate);
        StatusType testStatusType = statusTypeList.get(statusTypeList.size() - 1);
        assertThat(testStatusType.getStatusTitle()).isEqualTo(UPDATED_STATUS_TITLE);
        assertThat(testStatusType.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingStatusType() throws Exception {
        int databaseSizeBeforeUpdate = statusTypeRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStatusTypeMockMvc.perform(put("/api/status-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(statusType)))
            .andExpect(status().isBadRequest());

        // Validate the StatusType in the database
        List<StatusType> statusTypeList = statusTypeRepository.findAll();
        assertThat(statusTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteStatusType() throws Exception {
        // Initialize the database
        statusTypeRepository.saveAndFlush(statusType);

        int databaseSizeBeforeDelete = statusTypeRepository.findAll().size();

        // Delete the statusType
        restStatusTypeMockMvc.perform(delete("/api/status-types/{id}", statusType.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StatusType> statusTypeList = statusTypeRepository.findAll();
        assertThat(statusTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
