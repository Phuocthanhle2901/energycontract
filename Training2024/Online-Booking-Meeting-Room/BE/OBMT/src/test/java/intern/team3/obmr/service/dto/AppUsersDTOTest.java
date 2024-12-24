package intern.team3.obmr.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import intern.team3.obmr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AppUsersDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AppUsersDTO.class);
        AppUsersDTO appUsersDTO1 = new AppUsersDTO();
        appUsersDTO1.setId(1L);
        AppUsersDTO appUsersDTO2 = new AppUsersDTO();
        assertThat(appUsersDTO1).isNotEqualTo(appUsersDTO2);
        appUsersDTO2.setId(appUsersDTO1.getId());
        assertThat(appUsersDTO1).isEqualTo(appUsersDTO2);
        appUsersDTO2.setId(2L);
        assertThat(appUsersDTO1).isNotEqualTo(appUsersDTO2);
        appUsersDTO1.setId(null);
        assertThat(appUsersDTO1).isNotEqualTo(appUsersDTO2);
    }
}
