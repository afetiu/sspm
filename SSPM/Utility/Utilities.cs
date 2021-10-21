using SSPM_API.Models;
using System;
using System.Text;

namespace SSPM_API.Utility
{
    public class Utilities
    {

        BloggingContext db;

        public Utilities(BloggingContext bloggingContext)
        {
            db = bloggingContext;
        } 

        public static string EncryptPassword(string password)
        { 
            byte[] pwdBytes = Encoding.GetEncoding(1252).GetBytes(password);
            byte[] hashBytes = System.Security.Cryptography.MD5.Create().ComputeHash(pwdBytes);
            return Encoding.GetEncoding(1252).GetString(hashBytes);
        }

        public void AddLog(string className, string methodName, Exception ex, string apiurl = "")
        {
            string username = "";
            //try
            //{
            //    Guid personGuid = User.GetId();
            //    username = db.PersonRepository.GetAll().Where(a => a.UniqueGuid == personGuid).Select(b => b.User.UserName).First();

            //}
            //catch (Exception)
            //{

            //}

            try
            {
                string msg = "1 LEVEL: " + ex.Message;

                if (ex.InnerException != null)
                {
                    msg += " 2 LEVEL: " + ex.InnerException.Message;

                    if (ex.InnerException.InnerException != null)
                    {
                        msg += " 3 LEVEL: " + ex.InnerException.InnerException.Message;
                    }
                }


                ErrorLog el = new ErrorLog
                {
                    CLASS = className,
                    REQUEST_DATE = DateTime.Now,
                    MESSAGE = msg,
                    METHOD = methodName,
                    REQUEST_USER = username,
                    REQUESTURL = apiurl,
                    STACKTRACE = ex.StackTrace
                };

                db.ErrorLogs.Add(el);
                db.SaveChanges();
            }
            catch (Exception e)
            {
            }
        }



        public string ConvertDateToString(DateTime date)
        {
            return date.ToUniversalTime().Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds.ToString();
        }

    }
}
