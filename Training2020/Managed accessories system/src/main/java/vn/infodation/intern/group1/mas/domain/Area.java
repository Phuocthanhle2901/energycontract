package vn.infodation.intern.group1.mas.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Area.
 */
@Entity
@Table(name = "area")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Area implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "area_name", nullable = false)
    private String areaName;

    @OneToMany(mappedBy = "area")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Equipment> equipment = new HashSet<>();

    @OneToMany(mappedBy = "area")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Employee> employees = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = "areas", allowSetters = true)
    private Employee leader;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAreaName() {
        return areaName;
    }

    public Area areaName(String areaName) {
        this.areaName = areaName;
        return this;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public Set<Equipment> getEquipment() {
        return equipment;
    }

    public Area equipment(Set<Equipment> equipment) {
        this.equipment = equipment;
        return this;
    }

    public Area addEquipment(Equipment equipment) {
        this.equipment.add(equipment);
        equipment.setArea(this);
        return this;
    }

    public Area removeEquipment(Equipment equipment) {
        this.equipment.remove(equipment);
        equipment.setArea(null);
        return this;
    }

    public void setEquipment(Set<Equipment> equipment) {
        this.equipment = equipment;
    }

    public Set<Employee> getEmployees() {
        return employees;
    }

    public Area employees(Set<Employee> employees) {
        this.employees = employees;
        return this;
    }

    public Area addEmployee(Employee employee) {
        this.employees.add(employee);
        employee.setArea(this);
        return this;
    }

    public Area removeEmployee(Employee employee) {
        this.employees.remove(employee);
        employee.setArea(null);
        return this;
    }

    public void setEmployees(Set<Employee> employees) {
        this.employees = employees;
    }

    public Employee getLeader() {
        return leader;
    }

    public Area leader(Employee employee) {
        this.leader = employee;
        return this;
    }

    public void setLeader(Employee employee) {
        this.leader = employee;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Area)) {
            return false;
        }
        return id != null && id.equals(((Area) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Area{" +
            "id=" + getId() +
            ", areaName='" + getAreaName() + "'" +
            "}";
    }
}
