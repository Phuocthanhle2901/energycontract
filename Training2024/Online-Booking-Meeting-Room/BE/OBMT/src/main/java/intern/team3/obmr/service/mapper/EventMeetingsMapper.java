package intern.team3.obmr.service.mapper;

import intern.team3.obmr.domain.EventMeetings;
import intern.team3.obmr.service.dto.EventMeetingsDTO;
import java.util.Set;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link EventMeetings} and its DTO {@link EventMeetingsDTO}.
 */
@Mapper(componentModel = "spring", uses = { MeetingRoomsMapper.class })
public interface EventMeetingsMapper extends EntityMapper<EventMeetingsDTO, EventMeetings> {
    @Mapping(target = "meetingRoom", source = "meetingRoom", qualifiedByName = "id")
    EventMeetingsDTO toDto(EventMeetings s);

    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    EventMeetingsDTO toDtoId(EventMeetings eventMeetings);

    @Named("idSet")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    Set<EventMeetingsDTO> toDtoIdSet(Set<EventMeetings> eventMeetings);
}
