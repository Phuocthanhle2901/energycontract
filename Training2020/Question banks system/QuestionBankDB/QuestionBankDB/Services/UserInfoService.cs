using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
  
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using QuestionBankDB.Models;
using QuestionBankDB.SupperService;

namespace QuestionBankDB.Services
{
    public class UserInfoService
    {
        private readonly IMongoCollection<UserInfo> _userInfo;
        private readonly supperService _supper=new supperService();
        public UserInfoService(IQuestionBankSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName); 
            _userInfo = database.GetCollection<UserInfo>(settings.UserInfoCollectionName);
        }
        public List<Object> GetAllAdmin()
        {
            var project = Builders<UserInfo>.Projection.Include("email").Include("fullname").Include(x=>x.Avatar).Exclude("_id").Include(x=>x.Status);
            var result = _userInfo.Find(user => user.Role== 2).Project(project).ToList();
            if (result.Count > 0)
            {
                List<Object> list = new List<object>();
                result.ForEach((e) =>
                {
                    list.Add(BsonTypeMapper.MapToDotNetValue(e));
                });
                return list;
            }
            return null;
        }
        public List<Object> GetAllUser()
        {
            var project = Builders<UserInfo>.Projection.Include("email").Include("fullname").Include(x => x.Avatar).Exclude("_id").Include(x => x.Status);
            var result = _userInfo.Find(user => user.Role == 1).Project(project).ToList();
            if (result.Count > 0)
            {
                List<Object> list = new List<object>();
                result.ForEach((e) =>
                {
                    list.Add(BsonTypeMapper.MapToDotNetValue(e));
                });
                return list;
            }
            return null;
        }
        // get User by id
        public UserInfo getUserByidi(string id)=>
            _userInfo.Find(us => us.Id == id).FirstOrDefault();
        
        public List<UserInfo>listUser()
        {
            return _userInfo.Find(s => true).ToList();
        }

        public Boolean DisableUser(string email)
        {
            var user = _userInfo.Find(user => user.Email == email).FirstOrDefault();
            if(user != null)
            {
                user.Status = !user.Status;
                _userInfo.ReplaceOne(x => x.Email == email, user);

                return true;
            }
            
            return false;
        }

        public Object Update(string id, UserInfo userInfoId)
        {
            var res = _userInfo.ReplaceOne(us => us.Id == id, userInfoId).IsAcknowledged;
            if (res)
            {
                return (new { data = Get(id), status = 200 });
            }
            return (new { stauts = 400 });

        }
          

        public void Remove(UserInfo userInfo) =>
            _userInfo.DeleteOne(UserInfo => UserInfo.Id == userInfo.Id);

        public void Remove(string id) =>
            _userInfo.DeleteOne(UserInfo => UserInfo.Id == id);

        public UserInfo Get(string id) =>
            _userInfo.Find<UserInfo>(UserInfo => UserInfo.Id == id ).FirstOrDefault();

        public Boolean Create([FromForm] UserInfo userInfo )
        {
            var user = _userInfo.Find(res => res.Email == userInfo.Email).FirstOrDefault();

            if(user==null)  
            { 
                userInfo.Password = _supper.GetMD5(userInfo.Password);
                _userInfo.InsertOne(userInfo);
                return true;
            }
           
            return false;
        } 

        public object register(UserInfo fuser)
        {
            var res=_userInfo.Find(user => user.Email == fuser.Email).FirstOrDefault();
            
            try
            {
                if (res == null){
                    fuser.Password = _supper.GetMD5(fuser.Password);
                    fuser.Role=1;
                    fuser.Status = true;
                    _userInfo.InsertOne(fuser);
                    return (new { status = 200, message =  "register Account success"});
                }
                else
                {
                    return (new { status = 400, message = "Email did exist" });
                }
            }
            catch(Exception ex)
            {
                return ex.Message;
            }
             
        }
        public object SignIn(UserInfo fuser, HttpContext context)
        {
            try {

               var res= _userInfo.Find(user => user.Email == fuser.Email && user.Status==true).FirstOrDefault();
                if(res!=null)
                {
                    if(res.Password==_supper.GetMD5(fuser.Password))
                    {
                       var data= this.CountAccess(context, res);
                        return ( new { status = 200, data= data });
                    }
                    else
                    {
                        return (new { status = 400, message = "Incorrect password" });
                    } 
                }
                else
                {
                    return (new { status = 401, message = "Email not exist " });
                } 
            }
            catch(Exception ex)
            {
                return (new { status =402, message = ex });
            }
           
        }

        public List<int> GetRoleUsser()
        {
            //get distinct values of theme role  from User collection and convert to string list
            return _userInfo.Distinct(new StringFieldDefinition<UserInfo, int>("role"), FilterDefinition<UserInfo>.Empty).ToList();
        }
        // get user by role
        public List<UserInfo>getUserbyRole(int role)
        {
            return _userInfo.Find(user => user.Role == role).ToList();
        }

    

        public string CountAccess(HttpContext context,UserInfo user)
        {
            // Lấy ISession
            var session = context.Session;
            string key_access = "quesionbank";

            // Lưu vào  Session thông tin truy cập
            // Định nghĩa cấu trúc dữ liệu lưu trong Session
            var token = new
            {
                id = user.Id,
                count = 0,
                lasttime = DateTime.Now
            }; 

            // Convert accessInfo thành chuỗi Json 
            string jsonSave = JsonConvert.SerializeObject(token);
            session.SetString(key_access, jsonSave);// và lưu lại vào Session


            return jsonSave;
        }
        public   Object getInfoUserLogin(string id)
        {
            
            try
            {
                //c1
                var projection = Builders<UserInfo>.Projection.Include("email").Include("fullname").Include("Role");
                var  result  = _userInfo.Find(user => user.Id == id).Project(projection).FirstOrDefault(); 

                if(result!=null)
                {
                    return BsonTypeMapper.MapToDotNetValue(new BsonDocument() { { "id", id }, { "result", result } });
                }
                return null;
              
            }
            catch (Exception ex)
            {
                return ex;
            }  
        }

    }
}
