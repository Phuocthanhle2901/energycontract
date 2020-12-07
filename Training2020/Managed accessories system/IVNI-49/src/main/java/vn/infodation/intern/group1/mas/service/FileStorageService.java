package vn.infodation.intern.group1.mas.service;

import javax.servlet.http.HttpServletResponse;

import vn.infodation.intern.group1.mas.repository.UserRepository;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class FileStorageService{
	private final String FILE_DIRECTORY = "/csv/users/";
	
	public Resource getFile(String filename, HttpServletResponse response) {
		response.setContentType("text/csv; charset=utf-8");
		response.setHeader("Content-Disposition", "attachment; filename=" + filename);
		response.setHeader("filename", filename);
		
		return new FileSystemResource(FILE_DIRECTORY + filename);
	}
}