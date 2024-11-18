using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Middleware;
using Virkarekisteri.Middleware.Attributes;

namespace Virkarekisteri.Middleware;

// can't make abstract, since the runtime won't be able to use it
// ReSharper disable once ClassNeverInstantiated.Global
public class RoleAuthorizationMiddleware : IFunctionsWorkerMiddleware
{
    public Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var httpContext = context.GetHttpContext();

        // if we are not in a HTTP context, this middleware is not needed
        if (httpContext is null)
            return next(context);

        // Use reflection to determine if this function has the RequiredRole attribute
        // Seems like a hack, but it's the only way to do it until the ASP.NET Core middleware pipeline
        // has been implemented in the Azure Functions ASP.NET Core integration
        var functionType = context.FunctionDefinition.EntryPoint;
        var typeName = functionType[..functionType.LastIndexOf('.')]; // e.g. Virkarekisteri.Functions.Positions.GetPositions
        var methodName = functionType[(functionType.LastIndexOf('.') + 1)..]; // Should be pretty much always "Run"

        var method = Assembly.GetExecutingAssembly().GetType(typeName)?.GetMethod(methodName);

        if (method is null)
            throw new InvalidOperationException($"Unable to find method '{typeName}.{methodName}'");

        var roleRequiredAttribute = method.GetCustomAttribute<RequiredRoleAttribute>();

        if (roleRequiredAttribute is null)
            throw new InvalidOperationException(
                $"The method '{typeName}.{method.Name}' is missing a required role attribute"
            );

        // NOTE!
        // We are not validating the JWT at all, because Azure is configured to do that the before code exectution
        // ever even reaches this point. If you don't have Azure validating the token, you must do it here!
        var token = httpContext.Request.Headers.Authorization.ToString().Split(" ")[^1];
        var jwtToken = new JwtSecurityTokenHandler().ReadToken(token) as JwtSecurityToken;
        var userRoles = jwtToken
            ?.Claims.Where(c => c.Type == "roles")
            .SelectMany(c => Enum.TryParse<RoleHierarchy>(c.Value, out var role) ? new[] { role } : []);

        // if any of the user's roles are higher up in the hierarchy than the required role, we're good
        if (userRoles != null && userRoles.Any(userRole => userRole >= roleRequiredAttribute.Role))
            return next(context);

        httpContext.Response.StatusCode = StatusCodes.Status403Forbidden;

        return Task.CompletedTask;
    }
}
