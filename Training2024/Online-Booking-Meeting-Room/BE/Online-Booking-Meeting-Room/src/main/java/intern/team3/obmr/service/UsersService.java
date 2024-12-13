package intern.team3.obmr.service;

import intern.team3.obmr.model.Users;
import intern.team3.obmr.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;

    public String registerUser(Users user) {
        if (usersRepository.findByUsername(user.getUsername()) != null) {
            return "User already exists!";
        }
        usersRepository.save(user);
        return "User registered successfully!";
    }

    public String loginUser(String username, String password) {
        Users user = usersRepository.findByUsername(username);
        if (user == null || !user.getPassword().equals(password)) {
            return "Invalid username or password!";
        }
        return "Login successful!";
    }
}
