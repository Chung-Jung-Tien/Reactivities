using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new 
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };

             //this is a custom 'Header', 要 Expose 才可以確保 browser 可以讀，不然會看不見
             response.Headers.Append("Pagination", JsonSerializer.Serialize(paginationHeader)); 

             //Expose to the 'Header'
             response.Headers.Append("Access-Control-Expose-Headers", "Pagination"); //拼寫要完全正確
        }
    }
}