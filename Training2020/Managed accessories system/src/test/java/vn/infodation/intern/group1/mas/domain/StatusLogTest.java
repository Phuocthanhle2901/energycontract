package vn.infodation.intern.group1.mas.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import vn.infodation.intern.group1.mas.web.rest.TestUtil;

public class StatusLogTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StatusLog.class);
        StatusLog statusLog1 = new StatusLog();
        statusLog1.setId(1L);
        StatusLog statusLog2 = new StatusLog();
        statusLog2.setId(statusLog1.getId());
        assertThat(statusLog1).isEqualTo(statusLog2);
        statusLog2.setId(2L);
        assertThat(statusLog1).isNotEqualTo(statusLog2);
        statusLog1.setId(null);
        assertThat(statusLog1).isNotEqualTo(statusLog2);
    }
}
