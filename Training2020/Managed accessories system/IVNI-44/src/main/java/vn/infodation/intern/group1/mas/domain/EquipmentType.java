package vn.infodation.intern.group1.mas.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A EquipmentType.
 */
@Entity
@Table(name = "equipment_type")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EquipmentType implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "equipment_type_name", nullable = false)
    private String equipmentTypeName;

    @OneToMany(mappedBy = "equipmentType")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Equipment> equipment = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEquipmentTypeName() {
        return equipmentTypeName;
    }

    public EquipmentType equipmentTypeName(String equipmentTypeName) {
        this.equipmentTypeName = equipmentTypeName;
        return this;
    }

    public void setEquipmentTypeName(String equipmentTypeName) {
        this.equipmentTypeName = equipmentTypeName;
    }

    public Set<Equipment> getEquipment() {
        return equipment;
    }

    public EquipmentType equipment(Set<Equipment> equipment) {
        this.equipment = equipment;
        return this;
    }

    public EquipmentType addEquipment(Equipment equipment) {
        this.equipment.add(equipment);
        equipment.setEquipmentType(this);
        return this;
    }

    public EquipmentType removeEquipment(Equipment equipment) {
        this.equipment.remove(equipment);
        equipment.setEquipmentType(null);
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
        if (!(o instanceof EquipmentType)) {
            return false;
        }
        return id != null && id.equals(((EquipmentType) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EquipmentType{" +
            "id=" + getId() +
            ", equipmentTypeName='" + getEquipmentTypeName() + "'" +
            "}";
    }
}
