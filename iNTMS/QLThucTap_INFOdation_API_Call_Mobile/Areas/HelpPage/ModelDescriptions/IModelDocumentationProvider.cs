using System;
using System.Reflection;

namespace QLThucTap_INFOdation_API_Call_Mobile.Areas.HelpPage.ModelDescriptions
{
    public interface IModelDocumentationProvider
    {
        string GetDocumentation(MemberInfo member);

        string GetDocumentation(Type type);
    }
}