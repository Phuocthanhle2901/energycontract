package vn.infodation.intern.group1.mas.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A EquipmentGroup.
 */
@Entity
@Table(name = "equipment_group")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EquipmentGroup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "equipment_group_name", nullable = false)
    private String equipmentGroupName;

    @OneToMany(mappedBy = "equipmentGroup")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Equipment> equipment = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEquipmentGroupName() {
        return equipmentGroupName;
    }

    public EquipmentGroup equipmentGroupName(String equipmentGroupName) {
        this.equipmentGroupName = equipmentGroupName;
        return this;
    }

    public void setEquipmentGroupName(String equipmentGroupName) {
        this.equipmentGroupName = equipmentGroupName;
    }

    public Set<Equipment> getEquipment() {
        return equipment;
    }

    public EquipmentGroup equipment(Set<Equipment> equipment) {
        this.equipment = equipment;
        return this;
    }

    public EquipmentGroup addEquipment(Equipment equipment) {
        this.equipment.add(equipment);
        equipment.setEquipmentGroup(this);
        return this;
    }

    public EquipmentGroup removeEquipment(Equipment equipment) {
        this.equipment.remove(equipment);
        equipment.setEquipmentGroup(null);
        return this;
    }

    public void setEquipment(Set<Equipment> equipment) {
        this.equipment = equipment;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EquipmentGroup)) {
            return false;
        }
        return id != null && id.equals(((EquipmentGroup) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EquipmentGroup{" +
            "id=" + getId() +
            ", equipmentGroupName='" + getEquipmentGroupName() + "'" +
            "}";
    }
}
