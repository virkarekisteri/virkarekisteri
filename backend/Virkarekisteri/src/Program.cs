using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;
using Virkarekisteri.Utils;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(
        (config, services) =>
        {
            services.AddApplicationInsightsTelemetryWorkerService();
            services.ConfigureFunctionsApplicationInsights();
            services.AddScoped<IPositionRepository, PositionRepository>();
            services.AddScoped<IPositionNameRepository, PositionNameRepository>();
            services.AddScoped<IOrganizationTreeRepository, OrganizationTreeRepository>();
            services.AddScoped<IPositionEmployeeRepository, PositionEmployeeRepository>();
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
