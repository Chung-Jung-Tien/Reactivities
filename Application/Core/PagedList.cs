using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Application.Core
{
    public class PagedList<T> : List<T>
    {
        public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
        {
            this.CurrentPage = pageNumber;
            this.TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            this.PageSize = pageSize;
            this.TotalCount = count;
            this.AddRange(items);//將已經分頁的資料(items)交給這個 class
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = await source.CountAsync(); //直接 query database 得到資料總數
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();//得到分頁後的資料

            return new PagedList<T>(items, count, pageNumber, pageSize);//將分頁厚的資料傳給建構子
        }
    }
}