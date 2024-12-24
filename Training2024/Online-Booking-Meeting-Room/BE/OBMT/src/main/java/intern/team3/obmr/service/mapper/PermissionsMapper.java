package intern.team3.obmr.service.mapper;

import intern.team3.obmr.domain.Permissions;
import intern.team3.obmr.service.dto.PermissionsDTO;
import java.util.Set;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Permissions} and its DTO {@link PermissionsDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface PermissionsMapper extends EntityMapper<PermissionsDTO, Permissions> {
    @Named("permissionNameSet")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "permissionName", source = "permissionName")
    Set<PermissionsDTO> toDtoPermissionNameSet(Set<Permissions> permissions);
}
