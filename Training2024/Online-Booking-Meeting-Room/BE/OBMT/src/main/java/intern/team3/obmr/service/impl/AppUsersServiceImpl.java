package intern.team3.obmr.service.impl;

import intern.team3.obmr.domain.AppUsers;
import intern.team3.obmr.repository.AppUsersRepository;
import intern.team3.obmr.service.AppUsersService;
import intern.team3.obmr.service.dto.AppUsersDTO;
import intern.team3.obmr.service.mapper.AppUsersMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link AppUsers}.
 */
@Service
@Transactional
public class AppUsersServiceImpl implements AppUsersService {

    private final Logger log = LoggerFactory.getLogger(AppUsersServiceImpl.class);

    private final AppUsersRepository appUsersRepository;

    private final AppUsersMapper appUsersMapper;

    public AppUsersServiceImpl(AppUsersRepository appUsersRepository, AppUsersMapper appUsersMapper) {
        this.appUsersRepository = appUsersRepository;
        this.appUsersMapper = appUsersMapper;
    }

    @Override
    public AppUsersDTO save(AppUsersDTO appUsersDTO) {
        log.debug("Request to save AppUsers : {}", appUsersDTO);
        AppUsers appUsers = appUsersMapper.toEntity(appUsersDTO);
        appUsers = appUsersRepository.save(appUsers);
        return appUsersMapper.toDto(appUsers);
    }

    @Override
    public Optional<AppUsersDTO> partialUpdate(AppUsersDTO appUsersDTO) {
        log.debug("Request to partially update AppUsers : {}", appUsersDTO);

        return appUsersRepository
            .findById(appUsersDTO.getId())
            .map(existingAppUsers -> {
                appUsersMapper.partialUpdate(existingAppUsers, appUsersDTO);

                return existingAppUsers;
            })
            .map(appUsersRepository::save)
            .map(appUsersMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AppUsersDTO> findAll(Pageable pageable) {
        log.debug("Request to get all AppUsers");
        return appUsersRepository.findAll(pageable).map(appUsersMapper::toDto);
    }

    public Page<AppUsersDTO> findAllWithEagerRelationships(Pageable pageable) {
        return appUsersRepository.findAllWithEagerRelationships(pageable).map(appUsersMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AppUsersDTO> findOne(Long id) {
        log.debug("Request to get AppUsers : {}", id);
        return appUsersRepository.findOneWithEagerRelationships(id).map(appUsersMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete AppUsers : {}", id);
        appUsersRepository.deleteById(id);
    }
}
