package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.domain.Employee;
import vn.infodation.intern.group1.mas.domain.Form;
import vn.infodation.intern.group1.mas.domain.User;
import vn.infodation.intern.group1.mas.repository.EmployeeRepository;
import vn.infodation.intern.group1.mas.repository.FormRepository;
import vn.infodation.intern.group1.mas.security.AuthoritiesConstants;
import vn.infodation.intern.group1.mas.service.UserService;
import vn.infodation.intern.group1.mas.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link vn.infodation.intern.group1.mas.domain.Form}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FormResource {

    private final Logger log = LoggerFactory.getLogger(FormResource.class);

    private static final String ENTITY_NAME = "form";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormRepository formRepository;

    private final UserService userService;

    private final EmployeeRepository employeeRepository;

    public FormResource(FormRepository formRepository, UserService userService, EmployeeRepository employeeRepository) {
        this.formRepository = formRepository;
        this.userService = userService;
        this.employeeRepository = employeeRepository;
    }

    /**
     * {@code POST  /forms} : Create a new form.
     *
     * @param form the form to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new form, or with status {@code 400 (Bad Request)} if the form has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/forms")
    public ResponseEntity<Form> createForm(@Valid @RequestBody Form form) throws URISyntaxException {
        log.debug("REST request to save Form : {}", form);
        if (form.getId() != null) {
            throw new BadRequestAlertException("A new form cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Form result = formRepository.save(form);
        return ResponseEntity.created(new URI("/api/forms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /forms} : Updates an existing form.
     *
     * @param form the form to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated form,
     * or with status {@code 400 (Bad Request)} if the form is not valid,
     * or with status {@code 500 (Internal Server Error)} if the form couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/forms")
    public ResponseEntity<Form> updateForm(@Valid @RequestBody Form form) throws URISyntaxException {
        log.debug("REST request to update Form : {}", form);
        if (form.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Form result = formRepository.save(form);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, form.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /forms} : get all the forms.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of forms in body.
     */
    @GetMapping("/forms")
    public List<Form> getAllForms() {
        log.debug("REST request to get all Forms");
        List<String> au = userService.getAuthorities();
        if(au.contains(AuthoritiesConstants.ADMIN)){
            return formRepository.findAll();
        }
        else{
            User currentUser = userService.getUserWithAuthorities().get();
            Long id = employeeRepository.findOneByUser(currentUser).get().getId();
            return formRepository.findAllByEmployeeId(id);
        }
    }

    /**
     * {@code GET  /forms/:id} : get the "id" form.
     *
     * @param id the id of the form to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the form, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/forms/{id}")
    public ResponseEntity<Form> getForm(@PathVariable Long id) {
        log.debug("REST request to get Form : {}", id);
        Optional<Form> form = formRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(form);
    }

    /**
     * {@code DELETE  /forms/:id} : delete the "id" form.
     *
     * @param id the id of the form to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/forms/{id}")
    public ResponseEntity<Void> deleteForm(@PathVariable Long id) {
        log.debug("REST request to delete Form : {}", id);
        formRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
