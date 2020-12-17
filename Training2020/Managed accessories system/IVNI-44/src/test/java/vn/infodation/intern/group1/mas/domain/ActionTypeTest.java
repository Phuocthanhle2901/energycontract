package vn.infodation.intern.group1.mas.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import vn.infodation.intern.group1.mas.web.rest.TestUtil;

public class ActionTypeTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActionType.class);
        ActionType actionType1 = new ActionType();
        actionType1.setId(1L);
        ActionType actionType2 = new ActionType();
        actionType2.setId(actionType1.getId());
        assertThat(actionType1).isEqualTo(actionType2);
        actionType2.setId(2L);
        assertThat(actionType1).isNotEqualTo(actionType2);
        actionType1.setId(null);
        assertThat(actionType1).isNotEqualTo(actionType2);
    }
}
