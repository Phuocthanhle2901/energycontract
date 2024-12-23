package intern.team3.obmr.service.mapper;

import intern.team3.obmr.domain.EventUsers;
import intern.team3.obmr.service.dto.EventUsersDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link EventUsers} and its DTO {@link EventUsersDTO}.
 */
@Mapper(componentModel = "spring", uses = { AppUsersMapper.class, EventMeetingsMapper.class })
public interface EventUsersMapper extends EntityMapper<EventUsersDTO, EventUsers> {
    @Mapping(target = "appusers", source = "appusers", qualifiedByName = "id")
    @Mapping(target = "eventMeeting", source = "eventMeeting", qualifiedByName = "id")
    EventUsersDTO toDto(EventUsers s);
}
