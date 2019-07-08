using Entites.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using Entites.Models;


namespace UnitOfWorks
{
    public class JobExportUnitRepository : IJobExportUnit,IDisposable
    {
        private ExportProjectContext _db = new ExportProjectContext();
        //public IEnumerable<Stores>GetData()
        //{
        //    return db.Stores.Single();
        public IEnumerable<Stores> LoadAllData()
        {
            return _db.Stores.ToList();
        }
        public Stores GetById(int id) {
            return _db.Stores.Find(id);
        }
        private bool disposed = false;
        public void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _db.Dispose();
                }
            }
            this.disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
