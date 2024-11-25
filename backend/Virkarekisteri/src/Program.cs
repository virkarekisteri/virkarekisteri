using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Virkarekisteri.Middleware;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication(builder => builder.UseMiddleware<RoleAuthorizationMiddleware>())
    .ConfigureServices(
        (config, services) =>
        {
            services.AddApplicationInsightsTelemetryWorkerService();
            services.ConfigureFunctionsApplicationInsights();
            services.AddScoped<IPositionRepository, PositionRepository>();
            services.AddScoped<IPositionNameRepository, PositionNameRepository>();
            services.AddScoped<IOrganizationTreeRepository, OrganizationTreeRepository>();
            services.AddScoped<IPositionEmployeeRepository, PositionEmployeeRepository>();
            services.AddScoped<IChangeLogRepository, ChangeLogRepository>();
            services.AddDbContext<VirkarekisteriDb>(options =>
                options.UseSqlServer(
                    config.Configuration["SqlConnectionString"],
                    sqlOptions => sqlOptions.EnableRetryOnFailure(2)
                )
            );
        }
    )
    .Build();

await host.RunAsync();
