using System.Web;
using System.Web.Mvc;

namespace QLThucTap_INFOdation_API_Call_Mobile
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
