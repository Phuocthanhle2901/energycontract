using log4net.Core;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;

namespace Cifw.Core.Logging
{
    public class JsonLayout : log4net.Layout.LayoutSkeleton
    {
        static readonly string ProcessSessionId = Guid.NewGuid().ToString();
        static readonly int ProcessId = Process.GetCurrentProcess().Id;
        static readonly string MachineName = Environment.MachineName;

        public override void ActivateOptions()
        {
        }

        public override void Format(TextWriter writer, LoggingEvent e)
        {
            var dic = new Dictionary<string, object>
            {
                ["processSessionId"] = ProcessSessionId,
                ["pid"] = ProcessId,
                ["machineName"] = MachineName,
                ["level"] = e.Level.DisplayName,
                ["messageObject"] = e.MessageObject,
                ["renderedMessage"] = e.RenderedMessage,
                ["requestTimeUtc"] = e.TimeStamp.ToUniversalTime().ToString("O"),
                ["logger"] = e.LoggerName,
                ["thread"] = e.ThreadName,
                ["exception"] = e.GetExceptionString()
            };

            try
            {
                var properties = e.GetProperties();
                var keys = properties.GetKeys();
                if (keys != null && keys.Length > 0)
                {
                    var rs = new Dictionary<string, string>();
                    for (var i = 0; i < keys.Length; i++)
                    {
                        dic.TryAdd(keys[i], properties[keys[i]]);
                    }
                }
            }
            catch
            {

            }

            writer.WriteLine(JsonConvert.SerializeObject(dic, Formatting.None, new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.None
            }));
        }
    }
}
