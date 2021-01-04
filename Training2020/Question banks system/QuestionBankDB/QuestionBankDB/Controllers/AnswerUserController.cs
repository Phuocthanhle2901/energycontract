using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QuestionBankDB.Models;
using QuestionBankDB.Services;
using MongoDB.Bson;

namespace QuestionBankDB.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class AnswerUserController : ControllerBase
    {
        private readonly AnswerUserService _answerUserService;

        public AnswerUserController(AnswerUserService answerUserService)
        {
            _answerUserService = answerUserService;
        }

        [HttpGet]
        public ActionResult<List<AnswerUser>> Get() =>
            _answerUserService.Get();

        [HttpGet("{id:length(24)}",Name = "GetAnswerUser")]
        public ActionResult<AnswerUser> Get(string id)
        {
            var answerUser = _answerUserService.Get(id);

            if (answerUser == null)
            {
                return NotFound();
            }

            return answerUser;
        }

        [HttpPost]
        public ActionResult<int> Create(AnswerUser answerUser)
        {
            return _answerUserService.Create(answerUser);
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, AnswerUser answerUserIn)
        {
            var answerUser = _answerUserService.Get(id);

            if (answerUser == null)
            {
                return NotFound();
            }

            _answerUserService.Update(id, answerUserIn);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var answerUser = _answerUserService.Get(id);

            if (answerUser == null)
            {
                return NotFound();
            }

            _answerUserService.Remove(answerUser.Id);

            return NoContent();
        }
        
        [HttpPost]
        [Route("getAchievement")]
        public ActionResult<List<AnswerUser>>getAnswerUser(string email, int page)
        {
            return _answerUserService.getAchievement(email, page+1);
        }

        [HttpPost]
        [Route("getResultCount")]
        public ActionResult<int> getResultCount(string email)
        {
            return _answerUserService.GetResultCount(email);
        }
    }
    
}
