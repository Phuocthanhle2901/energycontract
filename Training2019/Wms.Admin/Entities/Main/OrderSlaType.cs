using System;
using System.Collections.Generic;
using System.Text;
using static DomainModel.Enum.OrderSlaEnum;

namespace Entities.Main
{
   public class OrderSlaType
    {
        public int Id { get; set; }

        public string ConnectionStatus { get; set; }

        public int BuildingStatus { get; set; }

        public NLType NLType { get; set; }

        public CommentTypeSla CommentType { get; set; }

        public int IsDefault { get; set; }
    }
}
