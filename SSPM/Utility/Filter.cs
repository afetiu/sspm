using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SSPM_API.Utility
{
    public class Filter
    {
        public int First{ get; set; }
        public int Rows { get; set; }
        public List<FilterItem> FilterItems { get; set; }



        public string queryString()
        {
            string qString = "1 = 1 ";

            foreach (var filter in FilterItems)
            {
                if (filter.value != null && filter.value != "")
                {
                    switch (filter.type)
                    {
                        case Enumerations.FilterType.text:
                            {
                                qString += "and " + filter.property + ".ToLower().Contains(\""+ filter.value.ToLower() +"\")"; 
                            }
                            break;
                        case Enumerations.FilterType.number:
                            {
                                var value = int.Parse(filter.value);
                                qString += "and " + filter.property + "=" + value ;
                            }
                            break;

                        case Enumerations.FilterType.brand:
                            {
                                qString += "and " + filter.property + ".Id =" + filter.value;
                            }
                            break;

                        case Enumerations.FilterType.supplier:
                            {
                                qString += "and " + filter.property + ".Id =" + filter.value;
                            }
                            break;

                        case Enumerations.FilterType.category:
                            {
                                qString += "and " + filter.property + ".Id =" + filter.value;
                            }
                            break;

                        case Enumerations.FilterType.transactionType:
                            {
                                var value = (Enumerations.TransactionType)int.Parse(filter.value);
                                qString += "and " + filter.property + "=\"" + filter.value + "\"";
                                 
                            }
                            break;

                        case Enumerations.FilterType.date:
                            var dateValueGreaterEq = Convert.ToDateTime(filter.value).Date;
                            var dateValueLessEq = Convert.ToDateTime(filter.value).AddDays(1).Date;
                            qString = qString + " AND " + filter.property + ">= DateTime(" + dateValueGreaterEq.Ticks + ")" + " AND " + filter.property + "< DateTime(" + dateValueLessEq.Ticks + ")";
                            break;
                        case Enumerations.FilterType.dateFrom:
                            var dateValueGreater = Convert.ToDateTime(filter.value).Date;
                            qString = qString + " AND " + filter.property + ">= DateTime(" + dateValueGreater.Ticks + ")";
                            break;
                        case Enumerations.FilterType.dateTo:
                            var dateValueLess = Convert.ToDateTime(filter.value).AddDays(1).Date;
                            qString = qString + " AND " + filter.property + "< DateTime(" + dateValueLess.Ticks + ")";
                            break;
                        default:
                            break;
                    }
                }

            }
            return qString;
        }
    }
}
