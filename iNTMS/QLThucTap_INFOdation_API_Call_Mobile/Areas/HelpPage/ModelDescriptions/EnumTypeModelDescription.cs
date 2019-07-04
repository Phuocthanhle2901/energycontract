using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace QLThucTap_INFOdation_API_Call_Mobile.Areas.HelpPage.ModelDescriptions
{
    public class EnumTypeModelDescription : ModelDescription
    {
        public EnumTypeModelDescription()
        {
            Values = new Collection<EnumValueDescription>();
        }

        public Collection<EnumValueDescription> Values { get; private set; }
    }
}