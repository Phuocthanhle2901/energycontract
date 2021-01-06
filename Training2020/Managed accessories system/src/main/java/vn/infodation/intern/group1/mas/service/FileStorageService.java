package vn.infodation.intern.group1.mas.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import vn.infodation.intern.group1.mas.domain.Employee;
import vn.infodation.intern.group1.mas.domain.User;
import vn.infodation.intern.group1.mas.repository.EmployeeRepository;
import vn.infodation.intern.group1.mas.repository.UserRepository;
import vn.infodation.intern.group1.mas.service.dto.UserDTO;
import vn.infodation.intern.group1.mas.web.rest.errors.ErrorCode;
import vn.infodation.intern.group1.mas.web.rest.errors.PhoneValidate;
import vn.infodation.intern.group1.mas.repository.AreaRepository;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.hibernate.validator.internal.constraintvalidators.hv.EmailValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class FileStorageService{
	private final String FILE_DIRECTORY = "/csv/users/";
	private final String DEFAULT_PASSWORD = "user";
	private final Path root = Paths.get(FILE_DIRECTORY);
	private final Logger log = LoggerFactory.getLogger(FileStorageService.class);
	private static int defaultCharBufferSize = 8192;
	private final String fileHeader = "u_id,e_id,login,first_name,last_name,email,area_id,phone_number";

	private final String LOGIN = "Login";
	private final String FIRST_NAME = "First name";
	private final String LAST_NAME = "Last name";
	private final String EMAIL = "Email";
	private final String AREA_ID = "Area id";
	private final String PHONE = "Phone number";


	public FileStorageService(AreaRepository areaRepository, UserRepository userRepository,
			EmployeeRepository employeeRepository, UserService userService) {
		super();
		this.areaRepository = areaRepository;
		this.userRepository = userRepository;
		this.employeeRepository = employeeRepository;
		this.userService = userService;

        File directory = new File(FILE_DIRECTORY);
        if(!directory.exists())
            directory.mkdirs();
	}

	private AreaRepository areaRepository;
	private UserRepository userRepository;
	private EmployeeRepository employeeRepository;
	private UserService userService;

	public Resource load(String filename) {
	    try {
	    	Path file = root.resolve(filename);
	    	Resource resource = new UrlResource(file.toUri());

		    if (resource.exists() || resource.isReadable()) {
		    	return resource;
		    } else {
		        throw new RuntimeException("Could not read the file!");
		    }
	    } catch (MalformedURLException e) {
	    	throw new RuntimeException("Error: " + e.getMessage());
	    }
	}

	public Resource getEmployeeFile(String filename, HttpServletResponse response) {
		response.setContentType("text/csv; charset=utf-8");
		response.setHeader("Content-Disposition", "attachment; filename=" + filename);
		response.setHeader("filename", filename);

		return new FileSystemResource(FILE_DIRECTORY + filename);
	}

	public List<String[]> handleEmployeeFile(MultipartFile file) {
		Path filePath = Paths.get(FILE_DIRECTORY + "/" + file.getOriginalFilename());
		BufferedReader br = null;
		ErrorListBuilder errListBuilder = new ErrorListBuilder();
		List<Employee> employees = new ArrayList<>();
		List<User> users = new ArrayList<>();

		try {
	        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
			File convFile = filePath.toFile();
			FileReader  fr = new FileReader(convFile);
			String line;
			int lineNumber = 1;
			
			br = new BufferedReader(fr, defaultCharBufferSize);
			line = br.readLine();
			
			while( (line = br.readLine()) != null) {
				if(!line.isBlank()) {
					String[] split = line.split(",");
					if(split.length == 8) {
						User user;
						Employee employee;
						boolean newEmp = false;
						boolean newUser = false;

						if(!split[0].isBlank()) { //User id
							Long UID = Long.parseLong(split[0]);
							if(userRepository.existsById(UID)) {
								user = userRepository.getOne(UID);
								log.info("User existed");
							}
							else {
								log.info("User not found");
								continue;
							}
						}
						else {
							user = new User();
							log.info("New user");
							newUser = true;
						}

						if(!split[1].isBlank()) { //Employee id
							Long EID = Long.parseLong(split[1]);
							if(employeeRepository.existsById(EID)) {
								employee = employeeRepository.getOne(EID);
								log.info("Employee existed");
							}
							else {
								log.info("Employee not found");
								continue;
							}
						}
						else {
							employee = new Employee();
							log.info("New employee");
						}

						//Validating possible error of Login field and adding those error (if exist) to the error list
						errListBuilder.add(newUser && split[2].isBlank(), new String[]{
							ErrorCode.REQUIRED, Integer.toString(lineNumber), this.LOGIN, null
						})
						.add(split[2].contains(" "), new String[]{
							ErrorCode.NOT_CONTAINS_SPACES, Integer.toString(lineNumber), this.LOGIN, null
						})
						.add(!userRepository.findOneByLogin(split[2]).isEmpty(), new String[]{
							ErrorCode.USER_EXISTED, Integer.toString(lineNumber), this.LOGIN, null
						});
						
						//Validating possible error of First name field and adding those error (if exist) to the error list
						errListBuilder.add(newUser && split[3].isBlank(), new String[]{
							ErrorCode.REQUIRED, Integer.toString(lineNumber), this.FIRST_NAME, null
						})
						.add(split[3].startsWith(" "), new String[]{
							ErrorCode.NOT_CONTAINS_FIRST_SPACE, Integer.toString(lineNumber), this.FIRST_NAME, null
						})
						.add(split[3].matches(".*\\d.*"), new String[]{
							ErrorCode.NOT_CONTAINS_NUMBER, Integer.toString(lineNumber), this.FIRST_NAME, null
						});

						//Validating possible error of Last name field and adding those error (if exist) to the error list
						errListBuilder.add(newUser && split[4].isBlank(), new String[]{
							ErrorCode.REQUIRED, Integer.toString(lineNumber), this.LAST_NAME, null
						})
						.add(split[4].startsWith(" "), new String[]{
							ErrorCode.NOT_CONTAINS_FIRST_SPACE, Integer.toString(lineNumber), this.LAST_NAME, null
						})
						.add(split[4].matches(".*\\d.*"), new String[]{
							ErrorCode.NOT_CONTAINS_NUMBER, Integer.toString(lineNumber), this.LAST_NAME, null
						});

						//Validating possible error of Email field and adding those error (if exist) to the error list
						errListBuilder.add(newUser && split[5].isBlank(), new String[]{
							ErrorCode.REQUIRED, Integer.toString(lineNumber), this.EMAIL, null
						})
						.add(split[5].startsWith(" "), new String[]{
							ErrorCode.NOT_CONTAINS_FIRST_SPACE, Integer.toString(lineNumber), this.EMAIL, null
						})
						.add(split[5].contains(" "), new String[]{
							ErrorCode.NOT_CONTAINS_SPACES, Integer.toString(lineNumber), this.EMAIL, null
						})
						.add(new EmailValidator().isValid(split[5], null), new String[]{
							ErrorCode.EMAIL, Integer.toString(lineNumber), this.EMAIL, null
						});

						//Validating possible error of Area id field and adding those error (if exist) to the error list
						errListBuilder.add(newEmp && split[6].isBlank(), new String[]{
							ErrorCode.REQUIRED, Integer.toString(lineNumber), this.AREA_ID, null
						})
						.add(split[6].startsWith(" "), new String[]{
							ErrorCode.NOT_CONTAINS_FIRST_SPACE, Integer.toString(lineNumber), this.AREA_ID, null
						})
						.add(split[6].contains(" "), new String[]{
							ErrorCode.NOT_CONTAINS_SPACES, Integer.toString(lineNumber), this.AREA_ID, null
						});
						if(!split[6].matches("[0-9]+")){
							errListBuilder.add(!split[6].matches("[0-9]+"), new String[]{
								ErrorCode.NUMBER, Integer.toString(lineNumber), this.AREA_ID, null
							});
						}
						else if(!newEmp && !split[6].isBlank()){
							Long aId = Long.parseLong(split[6]);
							errListBuilder.add(!areaRepository.existsById(aId), new String[]{
								ErrorCode.NUMBER, Integer.toString(lineNumber), this.AREA_ID, null
							});
						}

						//Validating possible error of Phone number field and adding those error (if exist) to the error list
						errListBuilder.add(newEmp && split[7].isBlank(), new String[]{
							ErrorCode.REQUIRED, Integer.toString(lineNumber), this.PHONE, null
						})
						.add(split[7].startsWith(" "), new String[]{
							ErrorCode.NOT_CONTAINS_FIRST_SPACE, Integer.toString(lineNumber), this.PHONE, null
						}).
						add(!(new PhoneValidate().isValid(split[7])), new String[]{
							ErrorCode.INVALID_PHONE, Integer.toString(lineNumber), this.PHONE, null
						});

						lineNumber += 1;
						employees.add(employee);
						users.add(user);
					}
				}
			}
			List<String[]> errList = errListBuilder.build();

			if(errList.isEmpty()){
				for(int i = 0; i < users.size(); i++){
					User savedUser;
					User user = users.get(i);
					Employee employee = employees.get(i);

					if(userRepository.findOneByLogin(user.getLogin()).isPresent()) {
						UserDTO userDTO = new UserDTO(user);
						savedUser = userService.registerUser(userDTO, DEFAULT_PASSWORD);
					}
					else {
						savedUser = userRepository.save(user);
					}

					if(employee.getUser() == null)
						employee.setUser(savedUser);
					else
						log.info("Cannot change user");
					employeeRepository.save(employee);
				}
			}

			br.close();
		}
		catch(IOException e){
			e.printStackTrace();
		}
		finally{
			if(br != null){
				try{
					br.close();
				}
				catch(IOException e){
					e.printStackTrace();
				}
			}
		}

		return errListBuilder.build();
	}

	public void writeFile(Employee employee) {
    	String filename = employee.getUser().getLogin() + ".csv";
    	String path = "/csv/users/";

    	File directory = new File(path);
    	if(!directory.exists()) {
    		directory.mkdirs();
    	}

    	File file = new File(path + filename);
    	if(!file.exists()) {
    		try {
    			User user = employee.getUser();
    			final String SEPERATOR = ",";
    			
    			final String[] elements = new String[] {
    					user.getId().toString(),
    					employee.getId().toString(),
    					user.getLogin(),
    					user.getFirstName(),
    					user.getLastName(),
    					user.getEmail(),
    					employee.getArea().getId().toString(),
    					employee.getPhoneNumber()
    			};

    			String value = fileHeader + "\n";

    			for (String string : elements) {
    				value += string;
    				if(string != elements[elements.length - 1])
    					value += SEPERATOR;
				}

	    		FileWriter fw = new FileWriter(file.getAbsoluteFile());
	            BufferedWriter bw = new BufferedWriter(fw, defaultCharBufferSize);
	            bw.write(value);
	            bw.close();
    		}
    		catch (IOException e){
    			e.printStackTrace();
    		}
    	}
    }

	public void writeFile(User user) {
		Employee employee = null;
		for (Employee emp : employeeRepository.findAll()) {
			if(emp.getUser().getId() == user.getId()) {
				employee = emp;
				break;
			}
		}
		if(employee == null) return;
    	String filename = employee.getUser().getLogin() + ".csv";
    	String path = "/csv/users/";

    	File directory = new File(path);
    	if(!directory.exists()) {
    		directory.mkdirs();
    	}

    	File file = new File(path + filename);
    	if(!file.exists()) {
    		try {
    			final String SEPERATOR = ",";
    			final String[] elements = new String[] {
    					user.getId().toString(),
    					employee.getId().toString(),
    					user.getLogin(),
    					user.getFirstName(),
    					user.getLastName(),
    					user.getEmail(),
    					employee.getArea().getId().toString(),
    					employee.getPhoneNumber()
    			};

    			String value = fileHeader + "\n";

    			for (String string : elements) {
    				value += string;
    				if(string != elements[elements.length - 1])
    					value += SEPERATOR;
				}

	    		FileWriter fw = new FileWriter(file.getAbsoluteFile());
	            BufferedWriter bw = new BufferedWriter(fw, defaultCharBufferSize);
	            bw.write(value);
	            bw.close();
    		}
    		catch (IOException e){
    			e.printStackTrace();
    		}
    	}
    }

    public void writeFile() {
    	String filename = "users.csv";
    	String path = "/csv/users/";
    	List<Employee> x = employeeRepository.findAll();

    	File directory = new File(path);
    	if(!directory.exists()) {
    		directory.mkdirs();
    	}

    	File file = new File(path + filename);
		final String SEPERATOR = ",";
		String value = fileHeader + "\n";

    	try {
    		for (Employee employee : x) {
    			User user = employee.getUser();
    			final String[] elements = new String[] {
    					user.getId().toString(),
    					employee.getId().toString(),
    					user.getLogin(),
    					user.getFirstName(),
    					user.getLastName(),
    					user.getEmail(),
    					employee.getArea().getId().toString(),
    					employee.getPhoneNumber()
    			};

    			for (String string : elements) {
    				value += string;
    				if(string != elements[elements.length - 1])
    					value += SEPERATOR;
				}

    			value += "\n";
			}

    		FileWriter fw = new FileWriter(file.getAbsoluteFile());
            BufferedWriter bw = new BufferedWriter(fw, defaultCharBufferSize);
            bw.write(value);
            bw.close();
    	}catch (IOException e){
			e.printStackTrace();
		}
	}
	
	private class ErrorListBuilder{
		private List<String[]> errorList;

		public ErrorListBuilder(){ errorList = new ArrayList<>(); }

		public ErrorListBuilder add(boolean condition, String[] error){
			if(condition)
				this.errorList.add(error);
			return this;
		}

		public List<String[]> build(){
			return this.errorList;
		}
	}
}
