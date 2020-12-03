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
    public class UserInfoController : ControllerBase
    {
        private readonly UserInfoService _userInfoService;

        public UserInfoController(UserInfoService userInfoService)
        {
            _userInfoService = userInfoService;
        }

        [HttpGet]
        public ActionResult<List<UserInfo>> Get() =>
            _userInfoService.Get();

        [HttpGet("{id:length(24)}",Name = "GetUserInfo")]
        public ActionResult<UserInfo> Get(string id)
        {
            var userInfo = _userInfoService.Get(id);

            if (userInfo == null)
            {
                return NotFound();
            }

            return userInfo;
        }

        [HttpPost]
        public ActionResult<UserInfo> Create(UserInfo userInfo)
        {
            _userInfoService.Create(userInfo);

            return CreatedAtRoute("GetUserInfo", new { id = userInfo.Id.ToString() }, userInfo);
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, UserInfo userInfoIn)
        {
            var userInfo = _userInfoService.Get(id);

            if (userInfo == null)
            {
                return NotFound();
            }

            _userInfoService.Update(id, userInfoIn);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var userInfo = _userInfoService.Get(id);

            if (userInfo == null)
            {
                return NotFound();
            }

            _userInfoService.Remove(userInfo.Id);

            return NoContent();
        }
    }
}
