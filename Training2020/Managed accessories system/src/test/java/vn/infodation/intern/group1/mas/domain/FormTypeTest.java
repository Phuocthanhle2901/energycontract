package vn.infodation.intern.group1.mas.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import vn.infodation.intern.group1.mas.web.rest.TestUtil;

public class FormTypeTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FormType.class);
        FormType formType1 = new FormType();
        formType1.setId(1L);
        FormType formType2 = new FormType();
        formType2.setId(formType1.getId());
        assertThat(formType1).isEqualTo(formType2);
        formType2.setId(2L);
        assertThat(formType1).isNotEqualTo(formType2);
        formType1.setId(null);
        assertThat(formType1).isNotEqualTo(formType2);
    }
}
