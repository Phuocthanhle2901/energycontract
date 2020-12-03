package vn.infodation.intern.group1.mas.service;

import java.io.IOException;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.google.protobuf.Option;

import vn.infodation.intern.group1.mas.domain.*;
import vn.infodation.intern.group1.mas.repository.EmployeeRepository;
import vn.infodation.intern.group1.mas.repository.UserRepository;

public class FileStorageService{
	private UserRepository userRepository;
	
	public String getFile(Long id, EmployeeRepository employeeRepository) {
		Employee employee = employeeRepository.findById(id).get();
		User user = employee.getUser();
		
		//CSV Format: id(user), login, firstName, lastName, email, phoneNumber, areaId
		
		final String SEPERATOR = ",";
		StringBuilder b = new StringBuilder();
		b.append(user.exportFormat())
			.append(SEPERATOR)
			.append(employee.getArea().getId());
		
		return b.toString();
	}
}