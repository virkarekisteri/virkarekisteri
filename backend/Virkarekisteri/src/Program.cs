using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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
            services.AddScoped<ICostcentreRepository, CostcentreRepository>();
            services.AddScoped<IPositionEmployeeRepository, PositionEmployeeRepository>();
            services.AddScoped<IPositionChangeLogRepository, PositionChangeLogRepository>();
            services.AddScoped<ISubjectRepository, SubjectRepository>();
            services.AddScoped<ICRUDChangeLogRepository, CRUDChangeLogRepository>();
            services.AddDbContext<VirkarekisteriDb>(options =>
                options.UseSqlServer(
                    config.Configuration.GetConnectionString("SqlConnectionString"),
                    sqlOptions => sqlOptions.EnableRetryOnFailure(6, TimeSpan.FromSeconds(10), null)
                )
            );
        }
    )
    .Build();

await host.RunAsync();
