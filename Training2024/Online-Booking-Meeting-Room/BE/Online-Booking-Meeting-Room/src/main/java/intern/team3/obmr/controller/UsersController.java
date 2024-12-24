package intern.team3.obmr.controller;

import intern.team3.obmr.model.Users;
import intern.team3.obmr.service.LoginService;
import intern.team3.obmr.service.RegisterService;
import intern.team3.obmr.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UsersController {
    private final UsersService usersService;
    private final LoginService loginService;
    private final RegisterService registerService;

    @Autowired
    public UsersController(UsersService usersService,
                           LoginService loginService,
                           RegisterService registerService) {
        this.usersService = usersService;
        this.loginService = loginService;
        this.registerService = registerService;
    }

    @PostMapping("/login")
    public String loginUser(@RequestParam String username,
                            @RequestParam String password) {
        try {
            Users loggedInUser = loginService.loginUser(username, password);
            return "Login successful! Welcome, " + loggedInUser.getUsername();
        } catch (IllegalArgumentException e) {
            return "Login failed: " + e.getMessage();
        }
    }

    @PostMapping("/register")
    public String registerUser(@RequestParam String username,
                               @RequestParam String email,
                               @RequestParam String phoneNumber,
                               @RequestParam String password) {
        try {
            Users newUser = registerService.registerUser(username, email, phoneNumber, password);
            return "User registered successfully with ID: " + newUser.getId();
        } catch (IllegalArgumentException e) {
            return "Registration failed: " + e.getMessage();
        }
    }
}
