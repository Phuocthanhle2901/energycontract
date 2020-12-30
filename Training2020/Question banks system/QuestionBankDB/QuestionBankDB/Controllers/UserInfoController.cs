using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QuestionBankDB.Models;
using QuestionBankDB.Services;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;

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
        [Route("Create")]
        public ActionResult<Boolean> Create(UserInfo userInfo)
        {
         return   _userInfoService.Create(userInfo);

         //  return CreatedAtRoute("GetUserInfo", new { id = userInfo.Id.ToString() }, userInfo);
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
        
        [HttpPost]
        [Route("login")]
        public object PostLogin( [FromBody]UserInfo user)
        {
           return _userInfoService.SignIn(user, HttpContext);
        }



        [HttpPost]
        [Route("register")]
        public object PostRegister([FromBody] UserInfo user)
        {
            return _userInfoService.register(user);
        }

        [HttpPost]
        [Route("user")]
        public ActionResult<Object> getUserById(string id)
        {
            return _userInfoService.getInfoUserLogin(id);
        }


        //Lay toan bo admin
        [HttpPost]
        [Route("user/admin")]
        public ActionResult<List<Object>> getUserAdminAll()
        {
            var listAdmin = _userInfoService.GetAllAdmin();
            if (listAdmin == null)
            {
                return null;
            }
            else
            {
                return listAdmin;
            }
        }
        //Lay toan bo user
        [HttpPost]
        [Route("user/user")]
        public ActionResult<List<Object>> getUserAll()
        {
            var listAdmin = _userInfoService.GetAllUser();
            if (listAdmin == null)
            {
                return null;
            }
            else
            {
                return listAdmin;
            }
        }
        //disable user
        [HttpPost]
        [Route("user/disable_user")]
        public ActionResult<Boolean> disableUser(string email)
        {
            _userInfoService.DisableUser(email);
            return true;
        }
        [HttpPost]
        [Route("role")]
        public ActionResult<List<int>> GetThemes() => _userInfoService.GetRoleUsser();
        [HttpPost]
        [Route("users")]
        public ActionResult<List<UserInfo>> GetUserByRole(int role) => _userInfoService.getUserbyRole(role);

    }
}
