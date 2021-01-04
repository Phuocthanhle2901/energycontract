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
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import vn.infodation.intern.group1.mas.domain.Employee;
import vn.infodation.intern.group1.mas.domain.User;
import vn.infodation.intern.group1.mas.repository.EmployeeRepository;
import vn.infodation.intern.group1.mas.repository.UserRepository;
import vn.infodation.intern.group1.mas.service.dto.UserDTO;
import vn.infodation.intern.group1.mas.repository.AreaRepository;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class FileStorageService{
	private final String FILE_DIRECTORY = "/csv/users/";
	private final String DEFAULT_PASSWORD = "user";
	private final Path root = Paths.get(FILE_DIRECTORY);

	public FileStorageService(AreaRepository areaRepository, UserRepository userRepository,
			EmployeeRepository employeeRepository, UserService userService) {
		super();
		this.areaRepository = areaRepository;
		this.userRepository = userRepository;
		this.employeeRepository = employeeRepository;
		this.userService = userService;

        File directory = new File(FILE_DIRECTORY);
//        log.info("File directory {}", root);
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

	public void handleEmployeeFile(MultipartFile file) {
		Path filePath = Paths.get(FILE_DIRECTORY + "/" + file.getOriginalFilename());

		try {
	        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
			File convFile = filePath.toFile();
			FileReader  fr = new FileReader(convFile);
			BufferedReader br = new BufferedReader(fr);
			String line = br.readLine();
			while( (line = br.readLine()) != null) {
				if(!line.isBlank()) {
					String[] split = line.split(",");
					if(split.length == 8) {
						User user;
						Employee employee;
						boolean newEmp = false, newUser = false;

						if(!split[0].isBlank()) { //User id
							Long UID = Long.parseLong(split[0]);
							if(userRepository.existsById(UID)) {
								user = userRepository.getOne(UID);
								System.out.println("User existed");
							}
							else {
								System.out.println("User not found");
								continue;
							}
						}
						else {
							user = new User();
							System.out.println("New user");
							newUser = true;
						}

						if(!split[1].isBlank()) { //Employee id
							Long EID = Long.parseLong(split[1]);
							if(employeeRepository.existsById(EID)) {
								employee = employeeRepository.getOne(EID);
								System.out.println("Employee existed");
							}
							else {
								System.out.println("Employee not found");
								continue;
							}
						}
						else {
							employee = new Employee();
							System.out.println("New employee");
						}

						if(!split[2].isBlank())	//Employee - User login
							user.setLogin(split[2]);
						else if(newUser) continue;

						if(!split[3].isBlank()) 	//Employee - User's first name
							user.setFirstName(split[3]);
						else if(newUser) continue;

						if(!split[4].isBlank())	//Employee - User's last name
							user.setLastName(split[4]);
						else if(newUser) continue;

						if(!split[5].isBlank())	//Employee - User's email
							user.setEmail(split[5]);
						else if(newUser) continue;

						if(!split[6].isBlank()) {	//Employee's area
							Long AID = Long.parseLong(split[6]);
							if(areaRepository.existsById(AID))
								employee.setArea(areaRepository.getOne(AID));
							else if(newEmp) continue;
						}
						else continue;

						if(!split[7].isBlank())	//Employee's phone number
							employee.setPhoneNumber(split[7]);
						else if(newEmp) continue;

						User savedUser;
						if(newUser) {
							UserDTO userDTO = new UserDTO(user);
							savedUser = userService.registerUser(userDTO, DEFAULT_PASSWORD);
						}
						else {
							savedUser = userRepository.save(user);
						}

						if(employee.getUser() == null)
							employee.setUser(savedUser);
						else
							System.out.println("Cannot change user");
						employeeRepository.save(employee);

						System.out.println(
							"-------------------------------------\n" +
							"Saved User: \n" +
							"- ID: " + savedUser.getId() +"\n" +
							"- Login: " + savedUser.getLogin() +"\n" +
							"- Name: " + savedUser.getFirstName() + " " + savedUser.getLastName() +"\n" +
							"- Employee id: " + employee.getId() + "\n" +
							"- Area: " + employee.getArea().getAreaName() + "\n" +
							"-------------------------------------\n"
						);
					}
				}
			}

			br.close();
		}
		catch(IOException e){
			e.printStackTrace();
		}
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
    			final String fileHeader = "u_id,e_id,login,first_name,last_name,email,area_id,phone_number";
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
	            BufferedWriter bw = new BufferedWriter(fw);
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
    			final String fileHeader = "u_id,e_id,login,first_name,last_name,email,area_id,phone_number";
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
	            BufferedWriter bw = new BufferedWriter(fw);
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
		final String fileHeader = "u_id,e_id,login,first_name,last_name,email,area_id,phone_number";
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
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write(value);
            bw.close();
    	}catch (IOException e){
			e.printStackTrace();
		}
    }
}
