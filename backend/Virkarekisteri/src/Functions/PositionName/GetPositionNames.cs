using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Functions.PositionName
{
    public class GetPositionNames
    {
        private readonly ILogger<GetPositionNames> _logger;
        private readonly IPositionNameRepository _positionNameRepository;

        public GetPositionNames(ILogger<GetPositionNames> logger, IPositionNameRepository positionNameRepository)
        {
            _logger = logger;
            _positionNameRepository = positionNameRepository;
        }

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
            _logger.LogInformation("Getting all position names");

            var positionNames = await _positionNameRepository.GetAllPositionNames();
            return new OkObjectResult(positionNames);
        }
    }
}
