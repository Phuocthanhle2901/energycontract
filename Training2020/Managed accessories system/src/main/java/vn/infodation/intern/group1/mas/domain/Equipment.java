package vn.infodation.intern.group1.mas.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * A Equipment.
 */
@Entity
@Table(name = "equipment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Equipment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "purchase_date")
    private Instant purchaseDate;

    @NotNull
    @Column(name = "equipment_name", nullable = false)
    private String equipmentName;

    @NotNull
    @Column(name = "technical_features", nullable = false)
    private String technicalFeatures;

    @NotNull
    @Column(name = "serial_number", nullable = false)
    private String serialNumber;

    @NotNull
    @Column(name = "note", nullable = false)
    private String note;

    @OneToMany(mappedBy = "equipment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ActionLog> actionLogs = new HashSet<>();

    @OneToMany(mappedBy = "equipment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<StatusLog> statusLogs = new HashSet<>();

    @OneToMany(mappedBy = "equipment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<UserEquipmentActivityLog> userEquipmentActivityLogs = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "equipment", allowSetters = true)
    private Employee user;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "equipment", allowSetters = true)
    private EquipmentGroup equipmentGroup;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "equipment", allowSetters = true)
    private EquipmentType equipmentType;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "equipment", allowSetters = true)
    private Area area;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getPurchaseDate() {
        return purchaseDate;
    }

    public Equipment purchaseDate(Instant purchaseDate) {
        this.purchaseDate = purchaseDate;
        return this;
    }

    public void setPurchaseDate(Instant purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public Equipment equipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
        return this;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public String getTechnicalFeatures() {
        return technicalFeatures;
    }

    public Equipment technicalFeatures(String technicalFeatures) {
        this.technicalFeatures = technicalFeatures;
        return this;
    }

    public void setTechnicalFeatures(String technicalFeatures) {
        this.technicalFeatures = technicalFeatures;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public Equipment serialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
        return this;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getNote() {
        return note;
    }

    public Equipment note(String note) {
        this.note = note;
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Set<ActionLog> getActionLogs() {
        return actionLogs;
    }

    public Equipment actionLogs(Set<ActionLog> actionLogs) {
        this.actionLogs = actionLogs;
        return this;
    }

    public Equipment addActionLog(ActionLog actionLog) {
        this.actionLogs.add(actionLog);
        actionLog.setEquipment(this);
        return this;
    }

    public Equipment removeActionLog(ActionLog actionLog) {
        this.actionLogs.remove(actionLog);
        actionLog.setEquipment(null);
        return this;
    }

    public void setActionLogs(Set<ActionLog> actionLogs) {
        this.actionLogs = actionLogs;
    }

    public Set<StatusLog> getStatusLogs() {
        return statusLogs;
    }

    public Equipment statusLogs(Set<StatusLog> statusLogs) {
        this.statusLogs = statusLogs;
        return this;
    }

    public Equipment addStatusLog(StatusLog statusLog) {
        this.statusLogs.add(statusLog);
        statusLog.setEquipment(this);
        return this;
    }

    public Equipment removeStatusLog(StatusLog statusLog) {
        this.statusLogs.remove(statusLog);
        statusLog.setEquipment(null);
        return this;
    }

    public void setStatusLogs(Set<StatusLog> statusLogs) {
        this.statusLogs = statusLogs;
    }

    public Set<UserEquipmentActivityLog> getUserEquipmentActivityLogs() {
        return userEquipmentActivityLogs;
    }

    public Equipment userEquipmentActivityLogs(Set<UserEquipmentActivityLog> userEquipmentActivityLogs) {
        this.userEquipmentActivityLogs = userEquipmentActivityLogs;
        return this;
    }

    public Equipment addUserEquipmentActivityLog(UserEquipmentActivityLog userEquipmentActivityLog) {
        this.userEquipmentActivityLogs.add(userEquipmentActivityLog);
        userEquipmentActivityLog.setEquipment(this);
        return this;
    }

    public Equipment removeUserEquipmentActivityLog(UserEquipmentActivityLog userEquipmentActivityLog) {
        this.userEquipmentActivityLogs.remove(userEquipmentActivityLog);
        userEquipmentActivityLog.setEquipment(null);
        return this;
    }

    public void setUserEquipmentActivityLogs(Set<UserEquipmentActivityLog> userEquipmentActivityLogs) {
        this.userEquipmentActivityLogs = userEquipmentActivityLogs;
    }

    public Employee getUser() {
        return user;
    }

    public Equipment user(Employee employee) {
        this.user = employee;
        return this;
    }

    public void setUser(Employee employee) {
        this.user = employee;
    }

    public EquipmentGroup getEquipmentGroup() {
        return equipmentGroup;
    }

    public Equipment equipmentGroup(EquipmentGroup equipmentGroup) {
        this.equipmentGroup = equipmentGroup;
        return this;
    }

    public void setEquipmentGroup(EquipmentGroup equipmentGroup) {
        this.equipmentGroup = equipmentGroup;
    }

    public EquipmentType getEquipmentType() {
        return equipmentType;
    }

    public Equipment equipmentType(EquipmentType equipmentType) {
        this.equipmentType = equipmentType;
        return this;
    }

    public void setEquipmentType(EquipmentType equipmentType) {
        this.equipmentType = equipmentType;
    }

    public Area getArea() {
        return area;
    }

    public Equipment area(Area area) {
        this.area = area;
        return this;
    }

    public void setArea(Area area) {
        this.area = area;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Equipment)) {
            return false;
        }
        return id != null && id.equals(((Equipment) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Equipment{" +
            "id=" + getId() +
            ", purchaseDate='" + getPurchaseDate() + "'" +
            ", equipmentName='" + getEquipmentName() + "'" +
            ", technicalFeatures='" + getTechnicalFeatures() + "'" +
            ", serialNumber='" + getSerialNumber() + "'" +
            ", note='" + getNote() + "'" +
            "}";
    }
}
