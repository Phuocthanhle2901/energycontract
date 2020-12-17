using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using QuestionBankDB.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

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

        public Question Create(Question question)
        {
            _question.InsertOne(question);

            return question;
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

        //return questions with specific theme name
        public List<Question> GetThemeQuestions(string theme) => _question.Find(question => question.ThemeName.Equals(theme)).ToList();
 
    }

}
