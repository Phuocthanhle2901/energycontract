using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace CifwCocon.NetworkInformation.Api.Helpers
{
    public class Helper
    {
        internal static string GetMessages(ModelStateDictionary modelState)
        {
            return string.Join(", ", modelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage));
        }
    }
}
