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
            services.AddScoped<IOrganizationTreeRepository, OrganizationTreeRepository>();
            services.AddScoped<IPositionEmployeeRepository, PositionEmployeeRepository>();
            services.AddScoped<IChangeLogRepository, ChangeLogRepository>();
            services.AddScoped<ISubjectRepository, SubjectRepository>();
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
