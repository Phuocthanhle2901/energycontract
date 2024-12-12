package vn.infodation.intern.group1.mas.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

import vn.infodation.intern.group1.mas.domain.enumeration.formStatus;

/**
 * A Form.
 */
@Entity
@Table(name = "form")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Form implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 10, max = 200)
    @Column(name = "title", length = 200, nullable = false)
    private String title;

    @NotNull
    @Size(min = 3, max = 50)
    @Column(name = "your_name", length = 50, nullable = false)
    private String yourName;

    @NotNull
    @Column(name = "area", nullable = false)
    private String area;

    @NotNull
    @Size(min = 50, max = 400)
    @Column(name = "reason", length = 400, nullable = false)
    private String reason;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private formStatus status;

    @ManyToOne
    @JsonIgnoreProperties(value = "forms", allowSetters = true)
    private FormType formType;

    @ManyToOne
    @JsonIgnoreProperties(value = "forms", allowSetters = true)
    private Employee employee;

    @ManyToOne
    @JsonIgnoreProperties(value = "forms", allowSetters = true)
    private Equipment equipment;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public Form title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getYourName() {
        return yourName;
    }

    public Form yourName(String yourName) {
        this.yourName = yourName;
        return this;
    }

    public void setYourName(String yourName) {
        this.yourName = yourName;
    }

    public String getArea() {
        return area;
    }

    public Form area(String area) {
        this.area = area;
        return this;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getReason() {
        return reason;
    }

    public Form reason(String reason) {
        this.reason = reason;
        return this;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public formStatus getStatus() {
        return status;
    }

    public Form status(formStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(formStatus status) {
        this.status = status;
    }

    public FormType getFormType() {
        return formType;
    }

    public Form formType(FormType formType) {
        this.formType = formType;
        return this;
    }

    public void setFormType(FormType formType) {
        this.formType = formType;
    }

    public Employee getEmployee() {
        return employee;
    }

    public Form employee(Employee employee) {
        this.employee = employee;
        return this;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public Form equipment(Equipment equipment) {
        this.equipment = equipment;
        return this;
    }

    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Form)) {
            return false;
        }
        return id != null && id.equals(((Form) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Form{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", yourName='" + getYourName() + "'" +
            ", area='" + getArea() + "'" +
            ", reason='" + getReason() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
