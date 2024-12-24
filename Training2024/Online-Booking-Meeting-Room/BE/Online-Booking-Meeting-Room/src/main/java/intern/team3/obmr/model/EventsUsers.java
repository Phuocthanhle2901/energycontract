package intern.team3.obmr.model;

import jakarta.persistence.*;

@Entity
@Table(name = "events_users")
public class EventsUsers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_meeting_id", nullable = false)
    private EventMeeting eventMeeting;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Users member;

    @Column(name = "is_organizer", nullable = false)
    private Boolean isOrganizer = false;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EventMeeting getEventMeeting() {
        return eventMeeting;
    }

    public void setEventMeeting(EventMeeting eventMeeting) {
        this.eventMeeting = eventMeeting;
    }

    public Users getMember() {
        return member;
    }

    public void setMember(Users member) {
        this.member = member;
    }

    public Boolean getOrganizer() {
        return isOrganizer;
    }

    public void setOrganizer(Boolean organizer) {
        isOrganizer = organizer;
    }
}
