package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.ManagedAccessoriesSystemApp;
import vn.infodation.intern.group1.mas.domain.PlaceToPerform;
import vn.infodation.intern.group1.mas.repository.PlaceToPerformRepository;

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
 * Integration tests for the {@link PlaceToPerformResource} REST controller.
 */
@SpringBootTest(classes = ManagedAccessoriesSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class PlaceToPerformResourceIT {

    private static final String DEFAULT_PLACE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_PLACE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final Instant DEFAULT_REPRESENTATIVE_NAME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_REPRESENTATIVE_NAME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private PlaceToPerformRepository placeToPerformRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlaceToPerformMockMvc;

    private PlaceToPerform placeToPerform;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PlaceToPerform createEntity(EntityManager em) {
        PlaceToPerform placeToPerform = new PlaceToPerform()
            .placeName(DEFAULT_PLACE_NAME)
            .address(DEFAULT_ADDRESS)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .email(DEFAULT_EMAIL)
            .representativeName(DEFAULT_REPRESENTATIVE_NAME);
        return placeToPerform;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PlaceToPerform createUpdatedEntity(EntityManager em) {
        PlaceToPerform placeToPerform = new PlaceToPerform()
            .placeName(UPDATED_PLACE_NAME)
            .address(UPDATED_ADDRESS)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .email(UPDATED_EMAIL)
            .representativeName(UPDATED_REPRESENTATIVE_NAME);
        return placeToPerform;
    }

    @BeforeEach
    public void initTest() {
        placeToPerform = createEntity(em);
    }

    @Test
    @Transactional
    public void createPlaceToPerform() throws Exception {
        int databaseSizeBeforeCreate = placeToPerformRepository.findAll().size();
        // Create the PlaceToPerform
        restPlaceToPerformMockMvc.perform(post("/api/place-to-performs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(placeToPerform)))
            .andExpect(status().isCreated());

        // Validate the PlaceToPerform in the database
        List<PlaceToPerform> placeToPerformList = placeToPerformRepository.findAll();
        assertThat(placeToPerformList).hasSize(databaseSizeBeforeCreate + 1);
        PlaceToPerform testPlaceToPerform = placeToPerformList.get(placeToPerformList.size() - 1);
        assertThat(testPlaceToPerform.getPlaceName()).isEqualTo(DEFAULT_PLACE_NAME);
        assertThat(testPlaceToPerform.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testPlaceToPerform.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testPlaceToPerform.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testPlaceToPerform.getRepresentativeName()).isEqualTo(DEFAULT_REPRESENTATIVE_NAME);
    }

    @Test
    @Transactional
    public void createPlaceToPerformWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = placeToPerformRepository.findAll().size();

        // Create the PlaceToPerform with an existing ID
        placeToPerform.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlaceToPerformMockMvc.perform(post("/api/place-to-performs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(placeToPerform)))
            .andExpect(status().isBadRequest());

        // Validate the PlaceToPerform in the database
        List<PlaceToPerform> placeToPerformList = placeToPerformRepository.findAll();
        assertThat(placeToPerformList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkPlaceNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = placeToPerformRepository.findAll().size();
        // set the field null
        placeToPerform.setPlaceName(null);

        // Create the PlaceToPerform, which fails.


        restPlaceToPerformMockMvc.perform(post("/api/place-to-performs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(placeToPerform)))
            .andExpect(status().isBadRequest());

        List<PlaceToPerform> placeToPerformList = placeToPerformRepository.findAll();
        assertThat(placeToPerformList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = placeToPerformRepository.findAll().size();
        // set the field null
        placeToPerform.setAddress(null);

        // Create the PlaceToPerform, which fails.


        restPlaceToPerformMockMvc.perform(post("/api/place-to-performs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(placeToPerform)))
            .andExpect(status().isBadRequest());

        List<PlaceToPerform> placeToPerformList = placeToPerformRepository.findAll();
        assertThat(placeToPerformList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPhoneNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = placeToPerformRepository.findAll().size();
        // set the field null
        placeToPerform.setPhoneNumber(null);

        // Create the PlaceToPerform, which fails.


        restPlaceToPerformMockMvc.perform(post("/api/place-to-performs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(placeToPerform)))
            .andExpect(status().isBadRequest());

        List<PlaceToPerform> placeToPerformList = placeToPerformRepository.findAll();
        assertThat(placeToPerformList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = placeToPerformRepository.findAll().size();
        // set the field null
        placeToPerform.setEmail(null);

        // Create the PlaceToPerform, which fails.


        restPlaceToPerformMockMvc.perform(post("/api/place-to-performs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(placeToPerform)))
            .andExpect(status().isBadRequest());

        List<PlaceToPerform> placeToPerformList = placeToPerformRepository.findAll();
        assertThat(placeToPerformList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkRepresentativeNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = placeToPerformRepository.findAll().size();
        // set the field null
        placeToPerform.setRepresentativeName(null);

        // Create the PlaceToPerform, which fails.


        restPlaceToPerformMockMvc.perform(post("/api/place-to-performs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(placeToPerform)))
            .andExpect(status().isBadRequest());

        List<PlaceToPerform> placeToPerformList = placeToPerformRepository.findAll();
        assertThat(placeToPerformList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPlaceToPerforms() throws Exception {
        // Initialize the database
        placeToPerformRepository.saveAndFlush(placeToPerform);

        // Get all the placeToPerformList
        restPlaceToPerformMockMvc.perform(get("/api/place-to-performs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(placeToPerform.getId().intValue())))
            .andExpect(jsonPath("$.[*].placeName").value(hasItem(DEFAULT_PLACE_NAME)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].representativeName").value(hasItem(DEFAULT_REPRESENTATIVE_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getPlaceToPerform() throws Exception {
        // Initialize the database
        placeToPerformRepository.saveAndFlush(placeToPerform);

        // Get the placeToPerform
        restPlaceToPerformMockMvc.perform(get("/api/place-to-performs/{id}", placeToPerform.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(placeToPerform.getId().intValue()))
            .andExpect(jsonPath("$.placeName").value(DEFAULT_PLACE_NAME))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.representativeName").value(DEFAULT_REPRESENTATIVE_NAME.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingPlaceToPerform() throws Exception {
        // Get the placeToPerform
        restPlaceToPerformMockMvc.perform(get("/api/place-to-performs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePlaceToPerform() throws Exception {
        // Initialize the database
        placeToPerformRepository.saveAndFlush(placeToPerform);

        int databaseSizeBeforeUpdate = placeToPerformRepository.findAll().size();

        // Update the placeToPerform
        PlaceToPerform updatedPlaceToPerform = placeToPerformRepository.findById(placeToPerform.getId()).get();
        // Disconnect from session so that the updates on updatedPlaceToPerform are not directly saved in db
        em.detach(updatedPlaceToPerform);
        updatedPlaceToPerform
            .placeName(UPDATED_PLACE_NAME)
            .address(UPDATED_ADDRESS)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .email(UPDATED_EMAIL)
            .representativeName(UPDATED_REPRESENTATIVE_NAME);

        restPlaceToPerformMockMvc.perform(put("/api/place-to-performs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedPlaceToPerform)))
            .andExpect(status().isOk());

        // Validate the PlaceToPerform in the database
        List<PlaceToPerform> placeToPerformList = placeToPerformRepository.findAll();
        assertThat(placeToPerformList).hasSize(databaseSizeBeforeUpdate);
        PlaceToPerform testPlaceToPerform = placeToPerformList.get(placeToPerformList.size() - 1);
        assertThat(testPlaceToPerform.getPlaceName()).isEqualTo(UPDATED_PLACE_NAME);
        assertThat(testPlaceToPerform.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testPlaceToPerform.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testPlaceToPerform.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testPlaceToPerform.getRepresentativeName()).isEqualTo(UPDATED_REPRESENTATIVE_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingPlaceToPerform() throws Exception {
        int databaseSizeBeforeUpdate = placeToPerformRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlaceToPerformMockMvc.perform(put("/api/place-to-performs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(placeToPerform)))
            .andExpect(status().isBadRequest());

        // Validate the PlaceToPerform in the database
        List<PlaceToPerform> placeToPerformList = placeToPerformRepository.findAll();
        assertThat(placeToPerformList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePlaceToPerform() throws Exception {
        // Initialize the database
        placeToPerformRepository.saveAndFlush(placeToPerform);

        int databaseSizeBeforeDelete = placeToPerformRepository.findAll().size();

        // Delete the placeToPerform
        restPlaceToPerformMockMvc.perform(delete("/api/place-to-performs/{id}", placeToPerform.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PlaceToPerform> placeToPerformList = placeToPerformRepository.findAll();
        assertThat(placeToPerformList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
