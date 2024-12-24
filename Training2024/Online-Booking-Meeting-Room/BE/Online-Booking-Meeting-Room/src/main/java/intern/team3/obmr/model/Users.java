package intern.team3.obmr.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String email;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_created_at")
    private Instant resetTokenCreatedAt;

    @Column(name = "otp_code")
    private String otpCode;

    @Column(name = "otp_code_created_at")
    private Instant otpCodeCreatedAt;

    @Column(name = "otp_code_expired_at")
    private Instant otpCodeExpiredAt;

    @Column(name = "otp_is_verified", nullable = false)
    private Boolean otpIsVerified = false;

    @Column(name = "remember_token")
    private String rememberToken;

    @Column(name = "is_remembered")
    private Boolean isRemembered = false;

    @Column(name = "device_info")
    private String deviceInfo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.INACTIVE;

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

    public Instant getResetTokenCreatedAt() {
        return resetTokenCreatedAt;
    }

    public void setResetTokenCreatedAt(Instant resetTokenCreatedAt) {
        this.resetTokenCreatedAt = resetTokenCreatedAt;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public Instant getOtpCodeCreatedAt() {
        return otpCodeCreatedAt;
    }

    public void setOtpCodeCreatedAt(Instant otpCodeCreatedAt) {
        this.otpCodeCreatedAt = otpCodeCreatedAt;
    }

    public Instant getOtpCodeExpiredAt() {
        return otpCodeExpiredAt;
    }

    public void setOtpCodeExpiredAt(Instant otpCodeExpiredAt) {
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

    public Boolean getRemembered() {
        return isRemembered;
    }

    public void setRemembered(Boolean remembered) {
        isRemembered = remembered;
    }

    public String getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}
