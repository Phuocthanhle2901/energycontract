using System.Threading.Tasks;

namespace CifwCocon.Repositories.Interface
{
    public interface IUnitOfWork
    {
        void Commit();
        Task CommitAsync();
    }
}
