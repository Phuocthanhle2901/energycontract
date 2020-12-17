package vn.infodation.intern.group1.mas.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import vn.infodation.intern.group1.mas.web.rest.TestUtil;

public class PlaceToPerformTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PlaceToPerform.class);
        PlaceToPerform placeToPerform1 = new PlaceToPerform();
        placeToPerform1.setId(1L);
        PlaceToPerform placeToPerform2 = new PlaceToPerform();
        placeToPerform2.setId(placeToPerform1.getId());
        assertThat(placeToPerform1).isEqualTo(placeToPerform2);
        placeToPerform2.setId(2L);
        assertThat(placeToPerform1).isNotEqualTo(placeToPerform2);
        placeToPerform1.setId(null);
        assertThat(placeToPerform1).isNotEqualTo(placeToPerform2);
    }
}
