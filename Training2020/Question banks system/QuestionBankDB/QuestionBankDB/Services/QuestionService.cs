using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QuestionBankDB.Models;
using Microsoft.AspNetCore.Mvc;

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

        public ActionResult<List<string>> GetTheme()
        {
            List<string> themes = new List<string>();
            List<Question> questions = new List<Question>();
            questions = _question.Find(question => true).ToList(); //get all questions
            foreach(Question i in questions) //traverse questions list
            {
                if(themes.IndexOf(i.ThemeName)<0) { //check if theme name of current question exists in themes list
                    themes.Add(i.ThemeName); //add theme name to themes list
                }
            }
            return themes.ToList();
        }
    }

}
