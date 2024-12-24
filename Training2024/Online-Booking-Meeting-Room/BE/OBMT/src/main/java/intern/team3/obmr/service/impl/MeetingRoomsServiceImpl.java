package intern.team3.obmr.service.impl;

import intern.team3.obmr.domain.MeetingRooms;
import intern.team3.obmr.repository.MeetingRoomsRepository;
import intern.team3.obmr.service.MeetingRoomsService;
import intern.team3.obmr.service.dto.MeetingRoomsDTO;
import intern.team3.obmr.service.mapper.MeetingRoomsMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link MeetingRooms}.
 */
@Service
@Transactional
public class MeetingRoomsServiceImpl implements MeetingRoomsService {

    private final Logger log = LoggerFactory.getLogger(MeetingRoomsServiceImpl.class);

    private final MeetingRoomsRepository meetingRoomsRepository;

    private final MeetingRoomsMapper meetingRoomsMapper;

    public MeetingRoomsServiceImpl(MeetingRoomsRepository meetingRoomsRepository, MeetingRoomsMapper meetingRoomsMapper) {
        this.meetingRoomsRepository = meetingRoomsRepository;
        this.meetingRoomsMapper = meetingRoomsMapper;
    }

    @Override
    public MeetingRoomsDTO save(MeetingRoomsDTO meetingRoomsDTO) {
        log.debug("Request to save MeetingRooms : {}", meetingRoomsDTO);
        MeetingRooms meetingRooms = meetingRoomsMapper.toEntity(meetingRoomsDTO);
        meetingRooms = meetingRoomsRepository.save(meetingRooms);
        return meetingRoomsMapper.toDto(meetingRooms);
    }

    @Override
    public Optional<MeetingRoomsDTO> partialUpdate(MeetingRoomsDTO meetingRoomsDTO) {
        log.debug("Request to partially update MeetingRooms : {}", meetingRoomsDTO);

        return meetingRoomsRepository
            .findById(meetingRoomsDTO.getId())
            .map(existingMeetingRooms -> {
                meetingRoomsMapper.partialUpdate(existingMeetingRooms, meetingRoomsDTO);

                return existingMeetingRooms;
            })
            .map(meetingRoomsRepository::save)
            .map(meetingRoomsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MeetingRoomsDTO> findAll(Pageable pageable) {
        log.debug("Request to get all MeetingRooms");
        return meetingRoomsRepository.findAll(pageable).map(meetingRoomsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MeetingRoomsDTO> findOne(Long id) {
        log.debug("Request to get MeetingRooms : {}", id);
        return meetingRoomsRepository.findById(id).map(meetingRoomsMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete MeetingRooms : {}", id);
        meetingRoomsRepository.deleteById(id);
    }
}
