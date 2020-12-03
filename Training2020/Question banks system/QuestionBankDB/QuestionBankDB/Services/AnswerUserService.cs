using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using QuestionBankDB.Models;

namespace QuestionBankDB.Services
{
    public class AnswerUserService
    {
        private readonly IMongoCollection<AnswerUser> _aswerUser;

        public AnswerUserService(IQuestionBankSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _aswerUser = database.GetCollection<AnswerUser>(settings.UserAnswerCollectionName);
        }

        public List<AnswerUser> Get() =>
            _aswerUser.Find(AnswerUser => true).ToList();

        public AnswerUser Get(string id) =>
            _aswerUser.Find<AnswerUser>(AnswerUser => AnswerUser.Id == id).FirstOrDefault();

        public AnswerUser Create(AnswerUser answerUser)
        {
            _aswerUser.InsertOne(answerUser);
            return answerUser;
        }

        public void Update(string id, AnswerUser answerUserId) =>
            _aswerUser.ReplaceOne(answerUser => answerUser.Id == id, answerUserId);

        public void Remove(AnswerUser answerUserIn) =>
            _aswerUser.DeleteOne(answerUser => answerUser.Id == answerUserIn.Id);

        public void Remove(string id) =>
            _aswerUser.DeleteOne(answerUser => answerUser.Id == id);
    }

}
