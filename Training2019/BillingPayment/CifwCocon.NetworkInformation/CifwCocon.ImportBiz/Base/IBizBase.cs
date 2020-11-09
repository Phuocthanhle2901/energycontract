using AutoMapper;
using CifwCocon.ImportRepo.Base;

namespace CifwCocon.ImportBiz.Base
{
    public interface IBizBase<out T> where T : Entity
    {
        T MappEntityFromJson(string jsonData);
        T MappEntityFromObject<TS>(TS obj);
        void MappEntityFromObject<TS, TD>(TS source, TD destination);
    }
    public class BizBase<T> : IBizBase<T> where T : Entity
    {
        public virtual T MappEntityFromJson(string jsonData)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(jsonData);
        }
        public virtual T MappEntityFromObject<TS>(TS obj)
        {
            var result = Mapper.Map<TS, T>(obj);

            return result;
        }
        public virtual void MappEntityFromObject<TS, TD>(TS source)
        {
            Mapper.Map<TS, TD>(source);
        }
        public virtual void MappEntityFromObject<TS, TD>(TS source, TD destination)
        {
             Mapper.Map(source, destination);
        }
    }
}
