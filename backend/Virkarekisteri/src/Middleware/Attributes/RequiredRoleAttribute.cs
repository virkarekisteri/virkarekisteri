namespace Virkarekisteri.Middleware.Attributes;

// Higher roles imply all lower roles
// And in enums of course the order grows as we add members below
// (remember enum members are constants of an undelying intregral type, in this case int, starting from 0)
public enum RoleHierarchy
{
    Reader,
    Editor,
    Admin,
}

public abstract class RequiredRoleAttribute(RoleHierarchy role) : Attribute
{
    public RoleHierarchy Role { get; } = role;
}

[AttributeUsage(AttributeTargets.Method)]
public class RequiresReadRoleAttribute() : RequiredRoleAttribute(RoleHierarchy.Reader);

[AttributeUsage(AttributeTargets.Method)]
public class RequiresEditRoleAttribute() : RequiredRoleAttribute(RoleHierarchy.Reader);

[AttributeUsage(AttributeTargets.Method)]
public class RequiresAdminRoleAttribute() : RequiredRoleAttribute(RoleHierarchy.Reader);
