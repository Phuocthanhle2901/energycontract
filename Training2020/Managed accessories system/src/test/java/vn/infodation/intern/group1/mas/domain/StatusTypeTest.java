package vn.infodation.intern.group1.mas.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import vn.infodation.intern.group1.mas.web.rest.TestUtil;

public class StatusTypeTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StatusType.class);
        StatusType statusType1 = new StatusType();
        statusType1.setId(1L);
        StatusType statusType2 = new StatusType();
        statusType2.setId(statusType1.getId());
        assertThat(statusType1).isEqualTo(statusType2);
        statusType2.setId(2L);
        assertThat(statusType1).isNotEqualTo(statusType2);
        statusType1.setId(null);
        assertThat(statusType1).isNotEqualTo(statusType2);
    }
}
