using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.DAL;
using Repository.Models;

namespace Repository
{
    public class Repository<TEntity> where TEntity : class
    {
        private InternContext Context = new InternContext();
        public DbSet<TEntity> DbSet;
        public Repository(InternContext context)
        {
            this.Context = context;
            this.DbSet = context.Set<TEntity>();
        }
        public virtual IEnumerable<TEntity> Get()
        {
            IQueryable<TEntity> query = DbSet;
            return query.ToList();

        }
        public virtual TEntity GetByID(object id)
        {
            return DbSet.Find(id);
        }
        public virtual void Insert(TEntity entity)
        {
            DbSet.Add(entity);
        }
        public virtual void Delete(object id)
        {
            TEntity entityToDelete = DbSet.Find(id);
            Delete(entityToDelete);
        }
        public virtual void Delete(TEntity entityToDelete)
        {
            if (Context.Entry(entityToDelete).State == EntityState.Detached)
            {
                DbSet.Attach(entityToDelete);
            }
            DbSet.Remove(entityToDelete);
        }
        public virtual void Update(TEntity entityToUpdate)
        {
            DbSet.Attach(entityToUpdate);
            Context.Entry(entityToUpdate).State = EntityState.Modified;
        }
        public void Delete(Func<TEntity, Boolean> where)
        {
            IQueryable<TEntity> objects = DbSet.Where<TEntity>(where).AsQueryable();
            foreach (TEntity obj in objects)
                DbSet.Remove(obj);
        }
        public virtual IEnumerable<TEntity> GetAll()
        {
            return DbSet.ToList();
        }
    }
}