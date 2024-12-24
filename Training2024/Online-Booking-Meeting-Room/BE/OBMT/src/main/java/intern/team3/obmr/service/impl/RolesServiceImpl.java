package intern.team3.obmr.service.impl;

import intern.team3.obmr.domain.Roles;
import intern.team3.obmr.repository.RolesRepository;
import intern.team3.obmr.service.RolesService;
import intern.team3.obmr.service.dto.RolesDTO;
import intern.team3.obmr.service.mapper.RolesMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Roles}.
 */
@Service
@Transactional
public class RolesServiceImpl implements RolesService {

    private final Logger log = LoggerFactory.getLogger(RolesServiceImpl.class);

    private final RolesRepository rolesRepository;

    private final RolesMapper rolesMapper;

    public RolesServiceImpl(RolesRepository rolesRepository, RolesMapper rolesMapper) {
        this.rolesRepository = rolesRepository;
        this.rolesMapper = rolesMapper;
    }

    @Override
    public RolesDTO save(RolesDTO rolesDTO) {
        log.debug("Request to save Roles : {}", rolesDTO);
        Roles roles = rolesMapper.toEntity(rolesDTO);
        roles = rolesRepository.save(roles);
        return rolesMapper.toDto(roles);
    }

    @Override
    public Optional<RolesDTO> partialUpdate(RolesDTO rolesDTO) {
        log.debug("Request to partially update Roles : {}", rolesDTO);

        return rolesRepository
            .findById(rolesDTO.getId())
            .map(existingRoles -> {
                rolesMapper.partialUpdate(existingRoles, rolesDTO);

                return existingRoles;
            })
            .map(rolesRepository::save)
            .map(rolesMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RolesDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Roles");
        return rolesRepository.findAll(pageable).map(rolesMapper::toDto);
    }

    public Page<RolesDTO> findAllWithEagerRelationships(Pageable pageable) {
        return rolesRepository.findAllWithEagerRelationships(pageable).map(rolesMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RolesDTO> findOne(Long id) {
        log.debug("Request to get Roles : {}", id);
        return rolesRepository.findOneWithEagerRelationships(id).map(rolesMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Roles : {}", id);
        rolesRepository.deleteById(id);
    }
}
