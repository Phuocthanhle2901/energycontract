package intern.team3.obmr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A AppUsers.
 */
@Entity
@Table(name = "app_users")
public class AppUsers implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "username", nullable = false)
    private String username;

    @NotNull
    @Column(name = "password", nullable = false)
    private String password;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_created_at")
    private ZonedDateTime resetTokenCreatedAt;

    @Column(name = "otp_code")
    private String otpCode;

    @Column(name = "otp_code_created_at")
    private ZonedDateTime otpCodeCreatedAt;

    @Column(name = "otp_code_expired_at")
    private ZonedDateTime otpCodeExpiredAt;

    @NotNull
    @Column(name = "otp_is_verified", nullable = false)
    private Boolean otpIsVerified;

    @Column(name = "remember_token")
    private String rememberToken;

    @NotNull
    @Column(name = "is_remembered", nullable = false)
    private Boolean isRemembered;

    @Column(name = "device_info")
    private String deviceInfo;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;

    @NotNull
    @Column(name = "updated_at", nullable = false)
    private ZonedDateTime updatedAt;

    @NotNull
    @Column(name = "status", nullable = false)
    private String status;

    @ManyToMany
    @JoinTable(
        name = "rel_app_users__roles",
        joinColumns = @JoinColumn(name = "app_users_id"),
        inverseJoinColumns = @JoinColumn(name = "roles_id")
    )
    @JsonIgnoreProperties(value = { "permissions", "appusers" }, allowSetters = true)
    private Set<Roles> roles = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_app_users__events",
        joinColumns = @JoinColumn(name = "app_users_id"),
        inverseJoinColumns = @JoinColumn(name = "events_id")
    )
    @JsonIgnoreProperties(value = { "meetingRoom", "members" }, allowSetters = true)
    private Set<EventMeetings> events = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AppUsers id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return this.username;
    }

    public AppUsers username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public AppUsers password(String password) {
        this.setPassword(password);
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return this.email;
    }

    public AppUsers email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public AppUsers phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getResetToken() {
        return this.resetToken;
    }

    public AppUsers resetToken(String resetToken) {
        this.setResetToken(resetToken);
        return this;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public ZonedDateTime getResetTokenCreatedAt() {
        return this.resetTokenCreatedAt;
    }

    public AppUsers resetTokenCreatedAt(ZonedDateTime resetTokenCreatedAt) {
        this.setResetTokenCreatedAt(resetTokenCreatedAt);
        return this;
    }

    public void setResetTokenCreatedAt(ZonedDateTime resetTokenCreatedAt) {
        this.resetTokenCreatedAt = resetTokenCreatedAt;
    }

    public String getOtpCode() {
        return this.otpCode;
    }

    public AppUsers otpCode(String otpCode) {
        this.setOtpCode(otpCode);
        return this;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public ZonedDateTime getOtpCodeCreatedAt() {
        return this.otpCodeCreatedAt;
    }

    public AppUsers otpCodeCreatedAt(ZonedDateTime otpCodeCreatedAt) {
        this.setOtpCodeCreatedAt(otpCodeCreatedAt);
        return this;
    }

    public void setOtpCodeCreatedAt(ZonedDateTime otpCodeCreatedAt) {
        this.otpCodeCreatedAt = otpCodeCreatedAt;
    }

    public ZonedDateTime getOtpCodeExpiredAt() {
        return this.otpCodeExpiredAt;
    }

    public AppUsers otpCodeExpiredAt(ZonedDateTime otpCodeExpiredAt) {
        this.setOtpCodeExpiredAt(otpCodeExpiredAt);
        return this;
    }

    public void setOtpCodeExpiredAt(ZonedDateTime otpCodeExpiredAt) {
        this.otpCodeExpiredAt = otpCodeExpiredAt;
    }

    public Boolean getOtpIsVerified() {
        return this.otpIsVerified;
    }

    public AppUsers otpIsVerified(Boolean otpIsVerified) {
        this.setOtpIsVerified(otpIsVerified);
        return this;
    }

    public void setOtpIsVerified(Boolean otpIsVerified) {
        this.otpIsVerified = otpIsVerified;
    }

    public String getRememberToken() {
        return this.rememberToken;
    }

    public AppUsers rememberToken(String rememberToken) {
        this.setRememberToken(rememberToken);
        return this;
    }

    public void setRememberToken(String rememberToken) {
        this.rememberToken = rememberToken;
    }

    public Boolean getIsRemembered() {
        return this.isRemembered;
    }

    public AppUsers isRemembered(Boolean isRemembered) {
        this.setIsRemembered(isRemembered);
        return this;
    }

    public void setIsRemembered(Boolean isRemembered) {
        this.isRemembered = isRemembered;
    }

    public String getDeviceInfo() {
        return this.deviceInfo;
    }

    public AppUsers deviceInfo(String deviceInfo) {
        this.setDeviceInfo(deviceInfo);
        return this;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public AppUsers createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public AppUsers updatedAt(ZonedDateTime updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getStatus() {
        return this.status;
    }

    public AppUsers status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<Roles> getRoles() {
        return this.roles;
    }

    public void setRoles(Set<Roles> roles) {
        this.roles = roles;
    }

    public AppUsers roles(Set<Roles> roles) {
        this.setRoles(roles);
        return this;
    }

    public AppUsers addRoles(Roles roles) {
        this.roles.add(roles);
        roles.getAppusers().add(this);
        return this;
    }

    public AppUsers removeRoles(Roles roles) {
        this.roles.remove(roles);
        roles.getAppusers().remove(this);
        return this;
    }

    public Set<EventMeetings> getEvents() {
        return this.events;
    }

    public void setEvents(Set<EventMeetings> eventMeetings) {
        this.events = eventMeetings;
    }

    public AppUsers events(Set<EventMeetings> eventMeetings) {
        this.setEvents(eventMeetings);
        return this;
    }

    public AppUsers addEvents(EventMeetings eventMeetings) {
        this.events.add(eventMeetings);
        eventMeetings.getMembers().add(this);
        return this;
    }

    public AppUsers removeEvents(EventMeetings eventMeetings) {
        this.events.remove(eventMeetings);
        eventMeetings.getMembers().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AppUsers)) {
            return false;
        }
        return id != null && id.equals(((AppUsers) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppUsers{" +
            "id=" + getId() +
            ", username='" + getUsername() + "'" +
            ", password='" + getPassword() + "'" +
            ", email='" + getEmail() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", resetToken='" + getResetToken() + "'" +
            ", resetTokenCreatedAt='" + getResetTokenCreatedAt() + "'" +
            ", otpCode='" + getOtpCode() + "'" +
            ", otpCodeCreatedAt='" + getOtpCodeCreatedAt() + "'" +
            ", otpCodeExpiredAt='" + getOtpCodeExpiredAt() + "'" +
            ", otpIsVerified='" + getOtpIsVerified() + "'" +
            ", rememberToken='" + getRememberToken() + "'" +
            ", isRemembered='" + getIsRemembered() + "'" +
            ", deviceInfo='" + getDeviceInfo() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
