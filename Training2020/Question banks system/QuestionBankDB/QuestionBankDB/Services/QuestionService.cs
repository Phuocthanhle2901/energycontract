using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using QuestionBankDB.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;

namespace QuestionBankDB.Services
{
    public class QuestionService
    {
        private readonly IMongoCollection<Question> _question;

        public QuestionService(IQuestionBankSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _question = database.GetCollection<Question>(settings.QuestionCollectionName);
        }

        public List<Question> Get() =>
            _question.Find(question => true).ToList();

        public Question Get(string id) =>
            _question.Find<Question>(question => question.Id == id).FirstOrDefault();

        public object Create(Question question)
        {
            var res = _question.Find(que => que.question == question.question && que.ThemeName==question.ThemeName).FirstOrDefault();
            try {
                if (res == null)
                {
                    _question.InsertOne(question);
                    return (new { status = 200, message = "create question success" });
                }
                else
                {
                    return (new { status = 400, message = "question exits" });
                }
            }
            catch(Exception ex)
            {
                return (new { message = ex });
            }
            
          
            
        }

        public void Update(string id, Question questionIn) =>
            _question.ReplaceOne(question => question.Id == id, questionIn);

        public void Remove(Question questionIn) =>
            _question.DeleteOne(question => question.Id == questionIn.Id);

        public void Remove(string id) =>
            _question.DeleteOne(question => question.Id == id);

        public List<string> GetTheme()
        {
            //get distinct values of theme names from questions collection and convert to string list
            return _question.Distinct(new StringFieldDefinition<Question, string>("themeName"), FilterDefinition<Question>.Empty).ToList();
        }

        //get questions with specific theme name
        public List<Question> GetThemeQuestions(string theme, byte page) => _question.Find(question => question.ThemeName.Equals(theme))
                                                                                     .Limit(5).Skip(5 * page).ToList(); //5 results per page
        //get count of questions of a specific theme
        public int GetQuestionsCount(string theme) => (int)_question.Find(question => question.ThemeName.Equals(theme)).CountDocuments();
    }

}
