package intern.team3.obmr.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link intern.team3.obmr.domain.AppUsers} entity.
 */
public class AppUsersDTO implements Serializable {

    private Long id;

    @NotNull
    private String username;

    @NotNull
    private String password;

    @NotNull
    private String email;

    @NotNull
    private String phoneNumber;

    private String resetToken;

    private ZonedDateTime resetTokenCreatedAt;

    private String otpCode;

    private ZonedDateTime otpCodeCreatedAt;

    private ZonedDateTime otpCodeExpiredAt;

    @NotNull
    private Boolean otpIsVerified;

    private String rememberToken;

    @NotNull
    private Boolean isRemembered;

    private String deviceInfo;

    @NotNull
    private ZonedDateTime createdAt;

    @NotNull
    private ZonedDateTime updatedAt;

    @NotNull
    private String status;

    private Set<RolesDTO> roles = new HashSet<>();

    private Set<EventMeetingsDTO> events = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public ZonedDateTime getResetTokenCreatedAt() {
        return resetTokenCreatedAt;
    }

    public void setResetTokenCreatedAt(ZonedDateTime resetTokenCreatedAt) {
        this.resetTokenCreatedAt = resetTokenCreatedAt;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public ZonedDateTime getOtpCodeCreatedAt() {
        return otpCodeCreatedAt;
    }

    public void setOtpCodeCreatedAt(ZonedDateTime otpCodeCreatedAt) {
        this.otpCodeCreatedAt = otpCodeCreatedAt;
    }

    public ZonedDateTime getOtpCodeExpiredAt() {
        return otpCodeExpiredAt;
    }

    public void setOtpCodeExpiredAt(ZonedDateTime otpCodeExpiredAt) {
        this.otpCodeExpiredAt = otpCodeExpiredAt;
    }

    public Boolean getOtpIsVerified() {
        return otpIsVerified;
    }

    public void setOtpIsVerified(Boolean otpIsVerified) {
        this.otpIsVerified = otpIsVerified;
    }

    public String getRememberToken() {
        return rememberToken;
    }

    public void setRememberToken(String rememberToken) {
        this.rememberToken = rememberToken;
    }

    public Boolean getIsRemembered() {
        return isRemembered;
    }

    public void setIsRemembered(Boolean isRemembered) {
        this.isRemembered = isRemembered;
    }

    public String getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<RolesDTO> getRoles() {
        return roles;
    }

    public void setRoles(Set<RolesDTO> roles) {
        this.roles = roles;
    }

    public Set<EventMeetingsDTO> getEvents() {
        return events;
    }

    public void setEvents(Set<EventMeetingsDTO> events) {
        this.events = events;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AppUsersDTO)) {
            return false;
        }

        AppUsersDTO appUsersDTO = (AppUsersDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, appUsersDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppUsersDTO{" +
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
            ", roles=" + getRoles() +
            ", events=" + getEvents() +
            "}";
    }
}
