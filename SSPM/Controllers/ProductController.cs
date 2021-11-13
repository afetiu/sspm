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
    public class ProductController : Controller
    {
        BloggingContext db;
        Utilities utility;

        public ProductController(BloggingContext bloggingContext, Utilities u)
        {
            db = bloggingContext;
            utility = u;
        }



        [HttpPost]
        [Route("product/all")]
        public IActionResult GetAllProducts([FromBody] Filter filter)
        {
            try
            {
                PagedList result = new PagedList();

                var allProducts = db.Products
                    .Include(a => a.Brand)
                    .Include(a => a.Category)
                    .Include(a => a.Supplier)
                    .Where(a => a.Active)
                    .GetAllFiltered(filter);
                int count = db.Products.Where(a => a.Active).GetAllFilteredCount(filter);



                result.Data = allProducts;
                result.Count = count;

                return Ok(result);
            }
            catch (Exception err)
            {
                utility.AddLog("ProductController", "POST", err, "api/product/all");
                return BadRequest(err.Message);

            }
        }

        [HttpPost]
        [Route("product/addnewproduct")]
        public IActionResult AddNewProduct([FromBody] Product model)
        {
            try
            {
                //var existingProduct = db.Products.Where(a => a.Barcode == model.Barcode).FirstOrDefault();

                //if (existingProduct != null)
                //{
                //    return BadRequest("Ky barkod ekziston");
                //}

                Product newProduct = new Product();
                newProduct.Barcode = model.Barcode;
                newProduct.SalePrice = model.SalePrice;
                newProduct.SupplyPrice = model.SupplyPrice;
                newProduct.Quantity = model.Quantity;
                newProduct.Model = model.Model;
                newProduct.Brand = db.Brands.Where(a => a.Active && a.Id == model.BrandId).FirstOrDefault();
                newProduct.Category = db.Categories.Where(a => a.Active && a.Id == model.CategoryId).FirstOrDefault();
                newProduct.Supplier = db.Suppliers.Where(a => a.Active && a.Id == model.SupplierId).FirstOrDefault();
                newProduct.User = db.Users.Where(a => a.Active && a.Id == model.UserId).FirstOrDefault();
                newProduct.Description = model.Description;
                newProduct.DateInserted = DateTime.Now;
                newProduct.DateUpdated = DateTime.Now;
                newProduct.Active = true;

                db.Products.Add(newProduct);

                Transaction newTransaction = new Transaction
                {
                    Active = true,
                    User = newProduct.User,
                    //Product = newProduct,
                    TransactionType = Enumerations.TransactionType.supply,
                    DateInserted = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    InitialPrice = model.SupplyPrice * model.Quantity,
                    TotalPrice = model.SupplyPrice * model.Quantity,
                    Discount = 0,
                    TotalQuantity = model.Quantity,
                    UserId = newProduct.User.Id,

                };


                TransactedProduct newTransactedProduct = new TransactedProduct();
                newTransactedProduct.Barcode = model.Barcode;
                newTransactedProduct.TransactionPrice = model.SupplyPrice;
                newTransactedProduct.TransactionQuantity = model.Quantity;
                newTransactedProduct.Model = model.Model;
                newTransactedProduct.Brand = db.Brands.Where(a => a.Active && a.Id == model.BrandId).FirstOrDefault();
                newTransactedProduct.Category = db.Categories.Where(a => a.Active && a.Id == model.CategoryId).FirstOrDefault();
                newTransactedProduct.Supplier = db.Suppliers.Where(a => a.Active && a.Id == model.SupplierId).FirstOrDefault();
                newTransactedProduct.Description = model.Description;
                newTransactedProduct.DateInserted = DateTime.Now;
                newTransactedProduct.DateUpdated = DateTime.Now;
                newTransactedProduct.Active = true;

                newTransaction.TransactedProducts = new List<TransactedProduct>();
                newTransaction.TransactedProducts.Add(newTransactedProduct);
                db.TransactedProducts.Add(newTransactedProduct);
                db.Transactions.Add(newTransaction);
                db.SaveChanges();

                return Ok(newProduct);
            }


            catch (Exception err)
            {
                utility.AddLog("ProductController", "POST", err, "api/product/addnewproduct");
                return BadRequest(err.Message);
            }
        }

        [HttpDelete]
        [Route("product/deleteproduct/{id}")]
        public IActionResult DeleteBrand(int id)
        {
            try
            {
                var product = db.Products.Where(a => a.Active && a.Id == id).FirstOrDefault();

                if (product.Quantity > 0)
                {
                    return BadRequest("Nuk mund te fshihet sepse ka ende ne stok");
                }

                product.Active = false;
                db.Products.Update(product);
                db.SaveChanges();

                return Ok();
            }
            catch (Exception err)
            {
                utility.AddLog("ProductController", "HttpDelete", err, "api/product/deleteproduct/{id}");
                return BadRequest(err.Message);

            }

        }

        [HttpGet]
        [Route("product/selectitem/productmodels")]
        public IActionResult GetBrandsSelectItems()
        {
            try
            {
                var products = db.Products.Where(a => a.Active);

                List<SelectedItem> productModelList = new List<SelectedItem>();

                foreach (var prod in products)
                {
                    SelectedItem selectedItem = new SelectedItem();
                    selectedItem.Label = prod.Model;
                    selectedItem.Value = prod.Id;

                    productModelList.Add(selectedItem);
                }

                return Ok(productModelList);
            }
            catch (Exception err)
            {
                utility.AddLog("ProductController", "HttpGet", err, "api/product/selectitem/productmodels");
                return BadRequest(err.Message);


            }

        }


        [HttpGet]
        [Route("product/getproduct/{model}")]
        public IActionResult GetProductByModel(string model)
        {
            try
            {
                Product product = db.Products
              .Include(a => a.Brand)
              .Include(a => a.Supplier)
              .Include(a => a.Category)
              .FirstOrDefault(a => a.Active && a.Model == model);

                if (product == null)
                {
                    return BadRequest("Nuk eshte gjetur ky produkt");
                }


                return Ok(product);
            }
            catch (Exception err)
            {
                utility.AddLog("ProductController", "HttpGet", err, "api/product/selectitem/productmodels");
                return BadRequest(err.Message);


            }
        }

        [HttpGet]
        [Route("product/getproductbyid/{id}")]
        public IActionResult GetProductById(int id)
        {
            try
            {
                Product product = db.Products
              .Include(a => a.Brand)
              .Include(a => a.Supplier)
              .Include(a => a.Category)
              .FirstOrDefault(a => a.Active && a.Id == id);

                if (product == null)
                {
                    return BadRequest("Nuk eshte gjetur ky produkt");
                }


                return Ok(product);
            }
            catch (Exception err)
            {
                utility.AddLog("ProductController", "HttpGet", err, "api/product/selectitem/productmodels");
                return BadRequest(err.Message);


            }
        }

        [HttpGet]
        [Route("product/getproducts/{model}")]
        public IActionResult GetProductsByModel(string model)
        {
            try
            {
                List<Product> products = db.Products 
              .Where(a => a.Active && a.Model.Contains(model)).ToList();

                List<SelectedItem> list = new();

                foreach (var item in products)
                {
                    list.Add(new SelectedItem { Label = item.Model, Value = item.Id });

                }


                return Ok(list);
            }
            catch (Exception err)
            {
                utility.AddLog("ProductController", "HttpGet", err, "api/product/selectitem/productmodels");
                return BadRequest(err.Message);


            }
        }

        [HttpGet]
        [Route("product/getallproducts")]
        public IActionResult GetAllProducts()
        {
            try
            {
                List<Product> products = db.Products.ToList();

                List<SelectedItem> list = new();

                foreach (var item in products)
                {
                    list.Add(new SelectedItem { Label = item.Model, Value = item.Id });

                } 
                return Ok(list); 
            }
            catch (Exception err)
            {
                utility.AddLog("ProductController", "HttpGet", err, "api/product/selectitem/productmodels");
                return BadRequest(err.Message);


            }
        }

        [HttpGet]
        [Route("product/getproductbybarcode/{barcode}")]
        public IActionResult GetProductByBarcode(string barcode)
        {
            try
            {
                Product product = db.Products
              .Include(a => a.Brand)
              .Include(a => a.Supplier)
              .Include(a => a.Category)
              .FirstOrDefault(a => a.Active && a.Barcode == barcode);

                if (product == null)
                {
                    return BadRequest("Nuk eshte gjetur ky produkt ne baze te barkodit");
                }


                return Ok(product);
            }
            catch (Exception err)
            {
                utility.AddLog("ProductController", "HttpGet", err, "api/product/selectitem/productmodels");
                return BadRequest(err.Message);


            }
        }


    }
}