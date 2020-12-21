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

        public QuestionController(QuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpGet]
        public ActionResult<List<Question>> Get() =>
            _questionService.Get();

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

        [HttpPost]
        public ActionResult<Question> Create(Question question)
        {
            _questionService.Create(question);

            return CreatedAtRoute("GetQuestion", new { id = question.Id.ToString() }, question);
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, Question questionIn)
        {
            var question = _questionService.Get(id);

            if (question == null)
            {
                return NotFound();
            }

            _questionService.Update(id, questionIn);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var question = _questionService.Get(id);

            if (question == null)
            {
                return NotFound();
            }

            _questionService.Remove(question.Id);

            return NoContent();
        }
        //get theme names
        [HttpPost]
        [Route("themes")]
        public ActionResult<List<string>> GetThemes() => _questionService.GetTheme();
        //get questions of a theme
        [HttpPost]
        [Route("themeQuestions")]
        public ActionResult<List<Question>> GetThemeQuestions(string theme, byte page)
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
    }
    
}
