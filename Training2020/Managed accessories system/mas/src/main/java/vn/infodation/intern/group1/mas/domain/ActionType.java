package vn.infodation.intern.group1.mas.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A ActionType.
 */
@Entity
@Table(name = "action_type")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ActionType implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "action_title", nullable = false)
    private String actionTitle;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @OneToMany(mappedBy = "actionType")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ActionLog> actionLogs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActionTitle() {
        return actionTitle;
    }

    public ActionType actionTitle(String actionTitle) {
        this.actionTitle = actionTitle;
        return this;
    }

    public void setActionTitle(String actionTitle) {
        this.actionTitle = actionTitle;
    }

    public String getDescription() {
        return description;
    }

    public ActionType description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<ActionLog> getActionLogs() {
        return actionLogs;
    }

    public ActionType actionLogs(Set<ActionLog> actionLogs) {
        this.actionLogs = actionLogs;
        return this;
    }

    public ActionType addActionLog(ActionLog actionLog) {
        this.actionLogs.add(actionLog);
        actionLog.setActionType(this);
        return this;
    }

    public ActionType removeActionLog(ActionLog actionLog) {
        this.actionLogs.remove(actionLog);
        actionLog.setActionType(null);
        return this;
    }

    public void setActionLogs(Set<ActionLog> actionLogs) {
        this.actionLogs = actionLogs;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ActionType)) {
            return false;
        }
        return id != null && id.equals(((ActionType) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActionType{" +
            "id=" + getId() +
            ", actionTitle='" + getActionTitle() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
