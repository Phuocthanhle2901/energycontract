using System;
using System.Collections.Generic;
using System.Text;
using Entites.Models;

namespace UnitOfWork
{
    public class JobExportRepository : IJobExportService, IDisposable
    {
        private sakilaContext context;

        public void Export()
        {
            throw new NotImplementedException();
        }

        public Store GetExportByID(byte StoreId)
        {
            return context.Store.ToList();
        }
        private bool disposed = false;

        public void Dispose(bool disposing)
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
    }
}
