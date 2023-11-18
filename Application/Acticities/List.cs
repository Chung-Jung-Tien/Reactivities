using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Acticities
{
    public class List
    {
        public class Query : IRequest<List<Activity>>{}

        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private DataContext _context { get; }

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Activity>> Handle(Query request, CancellationToken token)
            {
                return await _context.Activities.ToListAsync();
            }
        }
    }
}