package vn.infodation.intern.group1.mas.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import vn.infodation.intern.group1.mas.web.rest.TestUtil;

public class AreaTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Area.class);
        Area area1 = new Area();
        area1.setId(1L);
        Area area2 = new Area();
        area2.setId(area1.getId());
        assertThat(area1).isEqualTo(area2);
        area2.setId(2L);
        assertThat(area1).isNotEqualTo(area2);
        area1.setId(null);
        assertThat(area1).isNotEqualTo(area2);
    }
}
