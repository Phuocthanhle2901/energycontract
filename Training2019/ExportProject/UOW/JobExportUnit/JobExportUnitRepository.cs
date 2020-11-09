using Entites.Models;
using System;
using System.Collections.Generic;
using System.Linq;


namespace UnitOfWorks
{
    public class JobExportUnitRepository : IJobExportUnit,IDisposable
    {
        private ExportProjectContext _db = new ExportProjectContext();
        public IEnumerable<ViewExport> LoadAllData()
        {
            return _db.ViewExports.ToList();
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
