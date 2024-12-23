package intern.team3.obmr.service.mapper;

import intern.team3.obmr.domain.MeetingRooms;
import intern.team3.obmr.service.dto.MeetingRoomsDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link MeetingRooms} and its DTO {@link MeetingRoomsDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface MeetingRoomsMapper extends EntityMapper<MeetingRoomsDTO, MeetingRooms> {
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    MeetingRoomsDTO toDtoId(MeetingRooms meetingRooms);
}
