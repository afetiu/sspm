using System.Linq;
using System.Linq.Dynamic.Core;
using Microsoft.AspNetCore.Mvc;
using SSPM_API.Models;
using SSPM_API.Utility;
using Microsoft.EntityFrameworkCore;


namespace SSPM_API.Controllers
{
    [Produces("application/json")]
    public class StatsController : Controller
    {
        BloggingContext db;
        Utilities utility;

        public StatsController(BloggingContext bloggingContext, Utilities u)
        {
            db = bloggingContext;
            utility = u;
        }


        //Producs stats
        [HttpGet]
        [Route("stats/all")]
        public IActionResult ProductStats()
        {
            Stats Stats = new Stats
            {
                TotalSales = db.Transactions.Where(a => a.Active && a.TransactionType == Enumerations.TransactionType.sale).Count(),
                TotalSupplies = db.Transactions.Where(a => a.Active && a.TransactionType == Enumerations.TransactionType.supply).Count(),
                TotalSoldProducts = db.TransactedProducts.Include(a => a.Transaction)
                .Where(a => a.Active && a.Transaction.TransactionType == Enumerations.TransactionType.sale).Count(),
                TotalSuppliedProducts = db.TransactedProducts.Include(a => a.Transaction)
                .Where(a => a.Active && a.Transaction.TransactionType == Enumerations.TransactionType.supply).Count()           
            };


            var transactedProducts = db.TransactedProducts.Include(a => a.Transaction)
                .Where(a => a.Active).ToDynamicList();

            Stats.TotalGain = 0;
            Stats.TotalSpendings = 0;
            Stats.TotalSoldProductsQuantity = 0;
            Stats.TotalSuppliedProductsQuantity = 0;

            foreach (var item in transactedProducts)
            {
                if (item.Transaction.TransactionType == Enumerations.TransactionType.sale)
                {
                    Stats.TotalSoldProductsQuantity = Stats.TotalSoldProductsQuantity + item.TransactionQuantity;
                    Stats.TotalGain = Stats.TotalGain + (item.TransactionPrice * item.TransactionQuantity);
                }
                else if (item.Transaction.TransactionType == Enumerations.TransactionType.supply)
                {
                    Stats.TotalSuppliedProductsQuantity = Stats.TotalSuppliedProductsQuantity + item.TransactionQuantity;
                    Stats.TotalSpendings = Stats.TotalSpendings + (item.TransactionPrice * item.TransactionQuantity);
                }
            }
             
            return Ok(Stats);
        }
      

 

    }
}