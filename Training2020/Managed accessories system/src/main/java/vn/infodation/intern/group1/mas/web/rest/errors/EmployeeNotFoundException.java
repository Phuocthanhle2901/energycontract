package vn.infodation.intern.group1.mas.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class EmployeeNotFoundException extends AbstractThrowableProblem{
	private static final long serialVersionUID = 1L;
	public EmployeeNotFoundException() {
	    super(null, "Employee not found", Status.NOT_FOUND);
	}
}
