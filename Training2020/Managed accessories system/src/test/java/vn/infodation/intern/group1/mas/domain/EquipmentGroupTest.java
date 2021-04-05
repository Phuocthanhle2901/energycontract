package vn.infodation.intern.group1.mas.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import vn.infodation.intern.group1.mas.web.rest.TestUtil;

public class EquipmentGroupTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EquipmentGroup.class);
        EquipmentGroup equipmentGroup1 = new EquipmentGroup();
        equipmentGroup1.setId(1L);
        EquipmentGroup equipmentGroup2 = new EquipmentGroup();
        equipmentGroup2.setId(equipmentGroup1.getId());
        assertThat(equipmentGroup1).isEqualTo(equipmentGroup2);
        equipmentGroup2.setId(2L);
        assertThat(equipmentGroup1).isNotEqualTo(equipmentGroup2);
        equipmentGroup1.setId(null);
        assertThat(equipmentGroup1).isNotEqualTo(equipmentGroup2);
    }
}
