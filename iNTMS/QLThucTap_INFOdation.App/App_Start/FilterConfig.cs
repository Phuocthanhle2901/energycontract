using System.Web;
using System.Web.Mvc;

namespace QLThucTap_INFOdation.App
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
