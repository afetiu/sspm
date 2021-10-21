namespace SSPM_API.Models
{
    public class Login
    {

        public string Username { get; set; }
        public int UserId { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string  LastName { get; set; }
        public Role Role { get; set; }
        public string Token { get; set; }
        
    }
}
