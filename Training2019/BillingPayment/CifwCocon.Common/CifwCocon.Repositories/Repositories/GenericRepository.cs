using CifwCocon.Entities.Models;
using CifwCocon.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace CifwCocon.Repositories.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private CifwCocon2018Context context;
        private DbSet<T> DbSet;
        public GenericRepository(CifwCocon2018Context context)
        {
            this.context = context;
            var a = context.CoconAddress.ToList();
            this.DbSet = context.Set<T>();
        }

        public List<T> GetAll()
        {
            return DbSet.ToList();
        }

        public T GetById(object id)
        {
            return DbSet.Find(id);
        }

        public IEnumerable<T> GetByFilter(
            Expression<Func<T, bool>> filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            string includeProperties = "")
        {
            IQueryable<T> query = DbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            return orderBy != null ? orderBy(query).ToList() : query.ToList();
        }

        public bool Create(T t)
        {
                DbSet.Add(t);
                return Save();
        }

        public bool Update(T t)
        {
                context.Entry(t).State = EntityState.Modified;
                return Save();
        }

       

        public bool Delete(object id, bool forever = false)
        {
                var objectDelete = GetById(id);
                if (forever)
                {
                    context.Entry(objectDelete).State = EntityState.Deleted;
                }
                else
                {
                    typeof(T).GetProperty("IsEnabled").SetValue(objectDelete, false);
                    context.Entry(objectDelete).State = EntityState.Modified;
                }
                return Save();
        }

        public bool Save()
        {
            return context.SaveChanges() > 0;
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await DbSet.ToListAsync();
        }

        public async Task<T> GetByIdAsync(object id)
        {
            return await DbSet.FindAsync(id);
        }

        public async Task<IEnumerable<T>> GetByFilterAsync(
            Expression<Func<T, bool>> filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            string includeProperties = "")
        {
            IQueryable<T> query = DbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            return orderBy != null ? await orderBy(query).ToListAsync() : await query.ToListAsync();
        }

        public async Task<bool> CreateAsync(T t)
        {
                DbSet.Add(t);
                return await SaveAsync();
        }

        public async Task<bool> UpdateAsync(T t)
        {
                context.Entry(t).State = EntityState.Modified;
                return await SaveAsync();
        }

        public async Task<bool> DeleteAsync(object id, bool forever = false)
        {
                var objectDelete = await GetByIdAsync(id);
                if (forever)
                {
                    context.Entry(objectDelete).State = EntityState.Deleted;
                }
                else
                {
                    typeof(T).GetProperty("IsEnabled").SetValue(objectDelete, false);
                    context.Entry(objectDelete).State = EntityState.Modified;
                }
                return await SaveAsync();
        }

        public async Task<bool> SaveAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public bool AddOrUpdate(T t)
        {
            var entry = context.Entry(t);
            switch (entry.State)
            {
                case EntityState.Detached:
                    context.Add(t);
                    return Save();
                case EntityState.Modified:
                    context.Update(t);
                    return Save();
                case EntityState.Added:
                    context.Add(t);
                    return Save();
                case EntityState.Unchanged:
                    //item already in db no need to do anything  
                    break;

                default:
                    throw new ArgumentOutOfRangeException();
            }

            return false;
        }
    }
}
