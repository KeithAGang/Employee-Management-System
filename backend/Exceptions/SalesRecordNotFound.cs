namespace backend.Exceptions
{
    public class SalesRecordNotFoundException : Exception
    {
        public SalesRecordNotFoundException()
            : base("Sales Record Does Not Exist!") { }
    }

}