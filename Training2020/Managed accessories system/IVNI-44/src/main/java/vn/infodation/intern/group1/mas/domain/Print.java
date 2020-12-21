package vn.infodation.intern.group1.mas.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "print")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Print {
	
	@Column(name = "employee")
	private Employee employee;
	
	@Column(name = "equipment")
	private Equipment equipment;

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public Equipment getEquipment() {
		return equipment;
	}

	public void setEquipment(Equipment equipment) {
		this.equipment = equipment;
	}
}
