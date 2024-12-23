package intern.team3.obmr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Roles.
 */
@Entity
@Table(name = "roles")
public class Roles implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "role_name", nullable = false)
    private String roleName;

    @ManyToMany
    @JoinTable(
        name = "rel_roles__permissions",
        joinColumns = @JoinColumn(name = "roles_id"),
        inverseJoinColumns = @JoinColumn(name = "permissions_id")
    )
    @JsonIgnoreProperties(value = { "roles" }, allowSetters = true)
    private Set<Permissions> permissions = new HashSet<>();

    @ManyToMany(mappedBy = "roles")
    @JsonIgnoreProperties(value = { "roles", "events" }, allowSetters = true)
    private Set<AppUsers> appusers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Roles id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoleName() {
        return this.roleName;
    }

    public Roles roleName(String roleName) {
        this.setRoleName(roleName);
        return this;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Set<Permissions> getPermissions() {
        return this.permissions;
    }

    public void setPermissions(Set<Permissions> permissions) {
        this.permissions = permissions;
    }

    public Roles permissions(Set<Permissions> permissions) {
        this.setPermissions(permissions);
        return this;
    }

    public Roles addPermissions(Permissions permissions) {
        this.permissions.add(permissions);
        permissions.getRoles().add(this);
        return this;
    }

    public Roles removePermissions(Permissions permissions) {
        this.permissions.remove(permissions);
        permissions.getRoles().remove(this);
        return this;
    }

    public Set<AppUsers> getAppusers() {
        return this.appusers;
    }

    public void setAppusers(Set<AppUsers> appUsers) {
        if (this.appusers != null) {
            this.appusers.forEach(i -> i.removeRoles(this));
        }
        if (appUsers != null) {
            appUsers.forEach(i -> i.addRoles(this));
        }
        this.appusers = appUsers;
    }

    public Roles appusers(Set<AppUsers> appUsers) {
        this.setAppusers(appUsers);
        return this;
    }

    public Roles addAppusers(AppUsers appUsers) {
        this.appusers.add(appUsers);
        appUsers.getRoles().add(this);
        return this;
    }

    public Roles removeAppusers(AppUsers appUsers) {
        this.appusers.remove(appUsers);
        appUsers.getRoles().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Roles)) {
            return false;
        }
        return id != null && id.equals(((Roles) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Roles{" +
            "id=" + getId() +
            ", roleName='" + getRoleName() + "'" +
            "}";
    }
}
