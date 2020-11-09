using System.Collections.Generic;

namespace Entities.Sla
{
    public class Calendar
    {
        public Calendar()
        {
            CalendarDay = new HashSet<CalendarDay>();
            Rule = new HashSet<Rule>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public virtual ICollection<CalendarDay> CalendarDay { get; set; }
        public virtual ICollection<Rule> Rule { get; set; }
    }
}
