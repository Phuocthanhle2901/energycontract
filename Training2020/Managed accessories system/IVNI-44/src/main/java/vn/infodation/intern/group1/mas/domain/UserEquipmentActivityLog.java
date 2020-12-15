package vn.infodation.intern.group1.mas.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * A UserEquipmentActivityLog.
 */
@Entity
@Table(name = "user_equipment_activity_log")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserEquipmentActivityLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "activity", nullable = false)
    private String activity;

    @Column(name = "date")
    private Instant date;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "userEquipmentActivityLogs", allowSetters = true)
    private Employee user;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "userEquipmentActivityLogs", allowSetters = true)
    private Equipment equipment;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActivity() {
        return activity;
    }

    public UserEquipmentActivityLog activity(String activity) {
        this.activity = activity;
        return this;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public Instant getDate() {
        return date;
    }

    public UserEquipmentActivityLog date(Instant date) {
        this.date = date;
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Employee getUser() {
        return user;
    }

    public UserEquipmentActivityLog user(Employee employee) {
        this.user = employee;
        return this;
    }

    public void setUser(Employee employee) {
        this.user = employee;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public UserEquipmentActivityLog equipment(Equipment equipment) {
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
        if (!(o instanceof UserEquipmentActivityLog)) {
            return false;
        }
        return id != null && id.equals(((UserEquipmentActivityLog) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserEquipmentActivityLog{" +
            "id=" + getId() +
            ", activity='" + getActivity() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
