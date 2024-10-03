using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Virkarekisteri.Utils;

public static class DeserializeHelper
{
    /// <summary>
    /// Helper function to deserialize the request body into a given type T
    /// </summary>
    /// <param name="req"> The input HTTP request that should contain a json body deserializable to type T</param>
    /// <typeparam name="T">Type to deserialize to</typeparam>
    /// <returns>
    /// Deserialized object of type T
    /// </returns>
    public static async Task<(BadRequestObjectResult? Error, T Result)> TryDeserializeRequestBody<T>(HttpRequest req)
        where T : class
    {
        try
        {
            var result = await req.ReadFromJsonAsync<T>(
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    AllowTrailingCommas = true,
                    UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow,
                }
            );

            if (result == null)
            {
                return (new BadRequestObjectResult("Invalid JSON input"), null!);
            }

            return (null, result);
        }
        catch (Exception e)
        {
            return (new BadRequestObjectResult(e.Message), null!);
        }
    }
}
