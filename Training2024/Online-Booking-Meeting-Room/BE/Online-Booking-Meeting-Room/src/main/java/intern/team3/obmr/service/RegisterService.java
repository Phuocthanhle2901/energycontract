package intern.team3.obmr.service;

import intern.team3.obmr.model.UserStatus;
import intern.team3.obmr.model.Users;
import intern.team3.obmr.repository.UsersRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
@Service
public class RegisterService {
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public RegisterService(UsersRepository usersRepository, PasswordEncoder passwordEncoder){
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Users registerUser(String username, String email, String phoneNumber, String password) {
        if (usersRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        if (usersRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        Users newUser = new Users();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setPhoneNumber(phoneNumber);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setCreatedAt(Instant.now());
        newUser.setUpdatedAt(Instant.now());
        newUser.setStatus(UserStatus.INACTIVE);

        return usersRepository.save(newUser);
    }
}
