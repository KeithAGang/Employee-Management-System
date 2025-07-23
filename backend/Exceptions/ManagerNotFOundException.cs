namespace backend.Exceptions
{
    public class ManagerNotFoundException : Exception
    {
        public ManagerNotFoundException()
            : base("Manager With This Email Does Not Exist!") { }
    }

}