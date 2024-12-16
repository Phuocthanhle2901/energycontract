package intern.team3.obmr.service;

import intern.team3.obmr.model.Role;
import intern.team3.obmr.model.Users;
import intern.team3.obmr.repository.RoleRepository;
import intern.team3.obmr.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private RoleRepository roleRepository;

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

    public String registerUser(String username, String password, String email, String roleName) {
        // Kiểm tra tên người dùng có tồn tại không
        if (usersRepository.findByUsername(username) != null) {
            return "Username already exists!";
        }

        // Kiểm tra email đã tồn tại chưa
        if (usersRepository.findByEmail(email) != null) {
            return "Email already exists!";
        }

        // Lấy Role từ cơ sở dữ liệu
        Role role = roleRepository.findByRoleName(roleName);
        if (role == null) {
            return "Role not found!";
        }

        // Tạo người dùng mới
        Users user = new Users();
        user.setUsername(username);
        user.setPassword(password);
        user.setEmail(email);
        user.setRole(role);

        // Lưu người dùng vào cơ sở dữ liệu
        usersRepository.save(user);
        return "Registration successful!";
    }
}
