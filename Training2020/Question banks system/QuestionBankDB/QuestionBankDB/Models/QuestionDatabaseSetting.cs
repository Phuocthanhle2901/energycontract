using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuestionBankDB.Models
{
    public class QuestionDatabaseSetting : IQuestionBankSettings
    {
        public string UserInfoCollectionName { get; set; }
        public string UserAnswerCollectionName { get; set; }
        public string QuestionCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }
    public interface IQuestionBankSettings
    {
        public string UserInfoCollectionName { get; set; }
        public string UserAnswerCollectionName { get; set; }
        public string QuestionCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }
}
