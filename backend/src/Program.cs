using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(
        (config, services) =>
        {
            services.AddApplicationInsightsTelemetryWorkerService();
            services.ConfigureFunctionsApplicationInsights();
            services.AddScoped<PositionRepository>();
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
