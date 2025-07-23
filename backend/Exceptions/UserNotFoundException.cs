namespace backend.Exceptions
{
    public class UserNotFoundException : Exception
    {
        public UserNotFoundException()
            : base("User Does Not Exist!") { }
    }

}