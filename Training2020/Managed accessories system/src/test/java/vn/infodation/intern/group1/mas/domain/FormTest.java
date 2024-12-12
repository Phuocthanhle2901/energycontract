package vn.infodation.intern.group1.mas.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import vn.infodation.intern.group1.mas.web.rest.TestUtil;

public class FormTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Form.class);
        Form form1 = new Form();
        form1.setId(1L);
        Form form2 = new Form();
        form2.setId(form1.getId());
        assertThat(form1).isEqualTo(form2);
        form2.setId(2L);
        assertThat(form1).isNotEqualTo(form2);
        form1.setId(null);
        assertThat(form1).isNotEqualTo(form2);
    }
}
