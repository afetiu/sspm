using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using static SSPM_API.Utility.Enumerations;

namespace SSPM_API.Models
{
    public class BloggingContext : DbContext
    {
        public BloggingContext(DbContextOptions<BloggingContext> options)
          : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Servicing> Servicing { get; set; }
        public DbSet<ErrorLog> ErrorLogs { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<OfferProduct> OfferProducts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<TransactedProduct> TransactedProducts { get; set; }
        public DbSet<Event> Events { get; set; }


        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer(@"data source=.\SQLEXPRESS; initial catalog=SSPM;integrated security=SSPI; ");
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Transaction>()
               .HasOne(t => t.User)
               .WithMany(u => u.Transactions)
               .OnDelete(DeleteBehavior.Restrict); 
        } 
    }

    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }
        public virtual Role Role { get; set; }
        public DateTime DateInserted { get; set; }
        public DateTime DateUpdated { get; set; }
        public bool Active { get; set; }
        public virtual ICollection<Product> Products { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
        public virtual ICollection<Servicing> Servicings { get; set; }


    }

    public class Role
    {
        public virtual int Id { get; set; }
        public virtual string Name { get; set; }
        public virtual string Description { get; set; }
        public virtual DateTime DateInserted { get; set; }
        public virtual DateTime DateUpdated { get; set; }
        public virtual bool Active { get; set; }
    }

    public class Product
    {
        public int Id { get; set; }
        public string Model { get; set; }
        public string Barcode { get; set; }
        public int BrandId { get; set; }
        public virtual Brand Brand { get; set; }
        public int SupplierId { get; set; }
        public virtual Supplier Supplier { get; set; }
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }
        public double SupplyPrice { get; set; }
        public double SalePrice { get; set; }
        public double Quantity { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public DateTime DateInserted { get; set; }
        public DateTime DateUpdated { get; set; }
        public bool Active { get; set; }
    }

    public class Brand
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime DateInserted { get; set; }
        public DateTime DateUpdated { get; set; }
        public bool Active { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }


    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime DateInserted { get; set; }
        public DateTime DateUpdated { get; set; }
        public bool Active { get; set; }
        public virtual ICollection<Product> Products { get; set; }

    }

    public class Servicing
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public double ServicePrice { get; set; }
        public string Description { get; set; }
        public string Client { get; set; }
        public DateTime DateInserted { get; set; }
        public DateTime DateUpdated { get; set; }
        public bool Active { get; set; }
    }

    public class ErrorLog
    {
        public int Id { get; set; }
        public string CLASS { get; set; }
        public string METHOD { get; set; }
        public string REQUEST_USER { get; set; }
        public string TOKEN { get; set; }
        public string REQUESTURL { get; set; }
        public string MESSAGE { get; set; }
        public string STACKTRACE { get; set; }
        public DateTime REQUEST_DATE { get; set; }
    }


    public class Supplier
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime DateInserted { get; set; }
        public DateTime DateUpdated { get; set; }
        public bool Active { get; set; }
        public virtual ICollection<Product> Products { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }

    }


    public class Offer
    {
        public int Id { get; set; }
        public double TotalPrice { get; set; }
        public int Discount { get; set; }
        public DiscountType DiscountType { get; set; }
        public double FinalPrice { get; set; }
        public string OfferReceiver { get; set; }
        public virtual ICollection<OfferProduct> OfferProducts { get; set; }
        public DateTime DateInserted { get; set; }
        public DateTime DateUpdated { get; set; }
        public bool Active { get; set; }
    }

    public class OfferProduct
    {
        public int Id { get; set; }
        public string Model { get; set; }
        public string Barcode { get; set; }
        public int BrandId { get; set; }
        public virtual Brand Brand { get; set; }
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }
        public int SupplierId { get; set; }
        public virtual Supplier Supplier { get; set; }
        public double OfferPrice { get; set; }
        public double OfferQuantity { get; set; }
        public int OfferId { get; set; }
        public virtual Offer Offer { get; set; }
        public string Description { get; set; }
        public DateTime DateInserted { get; set; }
        public DateTime DateUpdated { get; set; }
        public bool Active { get; set; }
    }

    public class Transaction
    {
        public int Id { get; set; }
        public TransactionType TransactionType { get; set; }
        public double TotalQuantity { get; set; }
        public double InitialPrice { get; set; }
        public double Discount { get; set; }
        public DiscountType DiscountType { get; set; }
        public double TotalPrice { get; set; }
        public string Client { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<TransactedProduct> TransactedProducts { get; set; }
        public DateTime DateInserted { get; set; }
        public DateTime DateUpdated { get; set; }
        public bool Active { get; set; }
    }

    public class TransactedProduct
    {
        public int Id { get; set; }
        public string Model { get; set; }
        public string Barcode { get; set; }
        public int BrandId { get; set; }
        public virtual Brand Brand { get; set; }
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }
        public int SupplierId { get; set; }
        public virtual Supplier Supplier { get; set; }
        public double TransactionPrice { get; set; }
        public double TransactionQuantity { get; set; }
        public int TransactionId { get; set; }
        public virtual Transaction Transaction { get; set; }
        public string Description { get; set; }
        public DateTime DateInserted { get; set; }
        public DateTime DateUpdated { get; set; }
        public bool Active { get; set; }
    }


    public class Event
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool AllDay { get; set; }
        public DateTime DateInserted { get; set; }
        public DateTime DateUpdated { get; set; }
        public bool Active { get; set; }
    }

}