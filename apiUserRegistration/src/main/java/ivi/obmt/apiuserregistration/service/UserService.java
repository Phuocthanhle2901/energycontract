package ivi.obmt.apiuserregistration.service;

import ivi.obmt.apiuserregistration.model.User;
import ivi.obmt.apiuserregistration.model.UserRepository;
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
}