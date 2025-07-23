namespace backend.Exceptions
{
    public class LeaveApplicationNotFoundException : Exception
    {
        public LeaveApplicationNotFoundException()
            : base("Leave Application Not Found!") { }
    }

}