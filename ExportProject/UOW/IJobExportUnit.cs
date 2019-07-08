//using Entites.Models;
using Entites.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace UnitOfWorks
{

    public interface IJobExportUnit
    {
        //int StoreId { get; set; }
        //string StoreName { get; set; }
        //string Phone { get; set; }
        //string Street { get; set; }
        //string City { get; set; }
        //string State { get; set; }
        //string ZipCode { get; set; }
        //Stores GetById(int id);
        IEnumerable<Stores> LoadAllData();
    }
}
