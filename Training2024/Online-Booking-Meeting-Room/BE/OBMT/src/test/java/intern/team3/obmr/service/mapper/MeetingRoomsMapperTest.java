package intern.team3.obmr.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MeetingRoomsMapperTest {

    private MeetingRoomsMapper meetingRoomsMapper;

    @BeforeEach
    public void setUp() {
        meetingRoomsMapper = new MeetingRoomsMapperImpl();
    }
}
