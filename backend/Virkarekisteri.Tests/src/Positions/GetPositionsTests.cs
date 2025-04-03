using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Virkarekisteri.Functions.Positions;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Tests.Positions;

public class GetPositionsTests
{
    private readonly Mock<IPositionRepository> _positionRepositoryMock;
    private readonly GetPositions _function;

    public GetPositionsTests()
    {
        Mock<ILogger<GetPosition>> loggerMock = new();
        _positionRepositoryMock = new Mock<IPositionRepository>();
        _function = new GetPositions(loggerMock.Object, _positionRepositoryMock.Object);
    }

    [Fact]
    public async Task ReturnsOkObjectResult_WhenPositionsExist()
    {
        var context = new DefaultHttpContext();
        var request = context.Request;

        var mockPositions = new List<Position>
        {
            new Position { Id = Guid.NewGuid(), CreationDecisionNumber = "123" },
            new Position { Id = Guid.NewGuid(), CreationDecisionNumber = "456" },
        };
        _positionRepositoryMock.Setup(repo => repo.GetPositions()).ReturnsAsync(mockPositions);

        var result = await _function.Run(request);

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().Be(mockPositions);
    }
}
