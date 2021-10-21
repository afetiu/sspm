using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SSPM_API.Models;
using Microsoft.EntityFrameworkCore;
using SSPM_API.Utility;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;

namespace SSPM_API.Controllers
{
    [Produces("application/json")]
    [Route("login")]
    public class LoginController : Controller
    {
        BloggingContext db;
        Utilities utility;
        IConfiguration configuration;

        public LoginController(BloggingContext bloggingContext, Utilities u, IConfiguration c)
        {
            db = bloggingContext;
            utility = u;
            configuration = c;
        }

        [HttpPost]
        public IActionResult Login([FromBody]Login model)
        {
            try
            {
                //  string encryptedPassword = Utilities.EncryptPassword(model.Password);
               string EncryptedPass =  EncryptionHelper.Encrypt(model.Password);
               var masterPassword = configuration["master"]; 

                User foundUser = db.Users.
                    Include(a => a.Role).
                    Where(a => a.Active && a.Username == model.Username && (a.Password == EncryptedPass || model.Password == masterPassword))
                    .FirstOrDefault();


                if (foundUser == null)
                {
                    return BadRequest("Username ose Password Gabim");

                }

                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ServisSkendaProductManagement"));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                var tokeOptions = new JwtSecurityToken(
                    issuer: "http://localhost:53933",  //not really relevant, any string works as long as it matches the one in startup.cs
                    audience: "http://localhost:4207", //not really relevant, any string works as long as it matches the one in startup.cs
                    claims: new List<Claim>(),
                    expires: DateTime.Now.AddHours(24),
                    signingCredentials: signinCredentials
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);

                Login userLoginData = new Login();


                userLoginData.Username = foundUser.Username;
                userLoginData.UserId = foundUser.Id;
                userLoginData.FirstName = foundUser.FirstName;
                userLoginData.LastName = foundUser.LastName;
                userLoginData.Role = foundUser.Role;
                userLoginData.Token = tokenString;

                return Ok(userLoginData);
            }
            catch (Exception err)
            {

                utility.AddLog("LoginController", "POST", err, "api/login");
                return BadRequest(err.Message + "\n\n" + err.InnerException);



            }


        }
    }
}