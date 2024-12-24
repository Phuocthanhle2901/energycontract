package intern.team3.obmr.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import intern.team3.obmr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EventUsersDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventUsersDTO.class);
        EventUsersDTO eventUsersDTO1 = new EventUsersDTO();
        eventUsersDTO1.setId(1L);
        EventUsersDTO eventUsersDTO2 = new EventUsersDTO();
        assertThat(eventUsersDTO1).isNotEqualTo(eventUsersDTO2);
        eventUsersDTO2.setId(eventUsersDTO1.getId());
        assertThat(eventUsersDTO1).isEqualTo(eventUsersDTO2);
        eventUsersDTO2.setId(2L);
        assertThat(eventUsersDTO1).isNotEqualTo(eventUsersDTO2);
        eventUsersDTO1.setId(null);
        assertThat(eventUsersDTO1).isNotEqualTo(eventUsersDTO2);
    }
}
