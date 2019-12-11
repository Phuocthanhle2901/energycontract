using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using QLThucTap_INFOdation.BusinessLogic.IService;
using QLThucTap_INFOdation.BusinessLogic.Service;
using Newtonsoft.Json.Serialization;
using Unity;
using Unity.Lifetime;

namespace QLThucTap_INFOdation.App
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            var container = new UnityContainer();             
            container.RegisterType<IProjectManagementService, ProjectManagementService>(new HierarchicalLifetimeManager());
            container.RegisterType<IManagerManagementService, ManagerManagementService>(new HierarchicalLifetimeManager());
            container.RegisterType<IStudentManagementService, StudentManagementService>(new HierarchicalLifetimeManager());
            container.RegisterType<IStudentCVManagementService, StudentCVManagementService>(new HierarchicalLifetimeManager());
            container.RegisterType<IProjectManagerManagementService, ProjectManagerManagementService>(new HierarchicalLifetimeManager());
            container.RegisterType<IInternshipManagementService, InternshipManagementService>(new HierarchicalLifetimeManager());
            container.RegisterType<IProjectInternManagementService, ProjectInternManagementService>(new HierarchicalLifetimeManager());
            container.RegisterType<IProjectInternManagerManagementService, ProjectInternManagerManagementService>(new HierarchicalLifetimeManager());
            container.RegisterType<IUserPermissionService, UserPermissionService>(new HierarchicalLifetimeManager());
            container.RegisterType<ITrainingManagerManagementService, TrainingManagerManagementService>(new HierarchicalLifetimeManager());
            container.RegisterType<IFunctionManagementService, FunctionManagementService>(new HierarchicalLifetimeManager());
            container.RegisterType<ILoginManagementService, LoginManagementService>(new HierarchicalLifetimeManager());
            container.RegisterType<ITrainingProgramManagementService, TrainingProgramManagementService>(new HierarchicalLifetimeManager());
            container.RegisterType<IContactManagementService, ContactManagementService>(new HierarchicalLifetimeManager());
            container.RegisterType<IEmailTemplateManagementService, EmailTemplateManagementService>(new HierarchicalLifetimeManager());


            config.DependencyResolver = new UnityResolver(container);

            //var json = config.Formatters.JsonFormatter;
            //json.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.Objects;
            //config.Formatters.Remove(config.Formatters.XmlFormatter);

            config.Formatters.Remove(config.Formatters.XmlFormatter);
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new System.Net.Http.Headers.MediaTypeHeaderValue("application/json"));
            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
