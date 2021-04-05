package vn.infodation.intern.group1.mas.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A StatusType.
 */
@Entity
@Table(name = "status_type")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class StatusType implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "status_title", nullable = false)
    private String statusTitle;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @OneToMany(mappedBy = "statusType")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<StatusLog> statusLogs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatusTitle() {
        return statusTitle;
    }

    public StatusType statusTitle(String statusTitle) {
        this.statusTitle = statusTitle;
        return this;
    }

    public void setStatusTitle(String statusTitle) {
        this.statusTitle = statusTitle;
    }

    public String getDescription() {
        return description;
    }

    public StatusType description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<StatusLog> getStatusLogs() {
        return statusLogs;
    }

    public StatusType statusLogs(Set<StatusLog> statusLogs) {
        this.statusLogs = statusLogs;
        return this;
    }

    public StatusType addStatusLog(StatusLog statusLog) {
        this.statusLogs.add(statusLog);
        statusLog.setStatusType(this);
        return this;
    }

    public StatusType removeStatusLog(StatusLog statusLog) {
        this.statusLogs.remove(statusLog);
        statusLog.setStatusType(null);
        return this;
    }

    public void setStatusLogs(Set<StatusLog> statusLogs) {
        this.statusLogs = statusLogs;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StatusType)) {
            return false;
        }
        return id != null && id.equals(((StatusType) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StatusType{" +
            "id=" + getId() +
            ", statusTitle='" + getStatusTitle() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
