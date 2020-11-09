namespace EntitiesEnum
{
    public class OrderContextConstants
    {
        public enum FiberCode
        {
            FIBER_A,
            FIBER_B
        }
        public enum NetworkType
        {
            FIBER = 1,
            COAX = 2,
            HYBRID = 3,
            FttH = 4,
            FttO = 5,
            FttS = 6,
            PtP = 7
        }

        public enum Status
        {
            NEW,
            RECEIVED,
            CONFIRMED,
            PROVIDED,//AVAILABLE
            DELIVERED,
            CANCELLED,
            CHANGE_RECEIVED,
            CANCEL_RECEIVED,
            TERMINATED
        }
    }
}
