using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SSPM_API.Models;
using SSPM_API.Utility;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace SSPM_API.Controllers
{
    [Produces("application/json")]
    public class ServicingController : Controller
    {
        BloggingContext db;
        Utilities utility;

        public ServicingController(BloggingContext bloggingContext, Utilities u)
        {
            db = bloggingContext;
            utility = u;
        }


        [HttpPost]
        [Route("servicing/all/{id}")]
        public IActionResult GetAllServicings([FromBody]Filter filter, int id)
        {
            try
            {
                 TransactionPagedList result = new TransactionPagedList();

                var allServicings = db.Servicing
                    .Include(a => a.User)
                    .Where(a => a.Active && a.UserId == id)
                    .GetAllFiltered(filter).ToDynamicList();

                double count = db.Servicing.Where(a => a.Active && a.UserId == id).GetAllFilteredCount(filter);

                var allServicingsWithoutSkip = db.Servicing
                   .Where(a => a.Active && a.UserId == id)
                   .GetAllFilteredWithoutSkip(filter).ToDynamicList();

                double balance = 0;

                foreach (var sv in allServicingsWithoutSkip)
                {
                    balance = balance + sv.ServicePrice;

                }



                result.Data = allServicings;
                result.TotalBalance = balance;
                result.Count = count;
                

                return Ok(result);
            }
            catch (Exception err)
            {
                utility.AddLog("TransactionController", "POST", err, "api/transaction/all");
                return BadRequest(err.Message);

            }
        }


        [HttpPost]
        [Route("servicing/alltoday/{id}")]
        public IActionResult GetAllServicingsToday([FromBody]Filter filter, int id)
        {
            try
            {

                FilterItem dateFrom = new FilterItem();
                dateFrom.property = "DateInserted";
                dateFrom.type = Enumerations.FilterType.dateFrom;
                dateFrom.value = DateTime.Now.ToString();

                FilterItem dateTo = new FilterItem();
                dateTo.property = "DateInserted";
                dateTo.type = Enumerations.FilterType.dateTo;
                dateTo.value = DateTime.Now.ToString();

                filter.FilterItems.Add(dateFrom);
                filter.FilterItems.Add(dateTo);


                TransactionPagedList result = new TransactionPagedList();

                var allServicings = db.Servicing
                    .Include(a => a.User)
                    .Where(a => a.Active && a.UserId == id)
                    .GetAllFiltered(filter).ToDynamicList();

                double count = db.Servicing.Where(a => a.Active && a.UserId == id).GetAllFilteredCount(filter);

                var allServicingsWithoutSkip = db.Servicing
                   .Where(a => a.Active && a.UserId == id)
                   .GetAllFilteredWithoutSkip(filter).ToDynamicList();

                double balance = 0;

                foreach (var sv in allServicingsWithoutSkip)
                {
                    balance = balance + sv.ServicePrice;

                }



                result.Data = allServicings;
                result.TotalBalance = balance;
                result.Count = count;


                return Ok(result);
            }
            catch (Exception err)
            {
                utility.AddLog("TransactionController", "POST", err, "api/transaction/all");
                return BadRequest(err.Message);

            }
        }

        [HttpPost]
        [Route("servicing/addservicing")]
        public IActionResult AddNewSupply([FromBody]Servicing model)
        {
            try
            {
                Servicing servicing = new Servicing
                {
                    DateInserted = DateTime.Now,
                    DateUpdated = DateTime.Now, 
                    Active = true,
                    User = db.Users.Where(a => a.Active && a.Id == model.UserId).FirstOrDefault(),
                    Description = model.Description,
                    ServicePrice = model.ServicePrice,
                    Client = model.Client
                }; 

                db.Servicing.Add(servicing);
                db.SaveChanges();
                return Ok(servicing);

            }
            catch (Exception err)
            {
                utility.AddLog("ServicingController", "POST", err, "api/servicing/addservicing");
                return BadRequest(err.Message);


            }
        } 

    }
}