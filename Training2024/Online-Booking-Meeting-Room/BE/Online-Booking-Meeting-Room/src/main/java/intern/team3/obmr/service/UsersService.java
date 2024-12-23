package intern.team3.obmr.service;

import intern.team3.obmr.model.Users;
import intern.team3.obmr.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersService {
    private final UsersRepository usersRepository;

    @Autowired
    public UsersService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    // Phương thức lấy tất cả người dùng
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }
}
