package vn.infodation.intern.group1.mas.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * A PlaceToPerform.
 */
@Entity
@Table(name = "place_to_perform")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PlaceToPerform implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "place_name", nullable = false)
    private String placeName;

    @NotNull
    @Column(name = "address", nullable = false)
    private String address;

    @NotNull
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "representative_name", nullable = false)
    private Instant representativeName;

    @OneToMany(mappedBy = "placeToPerform")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ActionLog> actionLogs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlaceName() {
        return placeName;
    }

    public PlaceToPerform placeName(String placeName) {
        this.placeName = placeName;
        return this;
    }

    public void setPlaceName(String placeName) {
        this.placeName = placeName;
    }

    public String getAddress() {
        return address;
    }

    public PlaceToPerform address(String address) {
        this.address = address;
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public PlaceToPerform phoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public PlaceToPerform email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Instant getRepresentativeName() {
        return representativeName;
    }

    public PlaceToPerform representativeName(Instant representativeName) {
        this.representativeName = representativeName;
        return this;
    }

    public void setRepresentativeName(Instant representativeName) {
        this.representativeName = representativeName;
    }

    public Set<ActionLog> getActionLogs() {
        return actionLogs;
    }

    public PlaceToPerform actionLogs(Set<ActionLog> actionLogs) {
        this.actionLogs = actionLogs;
        return this;
    }

    public PlaceToPerform addActionLog(ActionLog actionLog) {
        this.actionLogs.add(actionLog);
        actionLog.setPlaceToPerform(this);
        return this;
    }

    public PlaceToPerform removeActionLog(ActionLog actionLog) {
        this.actionLogs.remove(actionLog);
        actionLog.setPlaceToPerform(null);
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
        if (!(o instanceof PlaceToPerform)) {
            return false;
        }
        return id != null && id.equals(((PlaceToPerform) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PlaceToPerform{" +
            "id=" + getId() +
            ", placeName='" + getPlaceName() + "'" +
            ", address='" + getAddress() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", email='" + getEmail() + "'" +
            ", representativeName='" + getRepresentativeName() + "'" +
            "}";
    }
}
