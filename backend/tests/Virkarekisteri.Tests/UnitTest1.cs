using Xunit;
using Moq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Virkarekisteri.Functions.Positions;
using Virkarekisteri.Repositories;
using Virkarekisteri.Models;
using System.Threading.Tasks;

public class GetPositionTests
{
    private readonly Mock<ILogger<GetPosition>> _loggerMock;
    private readonly Mock<PositionRepository> _positionRepositoryMock;
    private readonly GetPosition _function;

    public GetPositionTests()
    {
        _loggerMock = new Mock<ILogger<GetPosition>>();
        _positionRepositoryMock = new Mock<PositionRepository>();
        _function = new GetPosition(_loggerMock.Object, _positionRepositoryMock.Object);
    }

    [Fact]
    public async Task Run_ReturnsBadRequest_WhenIdIsInvalid()
    {
        // Arrange
        var context = new DefaultHttpContext();
        context.Request.RouteValues["id"] = "invalid-guid";
        var request = context.Request;

        // Act
        var result = await _function.Run(request);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Failed to parse invalid-guid as a Guid", badRequestResult.Value);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WhenPositionExists()
    {
        // Arrange
        var validGuid = Guid.NewGuid();
        var context = new DefaultHttpContext();
        context.Request.RouteValues["id"] = validGuid.ToString();
        var request = context.Request;

        var mockPosition = new Position { Id = validGuid, CreationDecisionNumber = "123" };
        _positionRepositoryMock.Setup(repo => repo.GetPosition(validGuid))
            .ReturnsAsync(mockPosition);

        // Act
        var result = await _function.Run(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(mockPosition, okResult.Value);
    }

    [Fact]
    public async Task Run_ReturnsNotFound_WhenPositionDoesNotExist()
    {
        // Arrange
        var validGuid = Guid.NewGuid();
        var context = new DefaultHttpContext();
        context.Request.RouteValues["id"] = validGuid.ToString();
        var request = context.Request;

        _positionRepositoryMock.Setup(repo => repo.GetPosition(validGuid))
            .ReturnsAsync((Position)null);

        // Act
        var result = await _function.Run(request);

        // Assert
        var notFoundResult = Assert.IsType<OkObjectResult>(result); // Adjust this if your function should return NotFound.
        Assert.Null(notFoundResult.Value); // Assuming null is returned when no position is found.
    }
}
