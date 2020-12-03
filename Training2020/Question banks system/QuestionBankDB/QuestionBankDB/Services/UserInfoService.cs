using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using QuestionBankDB.Models;


namespace QuestionBankDB.Services
{
    public class UserInfoService
    {
        private readonly IMongoCollection<UserInfo> _userInfo;

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
    }
}
