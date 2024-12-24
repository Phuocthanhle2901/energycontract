package intern.team3.obmr.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import intern.team3.obmr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PermissionsDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PermissionsDTO.class);
        PermissionsDTO permissionsDTO1 = new PermissionsDTO();
        permissionsDTO1.setId(1L);
        PermissionsDTO permissionsDTO2 = new PermissionsDTO();
        assertThat(permissionsDTO1).isNotEqualTo(permissionsDTO2);
        permissionsDTO2.setId(permissionsDTO1.getId());
        assertThat(permissionsDTO1).isEqualTo(permissionsDTO2);
        permissionsDTO2.setId(2L);
        assertThat(permissionsDTO1).isNotEqualTo(permissionsDTO2);
        permissionsDTO1.setId(null);
        assertThat(permissionsDTO1).isNotEqualTo(permissionsDTO2);
    }
}
