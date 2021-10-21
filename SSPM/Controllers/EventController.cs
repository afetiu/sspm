using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SSPM_API.Models;
using SSPM_API.Utility;
using System.Linq.Dynamic.Core;

namespace SSPM_API.Controllers
{
    [Produces("application/json")]
    public class EventController : Controller
    {
        BloggingContext db;
        Utilities utility;

        public EventController(BloggingContext bloggingContext, Utilities u)
        {
            db = bloggingContext;
            utility = u;
        }


        [HttpGet]
        [Route("event/my/{id}")]
        public IActionResult GetAllProducts(int id)
        {
            try
            { 
                List<Event> allProducts = db.Events.Where(a => a.Active && a.UserId == id && a.StartDate.Date >= DateTime.Now.Date).ToList(); 
                 

                return Ok(allProducts);
            }
            catch (Exception err)
            {
                utility.AddLog("EventController", "POST", err, "api/event/my/{ id}");
                return BadRequest(err.Message);

            }
        }

        [HttpPost]
        [Route("event/addnewevent")]
        public IActionResult AddNewEvent([FromBody]Event model)
        {
            try
            {


                Event newEvent = new Event()
                {
                    User = db.Users.Where(a => a.Active && a.Id == model.UserId).FirstOrDefault(),
                    Active = true,
                    DateInserted = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    StartDate = model.StartDate,
                    EndDate = model.EndDate,
                    AllDay = model.AllDay,
                    Description = model.Description
                };
                

                db.Events.Add(newEvent); 
                
                return Ok(newEvent);
            }


            catch (Exception err)
            {
                utility.AddLog("EventController", "POST", err, "api/event/addnewevent");
                return BadRequest(err.Message); 
            } 
        }

        [HttpPut]
        [Route("event/updateevent")]
        public IActionResult UpdateEvent([FromBody]Event model)
        {
            try
            {
                Event foundEvent = db.Events.Where(a => a.Active && a.Id == model.Id).FirstOrDefault();

                foundEvent.StartDate = model.StartDate;
                foundEvent.EndDate = model.EndDate;
                foundEvent.Description = model.Description;
                foundEvent.AllDay = model.AllDay;
                foundEvent.DateUpdated = DateTime.Now;
                 
                db.Events.Update(foundEvent);
                db.SaveChanges();
                return Ok(foundEvent);
            }


            catch (Exception err)
            {
                utility.AddLog("EventController", "POST", err, "api/event/addnewevent");
                return BadRequest(err.Message);
            }
        }


        [HttpPut]
        [Route("event/eventbyid/{id}")]
        public IActionResult GetEventById(int id)
        {
            try
            {
                Event foundEvent = db.Events.Where(a => a.Active && a.Id == id).FirstOrDefault();
                 
                if (foundEvent == null)
                {
                    return BadRequest("Ky event nuk eshte gjetur!");
                }

                db.Events.Update(foundEvent);
                db.SaveChanges();
                return Ok(foundEvent);
            }


            catch (Exception err)
            {
                utility.AddLog("EventController", "POST", err, "api/event/addnewevent");
                return BadRequest(err.Message);
            }
        }


        [HttpDelete]
        [Route("event/deleteevent/{id}")]
        public IActionResult DeleteEvent(int id)
        {
            try
            {
                var ev = db.Events.Where(a => a.Active && a.Id == id).FirstOrDefault();


                ev.Active = false;
                ev.DateUpdated = DateTime.Now;
                db.Events.Update(ev);
                db.SaveChanges();

                return Ok();
            }
            catch (Exception err)
            {
                utility.AddLog("EventController", "HttpDelete", err, "api/event/deleteevent/{id}");
                return BadRequest(err.Message);
                 
            }

        }

    


    }
}