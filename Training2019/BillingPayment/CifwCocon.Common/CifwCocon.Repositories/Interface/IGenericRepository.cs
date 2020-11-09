using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace CifwCocon.Repositories.Interface
{
    public interface IGenericRepository<T> : IDisposable
    {
        #region Sync Method
        List<T> GetAll();
        T GetById(object id);
        IEnumerable<T> GetByFilter(
            Expression<Func<T, bool>> filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            string includeProperties = "");
        bool Create(T t);
        bool Update(T t);
        bool Delete(object id, bool forever = false);
        bool Save();
        #endregion

        #region Async Method
        Task<List<T>> GetAllAsync();
        Task<T> GetByIdAsync(object id);
        Task<IEnumerable<T>> GetByFilterAsync(
            Expression<Func<T, bool>> filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            string includeProperties = "");
        Task<bool> CreateAsync(T t);
        Task<bool> UpdateAsync(T t);
        Task<bool> DeleteAsync(object id, bool forever = false);
        Task<bool> SaveAsync();
        bool AddOrUpdate(T t);
        #endregion
    }
}
