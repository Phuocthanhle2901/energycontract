package intern.team3.obmr.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link intern.team3.obmr.domain.EventUsers} entity.
 */
public class EventUsersDTO implements Serializable {

    private Long id;

    @NotNull
    private Boolean isOrganizer;

    private AppUsersDTO appusers;

    private EventMeetingsDTO eventMeeting;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsOrganizer() {
        return isOrganizer;
    }

    public void setIsOrganizer(Boolean isOrganizer) {
        this.isOrganizer = isOrganizer;
    }

    public AppUsersDTO getAppusers() {
        return appusers;
    }

    public void setAppusers(AppUsersDTO appusers) {
        this.appusers = appusers;
    }

    public EventMeetingsDTO getEventMeeting() {
        return eventMeeting;
    }

    public void setEventMeeting(EventMeetingsDTO eventMeeting) {
        this.eventMeeting = eventMeeting;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventUsersDTO)) {
            return false;
        }

        EventUsersDTO eventUsersDTO = (EventUsersDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, eventUsersDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EventUsersDTO{" +
            "id=" + getId() +
            ", isOrganizer='" + getIsOrganizer() + "'" +
            ", appusers=" + getAppusers() +
            ", eventMeeting=" + getEventMeeting() +
            "}";
    }
}
