using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using QuestionBankDB.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text.RegularExpressions;

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

        /*        public List<Question> Get() =>
                    _question.Find(question => true).ToList();
        */
        public List<Question> Get(int page) =>
           _question.Find(question => true).Limit(5).Skip(5 * page).ToList();


        public Question Get(string id) =>
            _question.Find<Question>(question => question.Id == id).FirstOrDefault();

        public Object Create(Question question)
        {

            var res = _question.Find(que => que.question == question.question && que.ThemeName == question.ThemeName).FirstOrDefault();
            try
            {
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
            catch (Exception ex)
            {
                return ex;
            }

        }

        public Object Update(string id, Question questionIn)
        {

            var res = _question.ReplaceOne(question => question.Id == id, questionIn).IsAcknowledged;
            if (res)
            {
                return (new { data = Get(id), status = 200 });
            }
            return (new { stauts = 400 });
        }


        public void Remove(Question questionIn) =>
            _question.DeleteOne(question => question.Id == questionIn.Id);

        public object Remove(string id)
        {
            var res = _question.DeleteOne(question => question.Id == id);
            return res;

        }


        public List<string> GetTheme()
        {
            //get distinct values of theme names from questions collection and convert to string list
            return _question.Distinct(new StringFieldDefinition<Question, string>("themeName"), FilterDefinition<Question>.Empty).ToList();
        }

        //get questions with specific theme name
        public List<Question> GetThemeQuestions(string theme, int page) => _question.Find(question => question.ThemeName.Equals(theme))
                                                                                     .Limit(5).Skip(5 * page).ToList(); //5 results per page



        //get count of questions of a specific theme
        public int GetQuestionsCount(string theme)
        {
            return (int)_question.Find(question => question.ThemeName.Equals(theme) && question.Status).CountDocuments();
        }

        //get random question of a theme based on count
        public List<Question> GetRandomQuestions(string theme, byte level, byte count)
        {
            //find available question of a theme based on level
            List<Question> list = _question.Find(question => question.ThemeName.Equals(theme) && question.Level == level && question.Status).ToList();
            int range = list.Count;
            if (range > 0)
            {
                List<Question> questions = new List<Question>();
                Random random = new Random();
                int index;
                if (count > range) count = (byte)(range);
                for (int i = 0; i < count; i++)
                {
                    index = random.Next(0, range--);    //take random index in list and reduce range
                    Question question = list[index];    //choose question by index
                    list.RemoveAt(index);               //remove chosen question from list
                    Shuffle(question.Answer);           //shuffle up options
                    //nullify correct answers
                    for (int j = 0; j < question.TrueAnswer.Length; j++) question.TrueAnswer[j] = "";
                    questions.Add(question);            //add question to test
                }
                return questions;
            }
            return null;
        }

        private void Shuffle(string[] answer)
        {
            Random random = new Random();
            int index; //index to swap
            string temp;
            if (answer.Length > 1)
            {
                for (int i = 0; i < answer.Length; i++)
                {
                    index = random.Next(0, answer.Length - 1);
                    if (i != index && random.Next(0, 3) != 0) //swap if index != i with chance 75%
                    {
                        temp = answer[i];
                        answer[i] = answer[index];
                        answer[index] = temp;
                    }
                }
            }
        }

        //get level list of a theme
        public List<byte> GetLevels(string theme)
        {
            return _question.Distinct(new StringFieldDefinition<Question, byte>("level"), FilterDefinition<Question>.Empty).ToList();
        }


        public List<Question> searchQuesionByName(string name)
        {
            return _question.Find(question => question.question.Contains(name)).ToList();
        }

        //get question count of a theme based on level
        public int GetLevelCount(string theme, byte level) => (int)_question.Find(question => question.ThemeName == theme && question.Level == level)
                                                                            .CountDocuments();

        public long GetTotalCount() => _question.Find(question => true).CountDocuments();

        public ActionResult<bool> Import(IFormFile file)
        {
            if (file != null && file.Length > 0)
            {
                try
                {
                    List<Question> questions = new List<Question>();
                    string line = null;
                    MatchCollection obj;
                    string pattern = @"\[([^\]]*)]";
                    StreamReader reader = new StreamReader(file.OpenReadStream());
                    while (!reader.EndOfStream)
                    {
                        line = reader.ReadLine();
                        obj = Regex.Matches(line, pattern);
                        Question temp = new Question(); //create question
                                                        //read attributes
                        temp.question = obj[0].ToString().TrimStart('[').TrimEnd(']');
                        temp.Answer = obj[1].ToString().TrimStart('[').TrimEnd(']').Split(',');
                        temp.TrueAnswer = obj[2].ToString().TrimStart('[').TrimEnd(']').Split(',');
                        temp.ThemeName = obj[3].ToString().TrimStart('[').TrimEnd(']');
                        temp.Level = byte.Parse(obj[4].ToString().TrimStart('[').TrimEnd(']'));
                        temp.Point = byte.Parse(obj[5].ToString().TrimStart('[').TrimEnd(']'));
                        temp.Timeallow = byte.Parse(obj[6].ToString().TrimStart('[').TrimEnd(']'));
                        temp.Status = bool.Parse(obj[7].ToString().TrimStart('[').TrimEnd(']'));
                        Create(temp); //add to database
                    }
                    return true;
                }
                catch (Exception e) { return false; }
            }
            //read file and create question
            return false;
        }
    }
}
