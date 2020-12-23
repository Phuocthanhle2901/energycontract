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

        //get questions with specific theme name
        public List<Question> GetThemeQuestions(string theme, byte page) => _question.Find(question => question.ThemeName.Equals(theme))
                                                                                     .Limit(5).Skip(5 * page).ToList(); //5 results per page
        //get count of questions of a specific theme
        public int GetQuestionsCount(string theme) => (int)_question.Find(question => question.ThemeName.Equals(theme)).CountDocuments();

        //get random question of a theme based on count
        public List<Question> GetRandomQuestions(string theme, byte count)
        {
            int range = GetQuestionsCount(theme) - 1;
            int index;
            if (count > range) count = (byte)(range);
            int[] indexList = new int[count];
            List<Question> questions = new List<Question>();
            for (int i=0; i<count; i++)
            {
                index = RandomDistinct(indexList, range); //take random index in range
                indexList[i] = index; //add index to list to isolate it
                Question question = _question.Find(question => question.ThemeName.Equals(theme) && question.Status)//find available question of a theme
                                                      .Skip(index) //skip index
                                                      .FirstOrDefault();
                question.TrueAnswer = null; //nullify true answer to avoid cheating
                questions.Add(question);
            }
            return questions;
        }

        private int RandomDistinct(int[] list, int range)
        {
            Random random = new Random();
            int i; //list iterator position
            bool lap;
            int result;
            do //check if index is already in list
            {
                result = random.Next(0, range);
                i = 0;
                while (i < list.Length && list[i] != result) i++; //tripwire check
                if (i < list.Length) lap = true;
                else lap = false;
            } while (lap);

            return result;
        }

        public string GetAnswer(string id)
        {
            var project = Builders<Question>.Projection.Include("trueAnswer"); //get true answer only
            return _question.Find(question => question.Id == id) //find question, project to answer
                                         .FirstOrDefault().TrueAnswer.ToJson(); //convert result to json string
        }
    }

}
