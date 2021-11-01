using System;

namespace SSPM_API.Models
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Model { get; set; }
        public string Barcode { get; set; }
        public int? BrandId { get; set; }
        public virtual Brand Brand { get; set; }
        public int? SupplierId { get; set; }
        public virtual Supplier Supplier { get; set; }
        public int? CategoryId { get; set; }
        public virtual Category Category { get; set; }
        public double Price { get; set; }
        public double Quantity { get; set; }
        public string Description { get; set; } 
        public int SupplyPrice { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public DateTime DateInserted { get; set; }
        public DateTime DateUpdated { get; set; }
        public bool Active { get; set; }
    }
 
}
