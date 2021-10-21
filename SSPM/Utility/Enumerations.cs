using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SSPM_API.Utility
{
    public class Enumerations
    {
        public enum FilterType
        {
            text = 1,
            number = 2,
            date = 3,
            brand = 4,
            category = 5,
            role = 6,
            transactionType = 7,
            dateFrom = 8,
            dateTo = 9,
            supplier = 10
        }

        public enum TransactionType
        {
            sale = 1,
            supply = 2

        }

        public enum DiscountType
        {
            percentage = 1,
            euro = 2

        }
    }
}
