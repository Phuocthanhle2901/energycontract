package intern.team3.obmr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A EventUsers.
 */
@Entity
@Table(name = "event_users")
public class EventUsers implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "is_organizer", nullable = false)
    private Boolean isOrganizer;

    @ManyToOne
    @JsonIgnoreProperties(value = { "roles", "events" }, allowSetters = true)
    private AppUsers appusers;

    @ManyToOne
    @JsonIgnoreProperties(value = { "meetingRoom", "members" }, allowSetters = true)
    private EventMeetings eventMeeting;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EventUsers id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsOrganizer() {
        return this.isOrganizer;
    }

    public EventUsers isOrganizer(Boolean isOrganizer) {
        this.setIsOrganizer(isOrganizer);
        return this;
    }

    public void setIsOrganizer(Boolean isOrganizer) {
        this.isOrganizer = isOrganizer;
    }

    public AppUsers getAppusers() {
        return this.appusers;
    }

    public void setAppusers(AppUsers appUsers) {
        this.appusers = appUsers;
    }

    public EventUsers appusers(AppUsers appUsers) {
        this.setAppusers(appUsers);
        return this;
    }

    public EventMeetings getEventMeeting() {
        return this.eventMeeting;
    }

    public void setEventMeeting(EventMeetings eventMeetings) {
        this.eventMeeting = eventMeetings;
    }

    public EventUsers eventMeeting(EventMeetings eventMeetings) {
        this.setEventMeeting(eventMeetings);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventUsers)) {
            return false;
        }
        return id != null && id.equals(((EventUsers) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EventUsers{" +
            "id=" + getId() +
            ", isOrganizer='" + getIsOrganizer() + "'" +
            "}";
    }
}
