package ivi.obmt.apiuserlogin.service;

import ivi.obmt.apiuserlogin.model.User;
import ivi.obmt.apiuserlogin.model.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public String registerUser(User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return "User already exists!";
        }
        userRepository.save(user);
        return "User registered successfully!";
    }

    public String loginUser(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user == null || !user.getPassword().equals(password)) {
            return "Invalid username or password!";
        }
        return "Login successful!";
    }
}
