using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuestionBankDB.Models
{
    public class UserInfo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("fullname")]
        public string Fullname { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("avatar")]
        public string Avatar { get; set; }

        [BsonElement("password")]
        public string Password { get; set; }

        public string resetPasswordlink { get; set; }//used for forget password feature

        [BsonElement("role")]
        public long Role { get; set; }
        [BsonElement("status")]
        public Boolean Status { get; set; }
    }
}
