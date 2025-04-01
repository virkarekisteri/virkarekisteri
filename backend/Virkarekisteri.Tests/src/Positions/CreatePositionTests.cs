using System.Text;
using System.Text.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Virkarekisteri.Functions.Positions;
using Virkarekisteri.Models;
using Virkarekisteri.Repositories;

namespace Virkarekisteri.Tests.Positions;

public class CreatePositionTests
{
    private readonly Mock<IPositionRepository> _positionRepositoryMock;
    private readonly Mock<IPositionNameRepository> _positionNameRepositoryMock;
    private readonly Mock<IPositionChangeLogRepository> _positionChangeLogRepositoryMock;
    private readonly CreatePosition _function;

    public CreatePositionTests()
    {
        Mock<ILogger<CreatePosition>> loggerMock = new();
        _positionRepositoryMock = new Mock<IPositionRepository>();
        _positionNameRepositoryMock = new Mock<IPositionNameRepository>();
        _positionChangeLogRepositoryMock = new Mock<IPositionChangeLogRepository>();

        _function = new CreatePosition(
            loggerMock.Object,
            _positionRepositoryMock.Object,
            _positionNameRepositoryMock.Object,
            _positionChangeLogRepositoryMock.Object
        );
    }

    [Fact]
    public async Task ReturnsBadRequest_WhenPositionNameIsNullorWhiteSpace()
    {
        var context = new DefaultHttpContext();
        var request = context.Request;

        var mockPosition = new Position
        {
            Id = Guid.NewGuid(),
            CreationDecisionNumber = "123",
            CostcentreId = Guid.NewGuid(),
        };
        _positionRepositoryMock.Setup(repo => repo.CreatePosition(It.IsAny<Position>())).ReturnsAsync(mockPosition);

        var json = JsonSerializer.Serialize(mockPosition);
        var jsonBytes = Encoding.UTF8.GetBytes(json);

        request.Body = new MemoryStream(jsonBytes);
        request.ContentType = "application/json";

        var result = await _function.Run(request);

        var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
        badRequestResult.Value.Should().Be("Either PositionNameId or a valid PositionName must be provided.");
    }

    [Fact]
    public async Task ReturnsOkObjectResult_WhenPositionIsCreated()
    {
        var context = new DefaultHttpContext();
        var request = context.Request;

        var mockPosition = new Position
        {
            Id = Guid.NewGuid(),
            CreationDecisionNumber = "123",
            Type = 0,
            PositionNameId = Guid.NewGuid(),
            CostcentreId = Guid.NewGuid(),
        };
        _positionRepositoryMock.Setup(repo => repo.CreatePosition(It.IsAny<Position>())).ReturnsAsync(mockPosition);

        var json = JsonSerializer.Serialize(mockPosition);
        var jsonBytes = Encoding.UTF8.GetBytes(json);

        request.Body = new MemoryStream(jsonBytes);
        request.ContentType = "application/json";

        var result = await _function.Run(request);

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().Be(mockPosition);
    }

    [Fact]
    public async Task ReturnsOkObjectResult_WhenPositionNameIsProvided()
    {
        var context = new DefaultHttpContext();
        var request = context.Request;

        var mockPositionNameId = Guid.NewGuid();
        var mockPosition = new Position
        {
            Id = Guid.NewGuid(),
            CreationDecisionNumber = "123",
            Type = 0,
            PositionNameId = mockPositionNameId,
            PositionName = new PositionName { Id = mockPositionNameId, Name = "Test" },
            CostcentreId = Guid.NewGuid(),
        };

        _positionRepositoryMock.Setup(repo => repo.CreatePosition(It.IsAny<Position>())).ReturnsAsync(mockPosition);
        _positionNameRepositoryMock
            .Setup(repo => repo.GetPositionNameIdByName(It.IsAny<string>()))
            .ReturnsAsync(mockPositionNameId);

        var json = JsonSerializer.Serialize(mockPosition);
        var jsonBytes = Encoding.UTF8.GetBytes(json);

        request.Body = new MemoryStream(jsonBytes);
        request.ContentType = "application/json";

        var result = await _function.Run(request);

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().Be(mockPosition);
    }

    [Fact]
    public async Task ReturnsOkObjectResult_WhenPositionNameIsNotProvided()
    {
        var context = new DefaultHttpContext();
        var request = context.Request;

        var mockPositionNameId = Guid.NewGuid();
        var mockPosition = new Position
        {
            Id = Guid.NewGuid(),
            CreationDecisionNumber = "123",
            Type = 0,
            PositionNameId = mockPositionNameId,
            CostcentreId = Guid.NewGuid(),
        };
        _positionRepositoryMock.Setup(repo => repo.CreatePosition(It.IsAny<Position>())).ReturnsAsync(mockPosition);
        _positionNameRepositoryMock
            .Setup(repo => repo.GetPositionNameIdByName(It.IsAny<string>()))
            .ReturnsAsync((Guid?)null);
        _positionNameRepositoryMock
            .Setup(repo => repo.CreatePositionName(It.IsAny<string>()))
            .ReturnsAsync(Guid.NewGuid());

        var json = JsonSerializer.Serialize(mockPosition);
        var jsonBytes = Encoding.UTF8.GetBytes(json);

        request.Body = new MemoryStream(jsonBytes);
        request.ContentType = "application/json";

        var result = await _function.Run(request);

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().Be(mockPosition);
    }
}
