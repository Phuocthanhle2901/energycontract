package vn.infodation.intern.group1.mas.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class EquipmentNotFoundException extends AbstractThrowableProblem{
    private static final long serialVersionUID = 1L;
    public EquipmentNotFoundException() {
        super(null, "Equipment not found", Status.NOT_FOUND);
    }
}