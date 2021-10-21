using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SSPM_API.Models;
using SSPM_API.Utility;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace SSPM_API.Controllers
{
    [Produces("application/json")]
    public class UserController : Controller
    {
        BloggingContext db;
        Utilities utility;

        public UserController(BloggingContext bloggingContext, Utilities u)
        {
            db = bloggingContext;
            utility = u;
        }


        [HttpPost]
        [Route("user/all")]
        public IActionResult GetAllUsers([FromBody]Filter filter)
        {
            try
            {
                PagedList result = new PagedList();

                var allUsers = db.Users
                    .Include(a => a.Role)
                    .Where(a => a.Active)
                    .GetAllFiltered(filter).ToDynamicList();

                int count = db.Users.Where(a => a.Active).GetAllFilteredCount(filter);

                result.Data = allUsers;
                result.Count = count;

                return Ok(result);
            }
            catch (Exception err)
            {
                utility.AddLog("UserController", "POST", err, "api/user/all");
                throw;

            }
        }

        [HttpPost]
        [Route("user/addnewuser")]
        public IActionResult AddNewProduct([FromBody]User model)
        {
            try
            {
                var existingUser = db.Users.Where(a => a.Active && a.Username == model.Username).FirstOrDefault();

                if (existingUser != null)
                {
                    return BadRequest("Ky username ekziston");
                } 


                User newUser = new User();
                newUser.FirstName = model.FirstName;
                newUser.LastName = model.LastName;
                newUser.Username = model.Username;
                newUser.Password = EncryptionHelper.Encrypt(model.Password);
                newUser.Role = db.Roles.Where(a => a.Active && a.Id == model.RoleId).FirstOrDefault();
                newUser.DateInserted =DateTime.Now; 
                newUser.DateUpdated =DateTime.Now;
                newUser.Active = true;

                db.Users.Add(newUser);
                db.SaveChanges();


                return Ok(newUser);
            }
            catch (Exception err)
            {
                utility.AddLog("UserController", "POST", err, "api/user/addnewuser");
                throw;

            }


        }

        [HttpDelete]
        [Route("user/deleteuser/{id}")]
        public IActionResult DeleteBrand(int id)
        {
            try
            {

                var allAdminUsers = db.Users.Include(a => a.Role).Where(a => a.Active && a.Role.Name == "Admin").ToList();

                if (allAdminUsers.Count == 1)
                {
                    return BadRequest("Nuk mund te fshihen te gjtihe userat me rolin admin");
                }



                var user = db.Users.Where(a => a.Active && a.Id == id).FirstOrDefault();



                user.Active = false;
                db.Users.Update(user);
                db.SaveChanges();

                return Ok();
            }
            catch (Exception err)
            {
                utility.AddLog("UserController", "HttpDelete", err, "api/user/deleteuser/{id}");
                throw;

            }

        }

        [HttpGet]
        [Route("user/roleselectitems")]
        public IActionResult GetRolesSelectItems()
        {
            try
            {
                var roles = db.Roles.Where(a => a.Active);

                List<SelectedItem> rolesList = new List<SelectedItem>();

                foreach (var role in roles)
                {
                    SelectedItem selectedItem = new SelectedItem();
                    selectedItem.Label = role.Name;
                    selectedItem.Value = role.Id;

                    rolesList.Add(selectedItem);
                }


                return Ok(rolesList);
            }
            catch (Exception err)
            {
                utility.AddLog("UserController", "HttpGet", err, "api/user/roleselectitems");
                throw;

            }

        }



    }
}