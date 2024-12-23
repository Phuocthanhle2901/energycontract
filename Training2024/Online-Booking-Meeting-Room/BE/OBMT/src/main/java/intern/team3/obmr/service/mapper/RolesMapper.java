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
    @Mapping(target = "permissions", source = "permissions", qualifiedByName = "idSet")
    RolesDTO toDto(Roles s);

    @Named("idSet")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    Set<RolesDTO> toDtoIdSet(Set<Roles> roles);

    @Mapping(target = "removePermissions", ignore = true)
    Roles toEntity(RolesDTO rolesDTO);
}
