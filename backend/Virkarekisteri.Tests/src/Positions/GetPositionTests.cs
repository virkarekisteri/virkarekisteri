using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Virkarekisteri.Functions.Positions;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Tests.Positions;

public class GetPositionTests
{
    private readonly Mock<IPositionRepository> _positionRepositoryMock;
    private readonly GetPosition _function;

    public GetPositionTests()
    {
        Mock<ILogger<GetPosition>> loggerMock = new();
        _positionRepositoryMock = new Mock<IPositionRepository>();
        _function = new GetPosition(loggerMock.Object, _positionRepositoryMock.Object);
    }

    [Fact]
    public async Task ReturnsBadRequest_WhenIdIsInvalid()
    {
        var context = new DefaultHttpContext();
        context.Request.RouteValues["id"] = "invalid-guid";

        var request = context.Request;

        var result = await _function.Run(request);

        var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
        badRequestResult.Value.Should().Be("Failed to parse invalid-guid as a Guid");
    }

    [Fact]
    public async Task ReturnsOkObjectResult_WhenPositionExists()
    {
        var validGuid = Guid.NewGuid();
        var context = new DefaultHttpContext();
        context.Request.RouteValues["id"] = validGuid.ToString();
        var request = context.Request;

        var mockPosition = new Position { Id = validGuid, CreationDecisionNumber = "123" };
        _positionRepositoryMock.Setup(repo => repo.GetPosition(validGuid)).ReturnsAsync(mockPosition);

        var result = await _function.Run(request);

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().Be(mockPosition);
    }

    [Fact]
    public async Task ReturnsNotFound_WhenPositionDoesNotExist()
    {
        var validGuid = Guid.NewGuid();
        var context = new DefaultHttpContext();
        context.Request.RouteValues["id"] = validGuid.ToString();
        var request = context.Request;

        _positionRepositoryMock.Setup(repo => repo.GetPosition(validGuid)).ReturnsAsync((Position?)null);

        var result = await _function.Run(request);

        result.Should().BeOfType<NotFoundResult>();
    }
}
