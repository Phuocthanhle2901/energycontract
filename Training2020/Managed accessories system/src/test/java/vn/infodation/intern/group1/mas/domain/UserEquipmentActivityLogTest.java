package vn.infodation.intern.group1.mas.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import vn.infodation.intern.group1.mas.web.rest.TestUtil;

public class UserEquipmentActivityLogTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserEquipmentActivityLog.class);
        UserEquipmentActivityLog userEquipmentActivityLog1 = new UserEquipmentActivityLog();
        userEquipmentActivityLog1.setId(1L);
        UserEquipmentActivityLog userEquipmentActivityLog2 = new UserEquipmentActivityLog();
        userEquipmentActivityLog2.setId(userEquipmentActivityLog1.getId());
        assertThat(userEquipmentActivityLog1).isEqualTo(userEquipmentActivityLog2);
        userEquipmentActivityLog2.setId(2L);
        assertThat(userEquipmentActivityLog1).isNotEqualTo(userEquipmentActivityLog2);
        userEquipmentActivityLog1.setId(null);
        assertThat(userEquipmentActivityLog1).isNotEqualTo(userEquipmentActivityLog2);
    }
}
