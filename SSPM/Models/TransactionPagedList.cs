

namespace SSPM_API.Models
{
    public class TransactionPagedList
    {
        public object Data { get; set; }
        public double Count { get; set; }

        public double TotalSupplies { get; set; }
        public double TotalSales { get; set; }
        public double TotalSupplySpendings { get; set; }
        public double TotalSalesGains { get; set; }
        public double TotalBalance { get; set; }

    }
}
