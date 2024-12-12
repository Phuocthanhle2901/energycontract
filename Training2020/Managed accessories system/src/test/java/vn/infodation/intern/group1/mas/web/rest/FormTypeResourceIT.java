package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.ManagedAccessoriesSystemApp;
import vn.infodation.intern.group1.mas.domain.FormType;
import vn.infodation.intern.group1.mas.repository.FormTypeRepository;

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
 * Integration tests for the {@link FormTypeResource} REST controller.
 */
@SpringBootTest(classes = ManagedAccessoriesSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class FormTypeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private FormTypeRepository formTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFormTypeMockMvc;

    private FormType formType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormType createEntity(EntityManager em) {
        FormType formType = new FormType()
            .name(DEFAULT_NAME);
        return formType;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormType createUpdatedEntity(EntityManager em) {
        FormType formType = new FormType()
            .name(UPDATED_NAME);
        return formType;
    }

    @BeforeEach
    public void initTest() {
        formType = createEntity(em);
    }

    @Test
    @Transactional
    public void createFormType() throws Exception {
        int databaseSizeBeforeCreate = formTypeRepository.findAll().size();
        // Create the FormType
        restFormTypeMockMvc.perform(post("/api/form-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(formType)))
            .andExpect(status().isCreated());

        // Validate the FormType in the database
        List<FormType> formTypeList = formTypeRepository.findAll();
        assertThat(formTypeList).hasSize(databaseSizeBeforeCreate + 1);
        FormType testFormType = formTypeList.get(formTypeList.size() - 1);
        assertThat(testFormType.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createFormTypeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = formTypeRepository.findAll().size();

        // Create the FormType with an existing ID
        formType.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFormTypeMockMvc.perform(post("/api/form-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(formType)))
            .andExpect(status().isBadRequest());

        // Validate the FormType in the database
        List<FormType> formTypeList = formTypeRepository.findAll();
        assertThat(formTypeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = formTypeRepository.findAll().size();
        // set the field null
        formType.setName(null);

        // Create the FormType, which fails.


        restFormTypeMockMvc.perform(post("/api/form-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(formType)))
            .andExpect(status().isBadRequest());

        List<FormType> formTypeList = formTypeRepository.findAll();
        assertThat(formTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllFormTypes() throws Exception {
        // Initialize the database
        formTypeRepository.saveAndFlush(formType);

        // Get all the formTypeList
        restFormTypeMockMvc.perform(get("/api/form-types?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(formType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }
    
    @Test
    @Transactional
    public void getFormType() throws Exception {
        // Initialize the database
        formTypeRepository.saveAndFlush(formType);

        // Get the formType
        restFormTypeMockMvc.perform(get("/api/form-types/{id}", formType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(formType.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }
    @Test
    @Transactional
    public void getNonExistingFormType() throws Exception {
        // Get the formType
        restFormTypeMockMvc.perform(get("/api/form-types/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFormType() throws Exception {
        // Initialize the database
        formTypeRepository.saveAndFlush(formType);

        int databaseSizeBeforeUpdate = formTypeRepository.findAll().size();

        // Update the formType
        FormType updatedFormType = formTypeRepository.findById(formType.getId()).get();
        // Disconnect from session so that the updates on updatedFormType are not directly saved in db
        em.detach(updatedFormType);
        updatedFormType
            .name(UPDATED_NAME);

        restFormTypeMockMvc.perform(put("/api/form-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedFormType)))
            .andExpect(status().isOk());

        // Validate the FormType in the database
        List<FormType> formTypeList = formTypeRepository.findAll();
        assertThat(formTypeList).hasSize(databaseSizeBeforeUpdate);
        FormType testFormType = formTypeList.get(formTypeList.size() - 1);
        assertThat(testFormType.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingFormType() throws Exception {
        int databaseSizeBeforeUpdate = formTypeRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormTypeMockMvc.perform(put("/api/form-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(formType)))
            .andExpect(status().isBadRequest());

        // Validate the FormType in the database
        List<FormType> formTypeList = formTypeRepository.findAll();
        assertThat(formTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteFormType() throws Exception {
        // Initialize the database
        formTypeRepository.saveAndFlush(formType);

        int databaseSizeBeforeDelete = formTypeRepository.findAll().size();

        // Delete the formType
        restFormTypeMockMvc.perform(delete("/api/form-types/{id}", formType.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FormType> formTypeList = formTypeRepository.findAll();
        assertThat(formTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
