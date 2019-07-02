using Entites.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace UnitOfWork
{
    public interface IJobExportService
    {
        Store GetExportByID(byte StoreId);
        void Export();
    }

}

