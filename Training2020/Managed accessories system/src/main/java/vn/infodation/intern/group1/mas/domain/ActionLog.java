package vn.infodation.intern.group1.mas.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * A ActionLog.
 */
@Entity
@Table(name = "action_log")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ActionLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private Instant startDate;

    @Column(name = "expected_end_date")
    private Instant expectedEndDate;

    @Column(name = "actual_end_date")
    private Instant actualEndDate;

    @NotNull
    @Column(name = "price", nullable = false)
    private Long price;

    @Column(name = "note")
    private String note;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "actionLogs", allowSetters = true)
    private Employee user;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "actionLogs", allowSetters = true)
    private ActionType actionType;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "actionLogs", allowSetters = true)
    private PlaceToPerform placeToPerform;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "actionLogs", allowSetters = true)
    private Equipment equipment;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartDate() {
        return startDate;
    }

    public ActionLog startDate(Instant startDate) {
        this.startDate = startDate;
        return this;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getExpectedEndDate() {
        return expectedEndDate;
    }

    public ActionLog expectedEndDate(Instant expectedEndDate) {
        this.expectedEndDate = expectedEndDate;
        return this;
    }

    public void setExpectedEndDate(Instant expectedEndDate) {
        this.expectedEndDate = expectedEndDate;
    }

    public Instant getActualEndDate() {
        return actualEndDate;
    }

    public ActionLog actualEndDate(Instant actualEndDate) {
        this.actualEndDate = actualEndDate;
        return this;
    }

    public void setActualEndDate(Instant actualEndDate) {
        this.actualEndDate = actualEndDate;
    }

    public Long getPrice() {
        return price;
    }

    public ActionLog price(Long price) {
        this.price = price;
        return this;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public String getNote() {
        return note;
    }

    public ActionLog note(String note) {
        this.note = note;
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Employee getUser() {
        return user;
    }

    public ActionLog user(Employee employee) {
        this.user = employee;
        return this;
    }

    public void setUser(Employee employee) {
        this.user = employee;
    }

    public ActionType getActionType() {
        return actionType;
    }

    public ActionLog actionType(ActionType actionType) {
        this.actionType = actionType;
        return this;
    }

    public void setActionType(ActionType actionType) {
        this.actionType = actionType;
    }

    public PlaceToPerform getPlaceToPerform() {
        return placeToPerform;
    }

    public ActionLog placeToPerform(PlaceToPerform placeToPerform) {
        this.placeToPerform = placeToPerform;
        return this;
    }

    public void setPlaceToPerform(PlaceToPerform placeToPerform) {
        this.placeToPerform = placeToPerform;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public ActionLog equipment(Equipment equipment) {
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
        if (!(o instanceof ActionLog)) {
            return false;
        }
        return id != null && id.equals(((ActionLog) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActionLog{" +
            "id=" + getId() +
            ", startDate='" + getStartDate() + "'" +
            ", expectedEndDate='" + getExpectedEndDate() + "'" +
            ", actualEndDate='" + getActualEndDate() + "'" +
            ", price=" + getPrice() +
            ", note='" + getNote() + "'" +
            "}";
    }
}
