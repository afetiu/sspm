using Microsoft.AspNetCore.Mvc;
using SSPM_API.Models;
using SSPM_API.Utility;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SSPM.Controllers
{
    [ApiController] 
    public class AdministrationController : Controller
    {
        BloggingContext db;
        Utilities utility;

        public AdministrationController(BloggingContext bloggingContext, Utilities u)
        {
            db = bloggingContext;
            utility = u;
        }


        [HttpPost]
        [Route("administration/brands")]
        public IActionResult GetAllBrands([FromBody] Filter filter)
        {
            try
            {
                PagedList result = new PagedList();

                IQueryable allBrands = db.Brands.Where(a => a.Active).GetAllFiltered(filter);
                int count = db.Brands.Where(a => a.Active).GetAllFilteredCount(filter);

                result.Data = allBrands;
                result.Count = count;

                return Ok(result);
            }
            catch (Exception err)
            {
                utility.AddLog("AdministrationController", "POST", err, "api/administration/brands");
                throw;

            }


        }

        [HttpPost]
        [Route("administration/categories")]
        public IActionResult GetAllCategories([FromBody] Filter filter)
        {
            try
            {
                PagedList result = new PagedList();

                IQueryable allClassifications = db.Categories.Where(a => a.Active).GetAllFiltered(filter);
                int count = db.Categories.Where(a => a.Active).GetAllFilteredCount(filter);

                result.Data = allClassifications;
                result.Count = count;
                return Ok(result);
            }
            catch (Exception err)
            {
                utility.AddLog("AdministrationController", "POST", err, "api/administration/categories");
                throw;

            }

        }

        [HttpPost]
        [Route("administration/suppliers")]
        public IActionResult GetAllSuppliers([FromBody] Filter filter)
        {
            try
            {
                PagedList result = new PagedList();

                IQueryable allSuppliers = db.Suppliers.Where(a => a.Active).GetAllFiltered(filter);
                int count = db.Suppliers.Where(a => a.Active).GetAllFilteredCount(filter);

                result.Data = allSuppliers;
                result.Count = count;

                return Ok(result);
            }
            catch (Exception err)
            {
                utility.AddLog("AdministrationController", "POST", err, "api/administration/supplier");
                throw;

            }


        }

        [HttpPost]
        [Route("administration/newbrand")]
        public IActionResult RegisterNewBrand([FromBody] Brand model)
        {
            try
            {
                var existingBrand = db.Brands.Where(a => a.Active && a.Name.ToLower() == model.Name.ToLower())
               .FirstOrDefault();

                if (existingBrand == null)
                {
                    Brand newBrand = new Brand();
                    newBrand.Active = true;
                    newBrand.DateInserted = DateTime.Now;
                    newBrand.DateUpdated = DateTime.Now;
                    newBrand.Name = model.Name;

                    db.Brands.Add(newBrand);
                    db.SaveChanges();
                }
                else
                {
                    return BadRequest("Kjo firme ekziston");
                }

                return Ok();
            }
            catch (Exception err)
            {
                utility.AddLog("AdministrationController", "POST", err, "api/administration/newbrand");
                throw;

            }

        }

        [HttpPost]
        [Route("administration/newsupplier")]
        public IActionResult RegisterNewSupplier([FromBody] Supplier model)
        {
            try
            {
                var existingSupplier = db.Brands.Where(a => a.Active && a.Name.ToLower() == model.Name.ToLower())
               .FirstOrDefault();

                if (existingSupplier == null)
                {
                    Supplier newSupplier = new Supplier();
                    newSupplier.Active = true;
                    newSupplier.DateInserted = DateTime.Now;
                    newSupplier.DateUpdated = DateTime.Now;
                    newSupplier.Name = model.Name;

                    db.Suppliers.Add(newSupplier);
                    db.SaveChanges();
                }
                else
                {
                    return BadRequest("Ky furnizues ekziston");
                }

                return Ok();
            }
            catch (Exception err)
            {
                utility.AddLog("AdministrationController", "POST", err, "api/administration/newsupplier");
                throw;

            }

        }

        [HttpPost]
        [Route("administration/newcategory")]
        public IActionResult RegisterNewCategory([FromBody] Category NewCategory)
        {
            try
            {
                var existingClassification = db.Categories.
               Where(a => a.Active && a.Name.ToLower() == NewCategory.Name.ToLower()).FirstOrDefault();


                if (existingClassification == null)
                {
                    Category newCat = new Category();
                    newCat.Active = true;
                    newCat.DateInserted = DateTime.Now;
                    newCat.DateUpdated = DateTime.Now;
                    newCat.Name = NewCategory.Name;

                    db.Categories.Add(newCat);

                    db.SaveChanges();
                }

                else
                {
                    return BadRequest("Kjo kategori ekziston");
                }

                return Ok();
            }
            catch (Exception err)
            {
                utility.AddLog("AdministrationController", "POST", err, "api/administration/newcategory");
                throw;

            }

        }

        [HttpDelete]
        [Route("administration/deletebrand/{id}")]
        public IActionResult DeleteBrand(int id)
        {
            try
            {
                var brand = db.Brands.Where(a => a.Active && a.Id == id).FirstOrDefault();

                var productsWithThisBrand = db.Products.Where(a => a.Active && a.BrandId == id).FirstOrDefault();

                if (productsWithThisBrand != null)
                {
                    return BadRequest("Nuk mund te fshihet sepse ka produkte qe e kane kete firme");
                }


                if (brand != null)
                {
                    brand.Active = false;
                    brand.DateUpdated = DateTime.Now;
                    db.Brands.Update(brand);
                }

                db.SaveChanges();

                return Ok();
            }
            catch (Exception err)
            {
                utility.AddLog("AdministrationController", "HttpDelete", err, "api/administration/deletebrand/{id}");
                throw;

            }

        }


        [HttpDelete]
        [Route("administration/deletesupplier/{id}")]
        public IActionResult DeleteSupplier(int id)
        {
            try
            {
                var supplier = db.Suppliers.Where(a => a.Active && a.Id == id).FirstOrDefault();

                var productsWithThisBrand = db.Products.Where(a => a.Active && a.BrandId == id).FirstOrDefault();

                if (productsWithThisBrand != null)
                {
                    return BadRequest("Nuk mund te fshihet sepse ka produkte qe e kane kete firme");
                }


                if (supplier != null)
                {
                    supplier.Active = false;
                    supplier.DateUpdated = DateTime.Now;
                    db.Suppliers.Update(supplier);
                }

                db.SaveChanges();

                return Ok();
            }
            catch (Exception err)
            {
                utility.AddLog("AdministrationController", "HttpDelete", err, "api/administration/deletesupplier/{id}");
                throw;

            }

        }


        [HttpDelete]
        [Route("administration/deletecategory/{id}")]
        public IActionResult DeleteCategory(int id)
        {
            try
            {
                var category = db.Categories.Where(a => a.Active && a.Id == id).FirstOrDefault();

                var productsWithThisCategory = db.Products.Where(a => a.Active && a.CategoryId == id).FirstOrDefault();

                if (productsWithThisCategory != null)
                {
                    return BadRequest("Nuk mund te fshihet sepse ka produkte qe e kane kete kategori");
                }

                if (category != null)
                {
                    category.Active = false;
                    category.DateUpdated = DateTime.Now;
                    db.Categories.Update(category);
                }

                db.SaveChanges();

                return Ok();
            }
            catch (Exception err)
            {
                utility.AddLog("AdministrationController", "HttpDelete", err, "api/administration/deletecategory/{id}");
                throw;

            }

        }

        [HttpGet]
        [Route("administration/selectitem/brands")]
        public IActionResult GetBrandsSelectItems()
        {
            try
            {
                var brands = db.Brands.Where(a => a.Active);

                List<SelectedItem> brandsList = new List<SelectedItem>();

                foreach (var brand in brands)
                {
                    SelectedItem selectedItem = new SelectedItem();
                    selectedItem.Label = brand.Name;
                    selectedItem.Value = brand.Id;

                    brandsList.Add(selectedItem);
                }


                return Ok(brandsList);
            }
            catch (Exception err)
            {
                utility.AddLog("AdministrationController", "HttpGet", err, "api/administration/selectitem/brands");
                throw;

            }

        }


        [HttpGet]
        [Route("administration/getsupplierbyid/{id}")]
        public IActionResult GetSuppliersSelectItems(int id)
        {
            try
            {
                var supplier = db.Suppliers.Where(a => a.Active && a.Id == id).FirstOrDefault();

                if (supplier == null)
                {
                    return BadRequest("Ky furnizues nuk eshte gjetur");
                }

                return Ok(supplier);
            }
            catch (Exception err)
            {
                utility.AddLog("AdministrationController", "HttpGet", err, "api/administration/selectitem/suppliers");
                throw;

            }

        }



        [HttpGet]
        [Route("administration/selectitem/suppliers")]
        public IActionResult GetSuppliersSelectItems()
        {
            try
            {
                var suppliers = db.Suppliers.Where(a => a.Active);

                List<SelectedItem> SuppliersList = new List<SelectedItem>();

                foreach (var brand in suppliers)
                {
                    SelectedItem selectedItem = new SelectedItem();
                    selectedItem.Label = brand.Name;
                    selectedItem.Value = brand.Id;

                    SuppliersList.Add(selectedItem);
                }


                return Ok(SuppliersList);
            }
            catch (Exception err)
            {
                utility.AddLog("AdministrationController", "HttpGet", err, "api/administration/selectitem/suppliers");
                throw;

            }

        }


        [HttpGet]
        [Route("administration/selectitem/categories")]
        public IActionResult GetClassificationsSelectItems()
        {
            try
            {
                var categories = db.Categories.Where(a => a.Active);

                List<SelectedItem> categoryList = new List<SelectedItem>();

                foreach (var cat in categories)
                {
                    SelectedItem selectedItem = new SelectedItem();
                    selectedItem.Label = cat.Name;
                    selectedItem.Value = cat.Id;

                    categoryList.Add(selectedItem);
                }


                return Ok(categoryList);
            }
            catch (Exception err)
            {
                utility.AddLog("AdministrationController", "HttpGet", err, "api/administration/selectitem/categories");
                throw;

            }

        }
    }
}
