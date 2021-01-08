using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QuestionBankDB.Models;
using QuestionBankDB.Services;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using System.IO;
using System.Net.Http.Headers;

namespace QuestionBankDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserInfoController : ControllerBase
    {
        private readonly UserInfoService _userInfoService;
        private LogService logger = new LogService();
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
        [HttpGet]
        public ActionResult<List<UserInfo>> Get() =>
           _userInfoService.listUser();

        [HttpPost]
        [Route("Create")]
        public  ActionResult<bool> CreateAsync( UserInfo userInfo)
        {
            var res = _userInfoService.Create(userInfo);
            logger.Log("CRUD User", "Create", "Tried to create account for " + userInfo.Email, res.ToString()); //log
            return res;
            //  return CreatedAtRoute("GetUserInfo", new { id = userInfo.Id.ToString() }, userInfo);
        }

        [HttpPost, DisableRequestSizeLimit]
        [Route("Upload")]
        public ActionResult<Object> Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    return (new { data= dbPath});
                }
                else
                {
                    return (new { data = "" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPut("{id:length(24)}")]
        public ActionResult<Object> Update(string id, UserInfo userInfoIn)
        {
            var userInfo = _userInfoService.Get(id);

            if (userInfo == null)
            {
                return NotFound();
            }
            var res = _userInfoService.Update(id, userInfoIn);
            logger.Log("CRUD User", "Update", "Tried to update account for " + userInfo.Email, res.ToString()); //log
            return res;
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
            logger.Log("CRUD User", "Delete", "Removed account of " + userInfo.Email, null); //log
            return NoContent();
        }
        
        [HttpPost]
        [Route("login")]
        public object PostLogin( [FromBody]UserInfo user)
        {
            var res = _userInfoService.SignIn(user, HttpContext);
            logger.Log("Login/Logout", "Login", user.Email + " tried to sign in", res.ToString()); //log
            return res;
        }

        [HttpGet]
        [Route("getuserById")]
        public ActionResult<UserInfo> getUserByIdi(string id)
        {
            return _userInfoService.getUserByidi(id);
        }


        [HttpPost]
        [Route("register")]
        public object PostRegister([FromBody] UserInfo user)
        {
            var res = _userInfoService.register(user);
            logger.Log("Login/Logout", "Register", user.Email + " tried to register", res.ToString()); //log
            return res;
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
            var res = _userInfoService.DisableUser(email);
            logger.Log("CRUD User", "Update", "Tried to disable " + email, res.ToString());
            return res;
        }
        [HttpPost]
        [Route("role")]
        public ActionResult<List<int>> GetThemes() => _userInfoService.GetRoleUsser();
        [HttpPost]
        [Route("users")]
        public ActionResult<List<UserInfo>> GetUserByRole(int role) => _userInfoService.getUserbyRole(role);

        [HttpPost]
        [Route("resetPasswordMail")] //send an email for forget password feature
        public ActionResult<byte> SendLink(string email)
        {
            var res = _userInfoService.SendLink(email);
            logger.Log("Login/Logout", "Forget Password", "Tried to send reset password link to " + email, res.ToString()); //log
            return res;
        }

        [HttpPut]
        [Route("resetPassword")] //update password for forget password feature
        public ActionResult<byte> ResetPassword(string email, string newPassword)
        {
            var res = _userInfoService.ResetPassword(email, newPassword);
            logger.Log("Login/Logout", "Forget Password", "Tried to reset password of " + email, res.ToString()); //log
            return res;
        }
    }
}
