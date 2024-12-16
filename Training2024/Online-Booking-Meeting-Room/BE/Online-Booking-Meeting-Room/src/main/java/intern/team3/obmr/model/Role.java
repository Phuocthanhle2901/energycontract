package intern.team3.obmr.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "role")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roleName;

    @OneToMany(mappedBy = "role")
    private List<Users> users;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
    public List<Users> getUsers() { return users; }
    public void setUsers(List<Users> users) { this.users = users; }
}
