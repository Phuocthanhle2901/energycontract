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

        public List<AnswerUser> getAchievement(string email, int page) //get test results in a page
        {
            return _aswerUser.Find(answeruser => answeruser.Email == email).Limit(5).Skip(5 * page).ToList(); //5 results per page
        }

        //get count of questions of a specific theme
        public int GetResultCount(string email) => (int)_aswerUser.Find(result => result.Email.Equals(email)).CountDocuments();
    }

}
