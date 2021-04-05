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
        private readonly QuestionService _question;
        public AnswerUserService(IQuestionBankSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _aswerUser = database.GetCollection<AnswerUser>(settings.UserAnswerCollectionName);
            _question = new QuestionService(settings);
        }

        public List<AnswerUser> Get() =>
            _aswerUser.Find(AnswerUser => true).ToList();

        public AnswerUser Get(string id) =>
            _aswerUser.Find<AnswerUser>(AnswerUser => AnswerUser.Id == id).FirstOrDefault();

        public int Create(AnswerUser answerUser)
        {
            Question question = new Question();
            for (int i=0; i<answerUser.Listquestion.Length; i++)
            {
                question = _question.Get(answerUser.Listquestion[i].Id); //fetch question from QuestionService
                //Set question and correct answer
                answerUser.Listquestion[i].TrueAnswer = question.TrueAnswer;
                answerUser.Listquestion[i].Question = question.question;
                //check if answer is correct
                if(answerUser.Listquestion[i].UserAnswer.Length == question.TrueAnswer.Length)
                {
                    int j = 0;
                    while (j < answerUser.Listquestion[i].UserAnswer.Length)
                    {
                        if (question.TrueAnswer.Contains(answerUser.Listquestion[i].UserAnswer[j])) j++;
                        else break;
                    }
                    if (j == answerUser.Listquestion[i].UserAnswer.Length)
                    {
                        answerUser.Summary += question.Point;
                        answerUser.Listquestion[i].Point = question.Point;
                    }
                }
                answerUser.Total += question.Point; //calculate total point
            }
            _aswerUser.InsertOne(answerUser);
            return answerUser.Summary;
        }

        public void Update(string id, AnswerUser answerUserId) =>
            _aswerUser.ReplaceOne(answerUser => answerUser.Id == id, answerUserId);

        public void Remove(AnswerUser answerUserIn) =>
            _aswerUser.DeleteOne(answerUser => answerUser.Id == answerUserIn.Id);

        public void Remove(string id) =>
            _aswerUser.DeleteOne(answerUser => answerUser.Id == id);

        public List<AnswerUser> getAchievement(string email, int page) //get test results in a page
        {
            int limit = 5; //5 results per page
            int count = GetResultCount(email);
            int skip = count - limit * page; //skip backward
            if (skip < 0)
            {
                skip = 0;
                limit = count - limit * (page - 1); //limit of last page
            }
            List<AnswerUser> result = _aswerUser.Find(answeruser => answeruser.Email == email).Limit(limit)
                                                .Skip(skip).ToList(); //get from latest results
            result.Reverse(); //reverse order
            return result;
        }

        //get count of questions of a specific theme
        public int GetResultCount(string email) => (int)_aswerUser.Find(result => result.Email.Equals(email)).CountDocuments();
    }

}
