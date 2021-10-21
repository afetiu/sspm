using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static SSPM_API.Utility.Enumerations;

namespace SSPM_API.Utility
{
    public class FilterItem
    {
        public string property { get; set; }
        public string value { get; set; }
        public FilterType type { get; set; }
    }
}




