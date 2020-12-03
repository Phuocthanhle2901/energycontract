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
        public ActionResult<AnswerUser> Create(AnswerUser answerUser)
        {
            _answerUserService.Create(answerUser);

            return CreatedAtRoute("GetAnswerUser", new { id = answerUser.Id.ToString() }, answerUser);
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
    }
    
}
