package intern.team3.obmr.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import intern.team3.obmr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MeetingRoomsDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(MeetingRoomsDTO.class);
        MeetingRoomsDTO meetingRoomsDTO1 = new MeetingRoomsDTO();
        meetingRoomsDTO1.setId(1L);
        MeetingRoomsDTO meetingRoomsDTO2 = new MeetingRoomsDTO();
        assertThat(meetingRoomsDTO1).isNotEqualTo(meetingRoomsDTO2);
        meetingRoomsDTO2.setId(meetingRoomsDTO1.getId());
        assertThat(meetingRoomsDTO1).isEqualTo(meetingRoomsDTO2);
        meetingRoomsDTO2.setId(2L);
        assertThat(meetingRoomsDTO1).isNotEqualTo(meetingRoomsDTO2);
        meetingRoomsDTO1.setId(null);
        assertThat(meetingRoomsDTO1).isNotEqualTo(meetingRoomsDTO2);
    }
}
