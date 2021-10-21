using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;

namespace SSPM_API.Utility
{
    public static class LINQExtension
    {
        public static IQueryable GetAllFiltered(this IQueryable query, Filter filter)
        {
            query = query.Where(filter.queryString()).OrderBy("Id Descending").Skip(filter.First).Take(filter.Rows);

            return query;
        }

        public static IQueryable GetAllFilteredWithoutSkip(this IQueryable query, Filter filter)
        {
            query = query.Where(filter.queryString());

            return query;
        }


        public static int GetAllFilteredCount(this IQueryable query, Filter filter)
        {
            return query.Where(filter.queryString()).Count();
        }
 
    }
}
