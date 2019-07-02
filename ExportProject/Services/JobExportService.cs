using System;
using System.Collections.Generic;
using System.Text;

namespace Services
{

    public interface IJobExportService
    {
        void Export();
    }
    public class JobExportService : IJobExportService
    {
        //private JobExportServiceRepository _studentRepository;
        //public JobExportService(IStudentRepository studentRepository)
        //{
        //    _studentRepository = studentRepository;
        //}


        //public void Export()
        //{
        //   //_studentRepository.get   
        //}
        public void Export()
        {
            throw new NotImplementedException();
        }
    }
}
