package intern.team3.obmr.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class EventMeetingsMapperTest {

    private EventMeetingsMapper eventMeetingsMapper;

    @BeforeEach
    public void setUp() {
        eventMeetingsMapper = new EventMeetingsMapperImpl();
    }
}
