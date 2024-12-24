package intern.team3.obmr.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class EventUsersMapperTest {

    private EventUsersMapper eventUsersMapper;

    @BeforeEach
    public void setUp() {
        eventUsersMapper = new EventUsersMapperImpl();
    }
}
