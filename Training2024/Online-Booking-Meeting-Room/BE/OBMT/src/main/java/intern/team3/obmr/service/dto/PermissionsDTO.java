package intern.team3.obmr.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link intern.team3.obmr.domain.Permissions} entity.
 */
public class PermissionsDTO implements Serializable {

    private Long id;

    @NotNull
    private String permissionName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPermissionName() {
        return permissionName;
    }

    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PermissionsDTO)) {
            return false;
        }

        PermissionsDTO permissionsDTO = (PermissionsDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, permissionsDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PermissionsDTO{" +
            "id=" + getId() +
            ", permissionName='" + getPermissionName() + "'" +
            "}";
    }
}
