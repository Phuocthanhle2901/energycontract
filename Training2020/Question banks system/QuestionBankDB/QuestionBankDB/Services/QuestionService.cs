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
            for(int i=0; i<count; i++)
            {
                index = RandomDistinct(indexList, range); //take random index in range
                indexList[i] = index; //add index to list to isolate it
                questions.Add(_question.Find(question => question.ThemeName.Equals(theme)) //find question of specific theme
                                       .Skip(index) //skip index
                                       .FirstOrDefault());
            }
            return questions;
        }

        private int RandomDistinct(int[] list, int range)
        {
            Random random = new Random();
            int result = 0;
            bool lap = false; //flag if result exists in list
            int i; //list iterator position

            do
            {
                result = random.Next(0, range);
                i = 0;
                while (i < list.Length && list[i] != result) i++; //tripwire check
                if (i < list.Length) lap = true;
                else lap = false;
            } while (lap);

            return result;
        }
    }

}
