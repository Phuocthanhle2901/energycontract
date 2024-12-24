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
    @Mapping(target = "meetingRoom", source = "meetingRoom", qualifiedByName = "name")
    EventMeetingsDTO toDto(EventMeetings s);

    @Named("titleSet")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    Set<EventMeetingsDTO> toDtoTitleSet(Set<EventMeetings> eventMeetings);

    @Named("title")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    EventMeetingsDTO toDtoTitle(EventMeetings eventMeetings);
}
