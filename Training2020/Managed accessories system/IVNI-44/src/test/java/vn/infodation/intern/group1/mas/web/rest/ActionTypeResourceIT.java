package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.ManagedAccessoriesSystemApp;
import vn.infodation.intern.group1.mas.domain.ActionType;
import vn.infodation.intern.group1.mas.repository.ActionTypeRepository;

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
 * Integration tests for the {@link ActionTypeResource} REST controller.
 */
@SpringBootTest(classes = ManagedAccessoriesSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class ActionTypeResourceIT {

    private static final String DEFAULT_ACTION_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_ACTION_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private ActionTypeRepository actionTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActionTypeMockMvc;

    private ActionType actionType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActionType createEntity(EntityManager em) {
        ActionType actionType = new ActionType()
            .actionTitle(DEFAULT_ACTION_TITLE)
            .description(DEFAULT_DESCRIPTION);
        return actionType;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActionType createUpdatedEntity(EntityManager em) {
        ActionType actionType = new ActionType()
            .actionTitle(UPDATED_ACTION_TITLE)
            .description(UPDATED_DESCRIPTION);
        return actionType;
    }

    @BeforeEach
    public void initTest() {
        actionType = createEntity(em);
    }

    @Test
    @Transactional
    public void createActionType() throws Exception {
        int databaseSizeBeforeCreate = actionTypeRepository.findAll().size();
        // Create the ActionType
        restActionTypeMockMvc.perform(post("/api/action-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(actionType)))
            .andExpect(status().isCreated());

        // Validate the ActionType in the database
        List<ActionType> actionTypeList = actionTypeRepository.findAll();
        assertThat(actionTypeList).hasSize(databaseSizeBeforeCreate + 1);
        ActionType testActionType = actionTypeList.get(actionTypeList.size() - 1);
        assertThat(testActionType.getActionTitle()).isEqualTo(DEFAULT_ACTION_TITLE);
        assertThat(testActionType.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createActionTypeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = actionTypeRepository.findAll().size();

        // Create the ActionType with an existing ID
        actionType.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restActionTypeMockMvc.perform(post("/api/action-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(actionType)))
            .andExpect(status().isBadRequest());

        // Validate the ActionType in the database
        List<ActionType> actionTypeList = actionTypeRepository.findAll();
        assertThat(actionTypeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkActionTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = actionTypeRepository.findAll().size();
        // set the field null
        actionType.setActionTitle(null);

        // Create the ActionType, which fails.


        restActionTypeMockMvc.perform(post("/api/action-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(actionType)))
            .andExpect(status().isBadRequest());

        List<ActionType> actionTypeList = actionTypeRepository.findAll();
        assertThat(actionTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = actionTypeRepository.findAll().size();
        // set the field null
        actionType.setDescription(null);

        // Create the ActionType, which fails.


        restActionTypeMockMvc.perform(post("/api/action-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(actionType)))
            .andExpect(status().isBadRequest());

        List<ActionType> actionTypeList = actionTypeRepository.findAll();
        assertThat(actionTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllActionTypes() throws Exception {
        // Initialize the database
        actionTypeRepository.saveAndFlush(actionType);

        // Get all the actionTypeList
        restActionTypeMockMvc.perform(get("/api/action-types?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(actionType.getId().intValue())))
            .andExpect(jsonPath("$.[*].actionTitle").value(hasItem(DEFAULT_ACTION_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }
    
    @Test
    @Transactional
    public void getActionType() throws Exception {
        // Initialize the database
        actionTypeRepository.saveAndFlush(actionType);

        // Get the actionType
        restActionTypeMockMvc.perform(get("/api/action-types/{id}", actionType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(actionType.getId().intValue()))
            .andExpect(jsonPath("$.actionTitle").value(DEFAULT_ACTION_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }
    @Test
    @Transactional
    public void getNonExistingActionType() throws Exception {
        // Get the actionType
        restActionTypeMockMvc.perform(get("/api/action-types/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateActionType() throws Exception {
        // Initialize the database
        actionTypeRepository.saveAndFlush(actionType);

        int databaseSizeBeforeUpdate = actionTypeRepository.findAll().size();

        // Update the actionType
        ActionType updatedActionType = actionTypeRepository.findById(actionType.getId()).get();
        // Disconnect from session so that the updates on updatedActionType are not directly saved in db
        em.detach(updatedActionType);
        updatedActionType
            .actionTitle(UPDATED_ACTION_TITLE)
            .description(UPDATED_DESCRIPTION);

        restActionTypeMockMvc.perform(put("/api/action-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedActionType)))
            .andExpect(status().isOk());

        // Validate the ActionType in the database
        List<ActionType> actionTypeList = actionTypeRepository.findAll();
        assertThat(actionTypeList).hasSize(databaseSizeBeforeUpdate);
        ActionType testActionType = actionTypeList.get(actionTypeList.size() - 1);
        assertThat(testActionType.getActionTitle()).isEqualTo(UPDATED_ACTION_TITLE);
        assertThat(testActionType.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingActionType() throws Exception {
        int databaseSizeBeforeUpdate = actionTypeRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActionTypeMockMvc.perform(put("/api/action-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(actionType)))
            .andExpect(status().isBadRequest());

        // Validate the ActionType in the database
        List<ActionType> actionTypeList = actionTypeRepository.findAll();
        assertThat(actionTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteActionType() throws Exception {
        // Initialize the database
        actionTypeRepository.saveAndFlush(actionType);

        int databaseSizeBeforeDelete = actionTypeRepository.findAll().size();

        // Delete the actionType
        restActionTypeMockMvc.perform(delete("/api/action-types/{id}", actionType.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActionType> actionTypeList = actionTypeRepository.findAll();
        assertThat(actionTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
