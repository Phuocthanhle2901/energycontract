package intern.team3.obmr.service.impl;

import intern.team3.obmr.domain.EventMeetings;
import intern.team3.obmr.repository.EventMeetingsRepository;
import intern.team3.obmr.service.EventMeetingsService;
import intern.team3.obmr.service.dto.EventMeetingsDTO;
import intern.team3.obmr.service.mapper.EventMeetingsMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link EventMeetings}.
 */
@Service
@Transactional
public class EventMeetingsServiceImpl implements EventMeetingsService {

    private final Logger log = LoggerFactory.getLogger(EventMeetingsServiceImpl.class);

    private final EventMeetingsRepository eventMeetingsRepository;

    private final EventMeetingsMapper eventMeetingsMapper;

    public EventMeetingsServiceImpl(EventMeetingsRepository eventMeetingsRepository, EventMeetingsMapper eventMeetingsMapper) {
        this.eventMeetingsRepository = eventMeetingsRepository;
        this.eventMeetingsMapper = eventMeetingsMapper;
    }

    @Override
    public EventMeetingsDTO save(EventMeetingsDTO eventMeetingsDTO) {
        log.debug("Request to save EventMeetings : {}", eventMeetingsDTO);
        EventMeetings eventMeetings = eventMeetingsMapper.toEntity(eventMeetingsDTO);
        eventMeetings = eventMeetingsRepository.save(eventMeetings);
        return eventMeetingsMapper.toDto(eventMeetings);
    }

    @Override
    public Optional<EventMeetingsDTO> partialUpdate(EventMeetingsDTO eventMeetingsDTO) {
        log.debug("Request to partially update EventMeetings : {}", eventMeetingsDTO);

        return eventMeetingsRepository
            .findById(eventMeetingsDTO.getId())
            .map(existingEventMeetings -> {
                eventMeetingsMapper.partialUpdate(existingEventMeetings, eventMeetingsDTO);

                return existingEventMeetings;
            })
            .map(eventMeetingsRepository::save)
            .map(eventMeetingsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventMeetingsDTO> findAll(Pageable pageable) {
        log.debug("Request to get all EventMeetings");
        return eventMeetingsRepository.findAll(pageable).map(eventMeetingsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EventMeetingsDTO> findOne(Long id) {
        log.debug("Request to get EventMeetings : {}", id);
        return eventMeetingsRepository.findById(id).map(eventMeetingsMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EventMeetings : {}", id);
        eventMeetingsRepository.deleteById(id);
    }
}
