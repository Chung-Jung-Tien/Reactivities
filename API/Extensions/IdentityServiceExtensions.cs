using API.Services;
using Domain;
using Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;

namespace API.Extensions
{
    public static class IdentityServiceExtentions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddIdentityCore<AppUser>(opt => 
            {
                opt.Password.RequireNonAlphanumeric = false;
                opt.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<DataContext>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>{
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                    //for SignalR
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context => {
                            //SignalR the client side is going to pass our token in the query string using the key 'access_token'
                            var accessToken = context.Request.Query["access_token"];  //spelling is important!!

                            var path = context.HttpContext.Request.Path;

                            if(!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chat"))
                            {
                                 context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
            });

            services.AddAuthorization(options => {
                options.AddPolicy("IsActivityHost", policy => {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
            
            services.AddScoped<TokenService>();

            return services;
        }
    }
}