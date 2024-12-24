package intern.team3.obmr.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import intern.team3.obmr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EventMeetingsDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventMeetingsDTO.class);
        EventMeetingsDTO eventMeetingsDTO1 = new EventMeetingsDTO();
        eventMeetingsDTO1.setId(1L);
        EventMeetingsDTO eventMeetingsDTO2 = new EventMeetingsDTO();
        assertThat(eventMeetingsDTO1).isNotEqualTo(eventMeetingsDTO2);
        eventMeetingsDTO2.setId(eventMeetingsDTO1.getId());
        assertThat(eventMeetingsDTO1).isEqualTo(eventMeetingsDTO2);
        eventMeetingsDTO2.setId(2L);
        assertThat(eventMeetingsDTO1).isNotEqualTo(eventMeetingsDTO2);
        eventMeetingsDTO1.setId(null);
        assertThat(eventMeetingsDTO1).isNotEqualTo(eventMeetingsDTO2);
    }
}
