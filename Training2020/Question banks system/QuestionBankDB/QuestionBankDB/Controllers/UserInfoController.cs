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

            
           return _userInfoService.Create(userInfo);
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

            return _userInfoService.Update(id, userInfoIn);
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

        [HttpPost]
        [Route("resetPassword")]
        public ActionResult<Boolean> SendLink(string email) => _userInfoService.SendLink(email);
    }
}
