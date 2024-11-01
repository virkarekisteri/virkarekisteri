using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Functions.Positions;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.PositionName
{
    public class GetPositionNames(ILogger<GetPositionNames> logger, IPositionNameRepository positionNameRepository)
    {
        /// <summary>
        /// Gets all position names from the database
        /// </summary>
        /// <param name="req">Input GET request</param>
        /// <returns>
        /// All position names in the database
        /// </returns>
        [Function("GetPositionNames")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "GET", Route = "positionnames")] HttpRequest req
        )
        {
            logger.LogInformation("Getting all position names");

            var positionNames = await positionNameRepository.GetAllPositionNames();
            return new OkObjectResult(positionNames);
        }
    }
}
