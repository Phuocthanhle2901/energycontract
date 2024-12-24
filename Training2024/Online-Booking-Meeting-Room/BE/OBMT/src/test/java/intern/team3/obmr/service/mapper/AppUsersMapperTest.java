package intern.team3.obmr.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AppUsersMapperTest {

    private AppUsersMapper appUsersMapper;

    @BeforeEach
    public void setUp() {
        appUsersMapper = new AppUsersMapperImpl();
    }
}
