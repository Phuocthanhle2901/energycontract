package vn.infodation.intern.group1.mas.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import vn.infodation.intern.group1.mas.domain.Employee;
import vn.infodation.intern.group1.mas.domain.User;
import vn.infodation.intern.group1.mas.repository.EmployeeRepository;
import vn.infodation.intern.group1.mas.repository.UserRepository;
import vn.infodation.intern.group1.mas.repository.AreaRepository;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class FileStorageService{
	private final String FILE_DIRECTORY = "/csv/users/";
	private final String DEFAULT_PASSWORD = "user";

	public FileStorageService(AreaRepository areaRepository, UserRepository userRepository,
			EmployeeRepository employeeRepository) {
		super();
		this.areaRepository = areaRepository;
		this.userRepository = userRepository;
		this.employeeRepository = employeeRepository;
	}

	private AreaRepository areaRepository;
	private UserRepository userRepository;
	private EmployeeRepository employeeRepository;
	
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
					
						if(!split[0].isBlank()) { //User id
							Long UID = Long.parseLong(split[0]);
							if(!userRepository.findById(UID).isEmpty()) {
								user = userRepository.getOne(UID);
								System.out.println("Existed");
							}
							else {System.out.println("Non Existing"); continue;}
						}
						else {
							user = new User();
							user.setPassword(DEFAULT_PASSWORD);
						}
						
						if(!split[1].isBlank()) { //Employee id
							Long EID = Long.parseLong(split[1]);
							if(!employeeRepository.findById(EID).isEmpty())
								employee = employeeRepository.getOne(EID);
							else continue;
						}
						else
							employee = new Employee();
						
						if(!split[2].isBlank())	//Employee - User login
							user.setLogin(split[2]);	
						else continue;
						
						if(!split[3].isBlank())	//Employee - User's first name
							user.setFirstName(split[3]);
						else continue;
						
						if(!split[4].isBlank())	//Employee - User's last name
							user.setLastName(split[4]);
						else continue;
						
						if(!split[5].isBlank())	//Employee - User's email
							user.setEmail(split[5]);
						else continue;
						
						if(!split[6].isBlank()) {	//Employee's area
							Long AID = Long.parseLong(split[6]);
							if(!areaRepository.findById(AID).isEmpty())
								employee.setArea(areaRepository.getOne(AID));
							else continue;
						}
						else continue;
						
						if(!split[7].isBlank())	//Employee's phone number
							employee.setPhoneNumber(split[7]);
						else continue;
						
						System.out.println(
							"--------------------------------------------------------------\n" +
							"User: {\n" +
							"\tID: " + user.getId() +"\n" +
							"\tLogin: " + user.getLogin() +"\n" +
							"\tName: " + user.getFirstName() + " " + user.getLastName() +"\n" +
							"}"
						);
						
						User savedUser = userRepository.save(user);
						employee.setUser(user);
						employeeRepository.save(employee);
						
						System.out.println(
							"--------------------------------------------------------------\n" +
							"Saved User: {\n" +
							"\tID: " + savedUser.getId() +"\n" +
							"\tLogin: " + savedUser.getLogin() +"\n" +
							"\tName: " + savedUser.getFirstName() + " " + savedUser.getLastName() +"\n" +
							"}"
						);
					}
				}
			}
		}
		catch(IOException e){
			e.printStackTrace();
		}
	}
}