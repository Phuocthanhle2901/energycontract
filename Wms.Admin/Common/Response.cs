using System.Collections.Generic;

namespace Common
{
   public class Response<T>
    {
        public int Total { get; set; }
        public List<T> Items { get; set; }
    }
}
