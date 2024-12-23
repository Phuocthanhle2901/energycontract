package intern.team3.obmr.web.rest;

import static intern.team3.obmr.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import intern.team3.obmr.IntegrationTest;
import intern.team3.obmr.domain.AppUsers;
import intern.team3.obmr.repository.AppUsersRepository;
import intern.team3.obmr.service.AppUsersService;
import intern.team3.obmr.service.dto.AppUsersDTO;
import intern.team3.obmr.service.mapper.AppUsersMapper;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AppUsersResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AppUsersResourceIT {

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_PASSWORD = "AAAAAAAAAA";
    private static final String UPDATED_PASSWORD = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_RESET_TOKEN = "AAAAAAAAAA";
    private static final String UPDATED_RESET_TOKEN = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_RESET_TOKEN_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_RESET_TOKEN_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_OTP_CODE = "AAAAAAAAAA";
    private static final String UPDATED_OTP_CODE = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_OTP_CODE_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_OTP_CODE_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_OTP_CODE_EXPIRED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_OTP_CODE_EXPIRED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Boolean DEFAULT_OTP_IS_VERIFIED = false;
    private static final Boolean UPDATED_OTP_IS_VERIFIED = true;

    private static final String DEFAULT_REMEMBER_TOKEN = "AAAAAAAAAA";
    private static final String UPDATED_REMEMBER_TOKEN = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_REMEMBERED = false;
    private static final Boolean UPDATED_IS_REMEMBERED = true;

    private static final String DEFAULT_DEVICE_INFO = "AAAAAAAAAA";
    private static final String UPDATED_DEVICE_INFO = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/app-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AppUsersRepository appUsersRepository;

    @Mock
    private AppUsersRepository appUsersRepositoryMock;

    @Autowired
    private AppUsersMapper appUsersMapper;

    @Mock
    private AppUsersService appUsersServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAppUsersMockMvc;

    private AppUsers appUsers;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppUsers createEntity(EntityManager em) {
        AppUsers appUsers = new AppUsers()
            .username(DEFAULT_USERNAME)
            .password(DEFAULT_PASSWORD)
            .email(DEFAULT_EMAIL)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .resetToken(DEFAULT_RESET_TOKEN)
            .resetTokenCreatedAt(DEFAULT_RESET_TOKEN_CREATED_AT)
            .otpCode(DEFAULT_OTP_CODE)
            .otpCodeCreatedAt(DEFAULT_OTP_CODE_CREATED_AT)
            .otpCodeExpiredAt(DEFAULT_OTP_CODE_EXPIRED_AT)
            .otpIsVerified(DEFAULT_OTP_IS_VERIFIED)
            .rememberToken(DEFAULT_REMEMBER_TOKEN)
            .isRemembered(DEFAULT_IS_REMEMBERED)
            .deviceInfo(DEFAULT_DEVICE_INFO)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .status(DEFAULT_STATUS);
        return appUsers;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppUsers createUpdatedEntity(EntityManager em) {
        AppUsers appUsers = new AppUsers()
            .username(UPDATED_USERNAME)
            .password(UPDATED_PASSWORD)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .resetToken(UPDATED_RESET_TOKEN)
            .resetTokenCreatedAt(UPDATED_RESET_TOKEN_CREATED_AT)
            .otpCode(UPDATED_OTP_CODE)
            .otpCodeCreatedAt(UPDATED_OTP_CODE_CREATED_AT)
            .otpCodeExpiredAt(UPDATED_OTP_CODE_EXPIRED_AT)
            .otpIsVerified(UPDATED_OTP_IS_VERIFIED)
            .rememberToken(UPDATED_REMEMBER_TOKEN)
            .isRemembered(UPDATED_IS_REMEMBERED)
            .deviceInfo(UPDATED_DEVICE_INFO)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .status(UPDATED_STATUS);
        return appUsers;
    }

    @BeforeEach
    public void initTest() {
        appUsers = createEntity(em);
    }

    @Test
    @Transactional
    void createAppUsers() throws Exception {
        int databaseSizeBeforeCreate = appUsersRepository.findAll().size();
        // Create the AppUsers
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);
        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsersDTO)))
            .andExpect(status().isCreated());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeCreate + 1);
        AppUsers testAppUsers = appUsersList.get(appUsersList.size() - 1);
        assertThat(testAppUsers.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testAppUsers.getPassword()).isEqualTo(DEFAULT_PASSWORD);
        assertThat(testAppUsers.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testAppUsers.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testAppUsers.getResetToken()).isEqualTo(DEFAULT_RESET_TOKEN);
        assertThat(testAppUsers.getResetTokenCreatedAt()).isEqualTo(DEFAULT_RESET_TOKEN_CREATED_AT);
        assertThat(testAppUsers.getOtpCode()).isEqualTo(DEFAULT_OTP_CODE);
        assertThat(testAppUsers.getOtpCodeCreatedAt()).isEqualTo(DEFAULT_OTP_CODE_CREATED_AT);
        assertThat(testAppUsers.getOtpCodeExpiredAt()).isEqualTo(DEFAULT_OTP_CODE_EXPIRED_AT);
        assertThat(testAppUsers.getOtpIsVerified()).isEqualTo(DEFAULT_OTP_IS_VERIFIED);
        assertThat(testAppUsers.getRememberToken()).isEqualTo(DEFAULT_REMEMBER_TOKEN);
        assertThat(testAppUsers.getIsRemembered()).isEqualTo(DEFAULT_IS_REMEMBERED);
        assertThat(testAppUsers.getDeviceInfo()).isEqualTo(DEFAULT_DEVICE_INFO);
        assertThat(testAppUsers.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testAppUsers.getUpdatedAt()).isEqualTo(DEFAULT_UPDATED_AT);
        assertThat(testAppUsers.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createAppUsersWithExistingId() throws Exception {
        // Create the AppUsers with an existing ID
        appUsers.setId(1L);
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        int databaseSizeBeforeCreate = appUsersRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsersDTO)))
            .andExpect(status().isBadRequest());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUsernameIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUsersRepository.findAll().size();
        // set the field null
        appUsers.setUsername(null);

        // Create the AppUsers, which fails.
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsersDTO)))
            .andExpect(status().isBadRequest());

        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPasswordIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUsersRepository.findAll().size();
        // set the field null
        appUsers.setPassword(null);

        // Create the AppUsers, which fails.
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsersDTO)))
            .andExpect(status().isBadRequest());

        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUsersRepository.findAll().size();
        // set the field null
        appUsers.setEmail(null);

        // Create the AppUsers, which fails.
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsersDTO)))
            .andExpect(status().isBadRequest());

        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPhoneNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUsersRepository.findAll().size();
        // set the field null
        appUsers.setPhoneNumber(null);

        // Create the AppUsers, which fails.
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsersDTO)))
            .andExpect(status().isBadRequest());

        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkOtpIsVerifiedIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUsersRepository.findAll().size();
        // set the field null
        appUsers.setOtpIsVerified(null);

        // Create the AppUsers, which fails.
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsersDTO)))
            .andExpect(status().isBadRequest());

        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIsRememberedIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUsersRepository.findAll().size();
        // set the field null
        appUsers.setIsRemembered(null);

        // Create the AppUsers, which fails.
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsersDTO)))
            .andExpect(status().isBadRequest());

        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreatedAtIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUsersRepository.findAll().size();
        // set the field null
        appUsers.setCreatedAt(null);

        // Create the AppUsers, which fails.
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsersDTO)))
            .andExpect(status().isBadRequest());

        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkUpdatedAtIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUsersRepository.findAll().size();
        // set the field null
        appUsers.setUpdatedAt(null);

        // Create the AppUsers, which fails.
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsersDTO)))
            .andExpect(status().isBadRequest());

        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUsersRepository.findAll().size();
        // set the field null
        appUsers.setStatus(null);

        // Create the AppUsers, which fails.
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsersDTO)))
            .andExpect(status().isBadRequest());

        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAppUsers() throws Exception {
        // Initialize the database
        appUsersRepository.saveAndFlush(appUsers);

        // Get all the appUsersList
        restAppUsersMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(appUsers.getId().intValue())))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].password").value(hasItem(DEFAULT_PASSWORD)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].resetToken").value(hasItem(DEFAULT_RESET_TOKEN)))
            .andExpect(jsonPath("$.[*].resetTokenCreatedAt").value(hasItem(sameInstant(DEFAULT_RESET_TOKEN_CREATED_AT))))
            .andExpect(jsonPath("$.[*].otpCode").value(hasItem(DEFAULT_OTP_CODE)))
            .andExpect(jsonPath("$.[*].otpCodeCreatedAt").value(hasItem(sameInstant(DEFAULT_OTP_CODE_CREATED_AT))))
            .andExpect(jsonPath("$.[*].otpCodeExpiredAt").value(hasItem(sameInstant(DEFAULT_OTP_CODE_EXPIRED_AT))))
            .andExpect(jsonPath("$.[*].otpIsVerified").value(hasItem(DEFAULT_OTP_IS_VERIFIED.booleanValue())))
            .andExpect(jsonPath("$.[*].rememberToken").value(hasItem(DEFAULT_REMEMBER_TOKEN)))
            .andExpect(jsonPath("$.[*].isRemembered").value(hasItem(DEFAULT_IS_REMEMBERED.booleanValue())))
            .andExpect(jsonPath("$.[*].deviceInfo").value(hasItem(DEFAULT_DEVICE_INFO)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAppUsersWithEagerRelationshipsIsEnabled() throws Exception {
        when(appUsersServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAppUsersMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(appUsersServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAppUsersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(appUsersServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAppUsersMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(appUsersServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getAppUsers() throws Exception {
        // Initialize the database
        appUsersRepository.saveAndFlush(appUsers);

        // Get the appUsers
        restAppUsersMockMvc
            .perform(get(ENTITY_API_URL_ID, appUsers.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(appUsers.getId().intValue()))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.password").value(DEFAULT_PASSWORD))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.resetToken").value(DEFAULT_RESET_TOKEN))
            .andExpect(jsonPath("$.resetTokenCreatedAt").value(sameInstant(DEFAULT_RESET_TOKEN_CREATED_AT)))
            .andExpect(jsonPath("$.otpCode").value(DEFAULT_OTP_CODE))
            .andExpect(jsonPath("$.otpCodeCreatedAt").value(sameInstant(DEFAULT_OTP_CODE_CREATED_AT)))
            .andExpect(jsonPath("$.otpCodeExpiredAt").value(sameInstant(DEFAULT_OTP_CODE_EXPIRED_AT)))
            .andExpect(jsonPath("$.otpIsVerified").value(DEFAULT_OTP_IS_VERIFIED.booleanValue()))
            .andExpect(jsonPath("$.rememberToken").value(DEFAULT_REMEMBER_TOKEN))
            .andExpect(jsonPath("$.isRemembered").value(DEFAULT_IS_REMEMBERED.booleanValue()))
            .andExpect(jsonPath("$.deviceInfo").value(DEFAULT_DEVICE_INFO))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingAppUsers() throws Exception {
        // Get the appUsers
        restAppUsersMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAppUsers() throws Exception {
        // Initialize the database
        appUsersRepository.saveAndFlush(appUsers);

        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();

        // Update the appUsers
        AppUsers updatedAppUsers = appUsersRepository.findById(appUsers.getId()).get();
        // Disconnect from session so that the updates on updatedAppUsers are not directly saved in db
        em.detach(updatedAppUsers);
        updatedAppUsers
            .username(UPDATED_USERNAME)
            .password(UPDATED_PASSWORD)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .resetToken(UPDATED_RESET_TOKEN)
            .resetTokenCreatedAt(UPDATED_RESET_TOKEN_CREATED_AT)
            .otpCode(UPDATED_OTP_CODE)
            .otpCodeCreatedAt(UPDATED_OTP_CODE_CREATED_AT)
            .otpCodeExpiredAt(UPDATED_OTP_CODE_EXPIRED_AT)
            .otpIsVerified(UPDATED_OTP_IS_VERIFIED)
            .rememberToken(UPDATED_REMEMBER_TOKEN)
            .isRemembered(UPDATED_IS_REMEMBERED)
            .deviceInfo(UPDATED_DEVICE_INFO)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .status(UPDATED_STATUS);
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(updatedAppUsers);

        restAppUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, appUsersDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appUsersDTO))
            )
            .andExpect(status().isOk());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
        AppUsers testAppUsers = appUsersList.get(appUsersList.size() - 1);
        assertThat(testAppUsers.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testAppUsers.getPassword()).isEqualTo(UPDATED_PASSWORD);
        assertThat(testAppUsers.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testAppUsers.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testAppUsers.getResetToken()).isEqualTo(UPDATED_RESET_TOKEN);
        assertThat(testAppUsers.getResetTokenCreatedAt()).isEqualTo(UPDATED_RESET_TOKEN_CREATED_AT);
        assertThat(testAppUsers.getOtpCode()).isEqualTo(UPDATED_OTP_CODE);
        assertThat(testAppUsers.getOtpCodeCreatedAt()).isEqualTo(UPDATED_OTP_CODE_CREATED_AT);
        assertThat(testAppUsers.getOtpCodeExpiredAt()).isEqualTo(UPDATED_OTP_CODE_EXPIRED_AT);
        assertThat(testAppUsers.getOtpIsVerified()).isEqualTo(UPDATED_OTP_IS_VERIFIED);
        assertThat(testAppUsers.getRememberToken()).isEqualTo(UPDATED_REMEMBER_TOKEN);
        assertThat(testAppUsers.getIsRemembered()).isEqualTo(UPDATED_IS_REMEMBERED);
        assertThat(testAppUsers.getDeviceInfo()).isEqualTo(UPDATED_DEVICE_INFO);
        assertThat(testAppUsers.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testAppUsers.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
        assertThat(testAppUsers.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingAppUsers() throws Exception {
        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();
        appUsers.setId(count.incrementAndGet());

        // Create the AppUsers
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, appUsersDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appUsersDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAppUsers() throws Exception {
        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();
        appUsers.setId(count.incrementAndGet());

        // Create the AppUsers
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appUsersDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAppUsers() throws Exception {
        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();
        appUsers.setId(count.incrementAndGet());

        // Create the AppUsers
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppUsersMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsersDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAppUsersWithPatch() throws Exception {
        // Initialize the database
        appUsersRepository.saveAndFlush(appUsers);

        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();

        // Update the appUsers using partial update
        AppUsers partialUpdatedAppUsers = new AppUsers();
        partialUpdatedAppUsers.setId(appUsers.getId());

        partialUpdatedAppUsers
            .username(UPDATED_USERNAME)
            .password(UPDATED_PASSWORD)
            .email(UPDATED_EMAIL)
            .otpCode(UPDATED_OTP_CODE)
            .otpCodeExpiredAt(UPDATED_OTP_CODE_EXPIRED_AT)
            .rememberToken(UPDATED_REMEMBER_TOKEN)
            .isRemembered(UPDATED_IS_REMEMBERED)
            .deviceInfo(UPDATED_DEVICE_INFO);

        restAppUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppUsers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAppUsers))
            )
            .andExpect(status().isOk());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
        AppUsers testAppUsers = appUsersList.get(appUsersList.size() - 1);
        assertThat(testAppUsers.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testAppUsers.getPassword()).isEqualTo(UPDATED_PASSWORD);
        assertThat(testAppUsers.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testAppUsers.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testAppUsers.getResetToken()).isEqualTo(DEFAULT_RESET_TOKEN);
        assertThat(testAppUsers.getResetTokenCreatedAt()).isEqualTo(DEFAULT_RESET_TOKEN_CREATED_AT);
        assertThat(testAppUsers.getOtpCode()).isEqualTo(UPDATED_OTP_CODE);
        assertThat(testAppUsers.getOtpCodeCreatedAt()).isEqualTo(DEFAULT_OTP_CODE_CREATED_AT);
        assertThat(testAppUsers.getOtpCodeExpiredAt()).isEqualTo(UPDATED_OTP_CODE_EXPIRED_AT);
        assertThat(testAppUsers.getOtpIsVerified()).isEqualTo(DEFAULT_OTP_IS_VERIFIED);
        assertThat(testAppUsers.getRememberToken()).isEqualTo(UPDATED_REMEMBER_TOKEN);
        assertThat(testAppUsers.getIsRemembered()).isEqualTo(UPDATED_IS_REMEMBERED);
        assertThat(testAppUsers.getDeviceInfo()).isEqualTo(UPDATED_DEVICE_INFO);
        assertThat(testAppUsers.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testAppUsers.getUpdatedAt()).isEqualTo(DEFAULT_UPDATED_AT);
        assertThat(testAppUsers.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateAppUsersWithPatch() throws Exception {
        // Initialize the database
        appUsersRepository.saveAndFlush(appUsers);

        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();

        // Update the appUsers using partial update
        AppUsers partialUpdatedAppUsers = new AppUsers();
        partialUpdatedAppUsers.setId(appUsers.getId());

        partialUpdatedAppUsers
            .username(UPDATED_USERNAME)
            .password(UPDATED_PASSWORD)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .resetToken(UPDATED_RESET_TOKEN)
            .resetTokenCreatedAt(UPDATED_RESET_TOKEN_CREATED_AT)
            .otpCode(UPDATED_OTP_CODE)
            .otpCodeCreatedAt(UPDATED_OTP_CODE_CREATED_AT)
            .otpCodeExpiredAt(UPDATED_OTP_CODE_EXPIRED_AT)
            .otpIsVerified(UPDATED_OTP_IS_VERIFIED)
            .rememberToken(UPDATED_REMEMBER_TOKEN)
            .isRemembered(UPDATED_IS_REMEMBERED)
            .deviceInfo(UPDATED_DEVICE_INFO)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .status(UPDATED_STATUS);

        restAppUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppUsers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAppUsers))
            )
            .andExpect(status().isOk());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
        AppUsers testAppUsers = appUsersList.get(appUsersList.size() - 1);
        assertThat(testAppUsers.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testAppUsers.getPassword()).isEqualTo(UPDATED_PASSWORD);
        assertThat(testAppUsers.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testAppUsers.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testAppUsers.getResetToken()).isEqualTo(UPDATED_RESET_TOKEN);
        assertThat(testAppUsers.getResetTokenCreatedAt()).isEqualTo(UPDATED_RESET_TOKEN_CREATED_AT);
        assertThat(testAppUsers.getOtpCode()).isEqualTo(UPDATED_OTP_CODE);
        assertThat(testAppUsers.getOtpCodeCreatedAt()).isEqualTo(UPDATED_OTP_CODE_CREATED_AT);
        assertThat(testAppUsers.getOtpCodeExpiredAt()).isEqualTo(UPDATED_OTP_CODE_EXPIRED_AT);
        assertThat(testAppUsers.getOtpIsVerified()).isEqualTo(UPDATED_OTP_IS_VERIFIED);
        assertThat(testAppUsers.getRememberToken()).isEqualTo(UPDATED_REMEMBER_TOKEN);
        assertThat(testAppUsers.getIsRemembered()).isEqualTo(UPDATED_IS_REMEMBERED);
        assertThat(testAppUsers.getDeviceInfo()).isEqualTo(UPDATED_DEVICE_INFO);
        assertThat(testAppUsers.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testAppUsers.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
        assertThat(testAppUsers.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingAppUsers() throws Exception {
        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();
        appUsers.setId(count.incrementAndGet());

        // Create the AppUsers
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, appUsersDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(appUsersDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAppUsers() throws Exception {
        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();
        appUsers.setId(count.incrementAndGet());

        // Create the AppUsers
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(appUsersDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAppUsers() throws Exception {
        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();
        appUsers.setId(count.incrementAndGet());

        // Create the AppUsers
        AppUsersDTO appUsersDTO = appUsersMapper.toDto(appUsers);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppUsersMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(appUsersDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAppUsers() throws Exception {
        // Initialize the database
        appUsersRepository.saveAndFlush(appUsers);

        int databaseSizeBeforeDelete = appUsersRepository.findAll().size();

        // Delete the appUsers
        restAppUsersMockMvc
            .perform(delete(ENTITY_API_URL_ID, appUsers.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
