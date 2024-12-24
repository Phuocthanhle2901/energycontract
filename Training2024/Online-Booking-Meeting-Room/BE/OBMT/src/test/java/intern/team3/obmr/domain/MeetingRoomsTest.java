package intern.team3.obmr.domain;

import static org.assertj.core.api.Assertions.assertThat;

import intern.team3.obmr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MeetingRoomsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MeetingRooms.class);
        MeetingRooms meetingRooms1 = new MeetingRooms();
        meetingRooms1.setId(1L);
        MeetingRooms meetingRooms2 = new MeetingRooms();
        meetingRooms2.setId(meetingRooms1.getId());
        assertThat(meetingRooms1).isEqualTo(meetingRooms2);
        meetingRooms2.setId(2L);
        assertThat(meetingRooms1).isNotEqualTo(meetingRooms2);
        meetingRooms1.setId(null);
        assertThat(meetingRooms1).isNotEqualTo(meetingRooms2);
    }
}
