using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QuestionBankDB.Models;
using QuestionBankDB.Services;
 

namespace QuestionBankDB.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly QuestionService _questionService;
        private LogService logger = new LogService();
        public QuestionController(QuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpGet]
        public ActionResult<List<Question>> Get(int page) => _questionService.Get(page);
 
       // public ActionResult<List<Question>> Get(int page) =>
         //   _questionService.Get(page);
 

        [HttpGet("{id:length(24)}",Name ="GetQuestion")]
        public ActionResult<Question> Get(string id)
        {
            var question = _questionService.Get(id);

            if (question == null)
            {
                return NotFound();
            }

            return question;
        }
        [HttpGet]
        [Route("search")]
        public ActionResult<List<Question>> SearchByName(string name)
        {
            var question = _questionService.searchQuesionByName(name);

            if (question == null)
            {
                return NotFound();
            }

            return question;
        }


        [HttpPost]
        [Route("create")]
        public ActionResult<Object> Create(Question question)
        { 
            var res = _questionService.Create(question);
            logger.Log("CRUD Question", "Create", $"Tried to add new {question.ThemeName} question", res.ToString()); //log
            return res;
        }

        [HttpPut("{id:length(24)}")]
        public ActionResult<Object> Update(string id, Question questionIn)
        {
            var question = _questionService.Get(id);

            if (question == null)
            {
                return NotFound();
            }
            
            var res =  _questionService.Update(id, questionIn);
            logger.Log("CRUD Question", "Update", "Tried to update question " + id, res.ToString()); //log
            return res;
        }

        [HttpDelete("{id:length(24)}")]
        public ActionResult<object> Delete(string id)
        {
            var question = _questionService.Get(id);

            if (question == null)
            {
                return NotFound();
            }

            var res = _questionService.Remove(question.Id);
            logger.Log("CRUD Question", "Delete", "Tried to delete question " + id, res.ToString()); //log
            return res;
        }
        //get theme names
        [HttpPost]
        [Route("themes")]
        public ActionResult<List<string>> GetThemes() => _questionService.GetTheme();


        //get questions of a theme
        [HttpPost]
        [Route("themeQuestions")]
        public ActionResult<List<Question>> GetThemeQuestions(string theme, int page)
        {
            var questions = _questionService.GetThemeQuestions(theme, page);

            if (questions == null)
            {
                return NotFound();
            }
            return questions;
        }
        //count questions of a theme
        [HttpPost]
        [Route("countQuestions")]
        public ActionResult<int> GetQuestionsCount(string theme) => _questionService.GetQuestionsCount(theme);

 
        //get random questions
        [HttpPost]
        [Route("randomQuestions")]
        public ActionResult<List<Question>> GetRandomQuestions(string theme, byte level=1, byte count=3)
        {
            var questions = _questionService.GetRandomQuestions(theme, level, count);

            if (questions == null)
            {
                return NotFound();
            }
            return questions;
        }
        

        [HttpPost]
        [Route("getLevels")]
        public ActionResult<List<byte>> GetLevels(string theme) => _questionService.GetLevels(theme);

        [HttpPost]
        [Route("levelCount")]
        public ActionResult<int> GetLevelCount(string theme, byte level) => _questionService.GetLevelCount(theme, level);

        [HttpPost]
        [Route("totalCount")]
        public ActionResult<long> GetTotalCount() => _questionService.GetTotalCount();
    }
    
}
