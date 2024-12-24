package intern.team3.obmr.domain;

import static org.assertj.core.api.Assertions.assertThat;

import intern.team3.obmr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EventMeetingsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventMeetings.class);
        EventMeetings eventMeetings1 = new EventMeetings();
        eventMeetings1.setId(1L);
        EventMeetings eventMeetings2 = new EventMeetings();
        eventMeetings2.setId(eventMeetings1.getId());
        assertThat(eventMeetings1).isEqualTo(eventMeetings2);
        eventMeetings2.setId(2L);
        assertThat(eventMeetings1).isNotEqualTo(eventMeetings2);
        eventMeetings1.setId(null);
        assertThat(eventMeetings1).isNotEqualTo(eventMeetings2);
    }
}
