namespace backend.Exceptions
{
    public class UserDetailsException : Exception
    {
        public UserDetailsException()
            : base("Check Your Login Details!") { }
    }

}