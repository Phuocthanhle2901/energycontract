package intern.team3.obmr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Permissions.
 */
@Entity
@Table(name = "permissions")
public class Permissions implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "permission_name", nullable = false)
    private String permissionName;

    @ManyToMany(mappedBy = "permissions")
    @JsonIgnoreProperties(value = { "permissions", "appusers" }, allowSetters = true)
    private Set<Roles> roles = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Permissions id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPermissionName() {
        return this.permissionName;
    }

    public Permissions permissionName(String permissionName) {
        this.setPermissionName(permissionName);
        return this;
    }

    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName;
    }

    public Set<Roles> getRoles() {
        return this.roles;
    }

    public void setRoles(Set<Roles> roles) {
        if (this.roles != null) {
            this.roles.forEach(i -> i.removePermissions(this));
        }
        if (roles != null) {
            roles.forEach(i -> i.addPermissions(this));
        }
        this.roles = roles;
    }

    public Permissions roles(Set<Roles> roles) {
        this.setRoles(roles);
        return this;
    }

    public Permissions addRoles(Roles roles) {
        this.roles.add(roles);
        roles.getPermissions().add(this);
        return this;
    }

    public Permissions removeRoles(Roles roles) {
        this.roles.remove(roles);
        roles.getPermissions().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Permissions)) {
            return false;
        }
        return id != null && id.equals(((Permissions) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Permissions{" +
            "id=" + getId() +
            ", permissionName='" + getPermissionName() + "'" +
            "}";
    }
}
