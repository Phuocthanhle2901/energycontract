package intern.team3.obmr.domain;

import static org.assertj.core.api.Assertions.assertThat;

import intern.team3.obmr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EventUsersTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventUsers.class);
        EventUsers eventUsers1 = new EventUsers();
        eventUsers1.setId(1L);
        EventUsers eventUsers2 = new EventUsers();
        eventUsers2.setId(eventUsers1.getId());
        assertThat(eventUsers1).isEqualTo(eventUsers2);
        eventUsers2.setId(2L);
        assertThat(eventUsers1).isNotEqualTo(eventUsers2);
        eventUsers1.setId(null);
        assertThat(eventUsers1).isNotEqualTo(eventUsers2);
    }
}
