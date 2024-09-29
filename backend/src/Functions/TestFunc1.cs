using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Sql;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Models;

namespace Virkarekisteri.Functions;

public class TestFunc1(ILogger<TestFunc1> logger)
{
    [Function("TestFunc1")]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req,
        [SqlInput(commandText: "SELECT * FROM dbo.TestTable1", connectionStringSetting: "SqlConnectionString")]
            IEnumerable<TestTableModel> sqlData
    )
    {
        var firstRow = sqlData.FirstOrDefault();
        logger.LogInformation(
            "C# HTTP trigger function processed a request.\nFirst row message: {FirstRow}",
            firstRow?.CoolMessage ?? "Empty"
        );
        return new OkObjectResult(sqlData);
    }
}
