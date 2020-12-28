using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuestionBankDB.Models
{
    public class AnswerUser
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("listquestion")]
        public Listquestion[] Listquestion { get; set; }

        [BsonElement("summary")]
        public int Summary { get; set; }

        [BsonElement("date")]
        public DateTime Date { get; set; }
    }
    public partial class Listquestion
    {
        [BsonElement("question")]
        public string Question { get; set; }

        [BsonElement("answer")]
        public string[] Answer { get; set; }

        [BsonElement("userAnswer")]
        public string UserAnswer { get; set; }

        [BsonElement("trueAnswer")]
        public string TrueAnswer { get; set; }

        [BsonElement("point")]
        public long Point { get; set; }
    }
}
