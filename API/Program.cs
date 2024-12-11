using Microsoft.EntityFrameworkCore;
using Persistence;
using API.Extensions;
using API.MiddleWare;
using Microsoft.AspNetCore.Identity;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using API.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(option => {
    var police = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    option.Filters.Add(new AuthorizeFilter(police));
});
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleWare>();

//都是為了增加網路資安的
app.UseXContentTypeOptions();//Prevent mine sniffing of the content type
app.UseReferrerPolicy(opt => opt.NoReferrer());//this policy allows a site to control how much information the browser includes when navigating away from our app.
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());//this is going to add a cross-site scripting protection header
app.UseXfo(opt => opt.Deny());//this is going to prevent our app being used inside an iframe whitch against that click jacking
//網站引用外部資源的白名單
app.UseCsp(opt => opt
    .BlockAllMixedContent()//force our app only to load 'https' content
    .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com"))//s.Self():sources from our domin is OK, CustomSources():白名單
    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
    .FormActions(s => s.Self())
    .FrameAncestors(s => s.Self())
    .ImageSources(s => s.Self().CustomSources("blob:", "https://res.cloudinary.com"))
    .ScriptSources(s => s.Self())
);


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else 
{
    app.Use(async (context, next) => 
    {
        context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
        await next.Invoke();
    });
}

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();//從 wwwroot 裡面抓整個網頁的進入點
app.UseStaticFiles();//從 wwwroot 裡面抓 static content

app.MapControllers();
app.MapHub<ChatHub>("/chat"); //SignalR
app.MapFallbackToController("Index", "Fallback");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}

app.Run();
