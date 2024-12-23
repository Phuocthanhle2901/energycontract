package intern.team3.obmr.service.mapper;

import intern.team3.obmr.domain.AppUsers;
import intern.team3.obmr.service.dto.AppUsersDTO;
import java.util.Set;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link AppUsers} and its DTO {@link AppUsersDTO}.
 */
@Mapper(componentModel = "spring", uses = { RolesMapper.class, EventMeetingsMapper.class })
public interface AppUsersMapper extends EntityMapper<AppUsersDTO, AppUsers> {
    @Mapping(target = "roles", source = "roles", qualifiedByName = "idSet")
    @Mapping(target = "events", source = "events", qualifiedByName = "idSet")
    AppUsersDTO toDto(AppUsers s);

    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AppUsersDTO toDtoId(AppUsers appUsers);

    @Mapping(target = "removeRoles", ignore = true)
    @Mapping(target = "removeEvents", ignore = true)
    AppUsers toEntity(AppUsersDTO appUsersDTO);
}
