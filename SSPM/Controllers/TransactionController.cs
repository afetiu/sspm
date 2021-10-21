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
    public class TransactionController : Controller
    {
        BloggingContext db;
        Utilities utility;

        public TransactionController(BloggingContext bloggingContext, Utilities u)
        {
            db = bloggingContext;
            utility = u;
        }



        [HttpPost]
        [Route("transaction/all")]
        public IActionResult GetAllTransactions([FromBody]Filter filter)
        {
            try
            {
                TransactionPagedList result = new TransactionPagedList();

                var allTransactions = db.Transactions
                    .Include(a => a.User)
                    .Where(a => a.Active)
                    .GetAllFiltered(filter).ToDynamicList();

                double count = db.Transactions.Where(a => a.Active).GetAllFilteredCount(filter);
                //double totalSales = db.Transactions.Where(a => a.Active && a.TransactionType == Enumerations.TransactionType.sale).GetAllFilteredCount(filter);
                //double totalSupplies = db.Transactions.Where(a => a.Active && a.TransactionType == Enumerations.TransactionType.supply).GetAllFilteredCount(filter);

                double totalSalesGain = 0;
                double totalSupplySpendings = 0;

                var allTransactionsWithoutSkip = db.Transactions 
                   .Where(a => a.Active)
                   .GetAllFilteredWithoutSkip(filter).ToDynamicList();

                foreach (var transaction in allTransactionsWithoutSkip)
                {
                    if (transaction.TransactionType == Enumerations.TransactionType.sale)
                    {
                        totalSalesGain = totalSalesGain + transaction.TotalPrice;
                    }
                    else if(transaction.TransactionType == Enumerations.TransactionType.supply)
                    {
                        totalSupplySpendings = totalSupplySpendings + transaction.TotalPrice;
                    }
                }
                 

                result.Data = allTransactions;
                result.Count = count;
                //result.TotalSales = totalSales;
                //result.TotalSupplies = totalSupplies;
                result.TotalSalesGains = totalSalesGain;
                result.TotalSupplySpendings = totalSupplySpendings;
                result.TotalBalance = totalSalesGain - totalSupplySpendings;

                return Ok(result);
            }
            catch (Exception err)
            {
                utility.AddLog("TransactionController", "POST", err, "api/transaction/all");
                return BadRequest(err.Message);

            }
        }

        [HttpPost]
        [Route("transaction/allsupplies")]
        public IActionResult GetAllSupplies([FromBody]Filter filter)
        {
            try
            {
                TransactionPagedList result = new TransactionPagedList();

                var allTransactions = db.Transactions
                    .Include(a => a.User)
                    .Where(a => a.Active && a.TransactionType == Enumerations.TransactionType.supply)
                    .GetAllFiltered(filter).ToDynamicList();

                int count = db.Transactions.Where(a => a.Active).GetAllFilteredCount(filter);

                result.Data = allTransactions;
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
        [Route("transaction/alltransactedproducts")]
        public IActionResult GetAllTransactedProducts([FromBody]Filter filter)
        {
            try
            {
                TransactionPagedList result = new TransactionPagedList();

                var allTransactedProducts = db.TransactedProducts 
                    .Include(a => a.Supplier)
                    .Include(a => a.Brand)
                    .Include(a => a.Category)
                    .Include(a => a.Transaction)
                    .Where(a => a.Active)
                    .GetAllFiltered(filter).ToDynamicList();

                int count = db.TransactedProducts.Where(a => a.Active).GetAllFilteredCount(filter);

                //double totalSales = db.Transactions.Where(a => a.Active && a.TransactionType == Enumerations.TransactionType.sale).GetAllFilteredCount(filter);
                //double totalSupplies = db.Transactions.Where(a => a.Active && a.TransactionType == Enumerations.TransactionType.supply).GetAllFilteredCount(filter);

                double totalSalesGain = 0;
                double totalSupplySpendings = 0;

                var allTransactedProductsWithoutSkip = db.TransactedProducts.
                    Include(a=>a.Transaction)
                   .Where(a => a.Active)
                   .GetAllFilteredWithoutSkip(filter).ToDynamicList();

                foreach (var tansProd in allTransactedProductsWithoutSkip)
                {
                    if (tansProd.Transaction.TransactionType == Enumerations.TransactionType.sale)
                    {
                        totalSalesGain = totalSalesGain + (tansProd.TransactionPrice* tansProd.TransactionQuantity);
                    }
                    else if (tansProd.Transaction.TransactionType == Enumerations.TransactionType.supply)
                    {
                        totalSupplySpendings = totalSupplySpendings + (tansProd.TransactionPrice * tansProd.TransactionQuantity);
                    }
                }


                result.Data = allTransactedProducts;
                result.Count = count;
                //result.TotalSales = totalSales;
                //result.TotalSupplies = totalSupplies;
                result.TotalSalesGains = totalSalesGain;
                result.TotalSupplySpendings = totalSupplySpendings;
                result.TotalBalance = totalSalesGain - totalSupplySpendings;
                 
                return Ok(result);
            }
            catch (Exception err)
            {
                utility.AddLog("TransactionController", "POST", err, "api/transaction/alltransactedproducts");
                return BadRequest(err.Message);

            }
        }


        [HttpPost]
        [Route("transaction/alltransactedproductstoday")]
        public IActionResult GetAllTransactedProductsToday([FromBody]Filter filter)
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

                var allTransactedProducts = db.TransactedProducts 
                    .Include(a => a.Transaction)
                    .Where(a => a.Active && a.Transaction.TransactionType == Enumerations.TransactionType.sale)
                    .GetAllFiltered(filter).ToDynamicList();

                int count = db.TransactedProducts.Where(a => a.Active && a.Transaction.TransactionType == Enumerations.TransactionType.sale).GetAllFilteredCount(filter); 

                double totalSalesGain = 0;
                double totalSupplySpendings = 0;

                var allTransactedProductsWithoutSkip = db.TransactedProducts.
                    Include(a => a.Transaction)
                   .Where(a => a.Active)
                   .GetAllFilteredWithoutSkip(filter).ToDynamicList();

                foreach (var tansProd in allTransactedProductsWithoutSkip)
                {
                    if (tansProd.Transaction.TransactionType == Enumerations.TransactionType.sale)
                    {
                        totalSalesGain = totalSalesGain + (tansProd.TransactionPrice * tansProd.TransactionQuantity);
                    }
                    else if (tansProd.Transaction.TransactionType == Enumerations.TransactionType.supply)
                    {
                        totalSupplySpendings = totalSupplySpendings + (tansProd.TransactionPrice * tansProd.TransactionQuantity);
                    }
                }


                result.Data = allTransactedProducts;
                result.Count = count;
                //result.TotalSales = totalSales;
                //result.TotalSupplies = totalSupplies;
                result.TotalSalesGains = totalSalesGain;
                result.TotalSupplySpendings = totalSupplySpendings;
                result.TotalBalance = totalSalesGain - totalSupplySpendings;

                return Ok(result);
            }
            catch (Exception err)
            {
                utility.AddLog("TransactionController", "POST", err, "api/transaction/alltransactedproducts");
                return BadRequest(err.Message);

            }
        }

        [HttpPost]
        [Route("transaction/productbytransactionid/{transactionId}")]
        public IActionResult GetAllTransactedProductsByTransactionId(int transactionId, [FromBody]Filter filter)
        {
            try
            {
                 PagedList result = new  PagedList();

                var allTransactedProducts = db.TransactedProducts
                    .Include(a => a.Supplier)
                    .Include(a => a.Brand)
                    .Include(a => a.Category)
                    .Include(a => a.Transaction)
                    .Where(a => a.Active && a.TransactionId == transactionId)
                    .GetAllFiltered(filter).ToDynamicList();

                int count = db.TransactedProducts.Where(a => a.Active && a.TransactionId == transactionId).GetAllFilteredCount(filter);

                result.Data = allTransactedProducts;
                result.Count = count;

                return Ok(result);
            }
            catch (Exception err)
            {
                utility.AddLog("TransactionController", "POST", err, "api/transaction/productbytransactionid/{transactionId}");
                return BadRequest(err.Message);

            }
        }

        [HttpGet]
        [Route("transaction/productbytransactionidnofilter/{transactionId}")]
        public IActionResult GetAllTransactedProductsByTransactionIdNoFilter(int transactionId)
        {
            try
            {
                PagedList result = new PagedList();

                var allTransactedProducts = db.TransactedProducts
                    .Include(a => a.Supplier)
                    .Include(a => a.Brand)
                    .Include(a => a.Category)
                    .Include(a => a.Transaction)
                    .Where(a => a.Active && a.TransactionId == transactionId).ToDynamicList();

                int count = db.TransactedProducts.Where(a => a.Active && a.TransactionId == transactionId).Count();

                result.Data = allTransactedProducts;
                result.Count = count;

                return Ok(result);
            }
            catch (Exception err)
            {
                utility.AddLog("TransactionController", "POST", err, "api/transaction/productbytransactionid/{transactionId}");
                return BadRequest(err.Message);

            }
        }





        [HttpPost]
        [Route("transaction/addsupply")]
        public IActionResult AddNewSupply([FromBody]Transaction model)
        {
            try
            {
                Transaction supply = new Transaction
                {
                    DateInserted = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    TransactedProducts = new List<TransactedProduct>(),
                    Active = true,
                    User = db.Users.Where(a => a.Active && a.Id == model.UserId).FirstOrDefault(),
                    TotalPrice = model.TotalPrice,
                    Discount = model.Discount,
                    InitialPrice = model.InitialPrice,
                    TotalQuantity = model.TotalQuantity,
                    TransactionType = Enumerations.TransactionType.supply
                };

                foreach (var prod in model.TransactedProducts)
                {
                    prod.Active = true;
                    prod.DateInserted = DateTime.Now;
                    prod.DateUpdated = DateTime.Now;

                    prod.Supplier = db.Suppliers.Where(a => a.Active && a.Id == prod.SupplierId).FirstOrDefault();
                    prod.Brand = db.Brands.Where(a => a.Active && a.Id == prod.BrandId).FirstOrDefault();
                    prod.Category = db.Categories.Where(a => a.Active && a.Id == prod.CategoryId).FirstOrDefault();  


                    supply.TransactedProducts.Add(prod);
                    db.TransactedProducts.Add(prod);

                    var ProductTemp = db.Products.Where(a => a.Active && a.Barcode == prod.Barcode).FirstOrDefault();
                    ProductTemp.Quantity = ProductTemp.Quantity + prod.TransactionQuantity;
                    db.Products.Update(ProductTemp);
                }


                db.Transactions.Add(supply);
                db.SaveChanges();
                return Ok(supply);

            }
            catch (Exception err)
            {
                utility.AddLog("TransactionController", "POST", err, "api/supply/addsupply");
                return BadRequest(err.Message);


            }
        }


        [HttpPost]
        [Route("transaction/addsale")]
        public IActionResult AddNewSale([FromBody]Transaction model)
        {
            try
            {
                Transaction sale = new Transaction
                {
                    DateInserted = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    TransactedProducts = new List<TransactedProduct>(),
                    Active = true,
                    User = db.Users.Where(a => a.Active && a.Id == model.UserId).FirstOrDefault(),
                    TotalPrice = model.TotalPrice,
                    Discount = model.Discount,
                    DiscountType = model.DiscountType,
                    InitialPrice = model.InitialPrice,
                    TotalQuantity = model.TotalQuantity,
                    TransactionType = Enumerations.TransactionType.sale,
                    Client = model.Client

                };

                foreach (var prod in model.TransactedProducts)
                {
                    prod.Active = true;
                    prod.DateInserted = DateTime.Now;
                    prod.DateUpdated = DateTime.Now;

                    prod.Supplier = db.Suppliers.Where(a => a.Active && a.Id == prod.SupplierId).FirstOrDefault();
                    prod.Brand = db.Brands.Where(a => a.Active && a.Id == prod.BrandId).FirstOrDefault();
                    prod.Category = db.Categories.Where(a => a.Active && a.Id == prod.CategoryId).FirstOrDefault();


                    sale.TransactedProducts.Add(prod);
                    db.TransactedProducts.Add(prod);

                    var ProductTemp = db.Products.Where(a => a.Active && a.Barcode == prod.Barcode).FirstOrDefault();
                    ProductTemp.Quantity = ProductTemp.Quantity - prod.TransactionQuantity;
                    db.Products.Update(ProductTemp);
                }


                db.Transactions.Add(sale);
                db.SaveChanges();
                return Ok(sale);

            }
            catch (Exception err)
            {
                utility.AddLog("TransactionController", "POST", err, "api/supply/addsale");
                return BadRequest(err.Message);


            }
        }
     
        [HttpGet]
        [Route("transaction/gettransaction/{id}")]
        public IActionResult GetProductById(int id)
        {

            var transaction = db.Transactions.Where(a => a.Active && a.Id == id);
             

            return Ok();


        }


    }
}