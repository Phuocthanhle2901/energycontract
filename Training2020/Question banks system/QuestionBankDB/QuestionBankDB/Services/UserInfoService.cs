using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
  
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
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

        public List<UserInfo> Get() =>
            _userInfo.Find(AnswerUser => true).ToList();

        public UserInfo Get(string id) =>
            _userInfo.Find<UserInfo>(UserInfo => UserInfo.Id == id).FirstOrDefault();

        public UserInfo Create(UserInfo userInfo)
        {
            _userInfo.InsertOne(userInfo);
            return userInfo;
        } 

        public void Update(string id, UserInfo userInfoId) =>
            _userInfo.ReplaceOne(UserInfo => userInfoId.Id == id, userInfoId);

        public void Remove(UserInfo userInfo) =>
            _userInfo.DeleteOne(UserInfo => UserInfo.Id == userInfo.Id);

        public void Remove(string id) =>
            _userInfo.DeleteOne(UserInfo => UserInfo.Id == id);

        

        public object register(UserInfo fuser)
        {
            var res=_userInfo.Find(user => user.Email == fuser.Email).FirstOrDefault();
            
            try
            {
                if (_supper.IsNull(res)){
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
            Console.WriteLine(id);
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
