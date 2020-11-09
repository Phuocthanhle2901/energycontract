using System;

namespace Entities.Sla
{
    public class CalendarDay
    {
        public int Id { get; set; }
        public int CalendarId { get; set; }
        public DateTime WorkStart { get; set; }
        public DateTime WorkEnd { get; set; }
        public int WorkDuration { get; set; }
        public sbyte? IsHoliday { get; set; }
        public string Note { get; set; }

        public virtual Calendar Calendar { get; set; }
    }
}
