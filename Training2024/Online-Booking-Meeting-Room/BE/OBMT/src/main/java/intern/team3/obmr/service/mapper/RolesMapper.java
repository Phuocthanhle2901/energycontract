package intern.team3.obmr.service.mapper;

import intern.team3.obmr.domain.Roles;
import intern.team3.obmr.service.dto.RolesDTO;
import java.util.Set;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Roles} and its DTO {@link RolesDTO}.
 */
@Mapper(componentModel = "spring", uses = { PermissionsMapper.class })
public interface RolesMapper extends EntityMapper<RolesDTO, Roles> {
    @Mapping(target = "permissions", source = "permissions", qualifiedByName = "permissionNameSet")
    RolesDTO toDto(Roles s);

    @Mapping(target = "removePermissions", ignore = true)
    Roles toEntity(RolesDTO rolesDTO);

    @Named("roleNameSet")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "roleName", source = "roleName")
    Set<RolesDTO> toDtoRoleNameSet(Set<Roles> roles);
}
