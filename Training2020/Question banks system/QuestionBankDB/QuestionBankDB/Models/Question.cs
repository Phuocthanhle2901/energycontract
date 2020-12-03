using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace QuestionBankDB.Models
{
    public class Question
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("question")]
        public string question { get; set; }

        [BsonElement("answer")]
        public string[] Answer { get; set; }

        [BsonElement("trueAnswer")]
        public string TrueAnswer { get; set; }

        [BsonElement("themeName")]
        public string ThemeName { get; set; }

        [BsonElement("level")]
        public long Level { get; set; }

        [BsonElement("point")]
        public long Point { get; set; }

        [BsonElement("timeallow")]
        public long Timeallow { get; set; }

        [BsonElement("status")]
        public bool Status { get; set; }
    }
}
