package intern.team3.obmr.service.impl;

import intern.team3.obmr.domain.Permissions;
import intern.team3.obmr.repository.PermissionsRepository;
import intern.team3.obmr.service.PermissionsService;
import intern.team3.obmr.service.dto.PermissionsDTO;
import intern.team3.obmr.service.mapper.PermissionsMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Permissions}.
 */
@Service
@Transactional
public class PermissionsServiceImpl implements PermissionsService {

    private final Logger log = LoggerFactory.getLogger(PermissionsServiceImpl.class);

    private final PermissionsRepository permissionsRepository;

    private final PermissionsMapper permissionsMapper;

    public PermissionsServiceImpl(PermissionsRepository permissionsRepository, PermissionsMapper permissionsMapper) {
        this.permissionsRepository = permissionsRepository;
        this.permissionsMapper = permissionsMapper;
    }

    @Override
    public PermissionsDTO save(PermissionsDTO permissionsDTO) {
        log.debug("Request to save Permissions : {}", permissionsDTO);
        Permissions permissions = permissionsMapper.toEntity(permissionsDTO);
        permissions = permissionsRepository.save(permissions);
        return permissionsMapper.toDto(permissions);
    }

    @Override
    public Optional<PermissionsDTO> partialUpdate(PermissionsDTO permissionsDTO) {
        log.debug("Request to partially update Permissions : {}", permissionsDTO);

        return permissionsRepository
            .findById(permissionsDTO.getId())
            .map(existingPermissions -> {
                permissionsMapper.partialUpdate(existingPermissions, permissionsDTO);

                return existingPermissions;
            })
            .map(permissionsRepository::save)
            .map(permissionsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PermissionsDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Permissions");
        return permissionsRepository.findAll(pageable).map(permissionsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PermissionsDTO> findOne(Long id) {
        log.debug("Request to get Permissions : {}", id);
        return permissionsRepository.findById(id).map(permissionsMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Permissions : {}", id);
        permissionsRepository.deleteById(id);
    }
}
