namespace Virkarekisteri.Middleware.Attributes;

[AttributeUsage(AttributeTargets.Method)]
public class RequiredRoleAttribute(string role) : Attribute
{
    public string Role { get; } = role;
}
