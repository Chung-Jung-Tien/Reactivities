using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class PagingParams
    {
        private const int MaxPageSize = 50;
        public int pageNumber { get; set; } = 1;

        private int _pageSize = 10;
        public int PageSize
        {
            get => _pageSize; //{ return _pageSize = 10; }
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        
    }
}