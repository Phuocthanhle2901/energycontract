package vn.infodation.intern.group1.mas.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * A StatusLog.
 */
@Entity
@Table(name = "status_log")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class StatusLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "status_date_time")
    private Instant statusDateTime;

    @NotNull
    @Column(name = "note", nullable = false)
    private String note;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "statusLogs", allowSetters = true)
    private StatusType statusType;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "statusLogs", allowSetters = true)
    private Equipment equipment;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStatusDateTime() {
        return statusDateTime;
    }

    public StatusLog statusDateTime(Instant statusDateTime) {
        this.statusDateTime = statusDateTime;
        return this;
    }

    public void setStatusDateTime(Instant statusDateTime) {
        this.statusDateTime = statusDateTime;
    }

    public String getNote() {
        return note;
    }

    public StatusLog note(String note) {
        this.note = note;
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public StatusType getStatusType() {
        return statusType;
    }

    public StatusLog statusType(StatusType statusType) {
        this.statusType = statusType;
        return this;
    }

    public void setStatusType(StatusType statusType) {
        this.statusType = statusType;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public StatusLog equipment(Equipment equipment) {
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
        if (!(o instanceof StatusLog)) {
            return false;
        }
        return id != null && id.equals(((StatusLog) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StatusLog{" +
            "id=" + getId() +
            ", statusDateTime='" + getStatusDateTime() + "'" +
            ", note='" + getNote() + "'" +
            "}";
    }
}
