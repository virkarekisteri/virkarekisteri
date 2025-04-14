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

public class UpdatePositionTests
{
    private readonly Mock<IPositionRepository> _positionRepositoryMock;
    private readonly Mock<IPositionNameRepository> _positionNameRepositoryMock;
    private readonly Mock<IPositionChangeLogRepository> _positionChangeLogRepositoryMock;
    private readonly Mock<ICostcentreRepository> _costcentreRepositoryMock;
    private readonly Mock<ISubjectRepository> _subjectRepositoryMock;
    private readonly ILogger<UpdatePosition> _logger;
    private readonly UpdatePosition _updatePosition;

    public UpdatePositionTests()
    {
        _logger = Mock.Of<ILogger<UpdatePosition>>();
        _positionRepositoryMock = new Mock<IPositionRepository>();
        _positionNameRepositoryMock = new Mock<IPositionNameRepository>();
        _positionChangeLogRepositoryMock = new Mock<IPositionChangeLogRepository>();
        _costcentreRepositoryMock = new Mock<ICostcentreRepository>();
        _subjectRepositoryMock = new Mock<ISubjectRepository>();

        _updatePosition = new UpdatePosition(
            _logger,
            _positionRepositoryMock.Object,
            _positionNameRepositoryMock.Object,
            _positionChangeLogRepositoryMock.Object,
            _costcentreRepositoryMock.Object,
            _subjectRepositoryMock.Object
        );
    }

    [Fact]
    public async Task ReturnsBadRequest_WhenPositionIdIsInvalid()
    {
        var context = new DefaultHttpContext();
        var request = context.Request;

        var invalidId = "invalid-id";
        var result = await _updatePosition.Run(request, invalidId);

        var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
        badRequestResult.Value.Should().Be($"Invalid ID format: {invalidId}");
    }

    [Fact]
    public async Task ReturnsNotFound_WhenPositionDoesNotExist()
    {
        var context = new DefaultHttpContext();
        var request = context.Request;

        var positionId = Guid.NewGuid();
        var updateDto = new UpdatePositionDto();
        var requestJson = JsonSerializer.Serialize(updateDto);
        var requestBytes = Encoding.UTF8.GetBytes(requestJson);

        request.Body = new MemoryStream(requestBytes);
        request.ContentType = "application/json";

        var result = await _updatePosition.Run(request, positionId.ToString());

        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task ReturnsBadRequest_WhenFillPercentageIsGreaterThanVacancyPercentage()
    {
        var context = new DefaultHttpContext();
        var request = context.Request;

        var positionId = Guid.NewGuid();
        var existingPosition = new Position
        {
            Id = positionId,
            CreationDecisionNumber = "123",
            VacancySize = .50M,
            VacancyFill = .40M,
            SubjectIds = new List<Guid>() { Guid.NewGuid() },
        };
        var updateDto = new UpdatePositionDto { VacancySize = .50M, VacancyFill = .60M };

        var requestJson = JsonSerializer.Serialize(updateDto);
        var requestBytes = Encoding.UTF8.GetBytes(requestJson);

        _positionRepositoryMock.Setup(repo => repo.GetPosition(positionId)).ReturnsAsync(existingPosition);
        _subjectRepositoryMock
            .Setup(r => r.GetSubjectsByIds(It.IsAny<List<Guid>>()))
            .ReturnsAsync(
                new List<Subject>
                {
                    new Subject { Id = existingPosition.SubjectIds.First(), SubjectName = "TestSubject" },
                }
            );

        request.Body = new MemoryStream(requestBytes);
        request.ContentType = "application/json";

        var result = await _updatePosition.Run(request, positionId.ToString());

        var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
        badRequestResult.Value.Should().Be("VacancyFill cannot be greater than VacancySize.");
    }

    [Fact]
    public async Task UpdatesPosition_WhenFillPercentageIsValid()
    {
        var context = new DefaultHttpContext();
        var request = context.Request;

        var positionId = Guid.NewGuid();
        var existingPosition = new Position
        {
            Id = positionId,
            CreationDecisionNumber = "123",
            VacancySize = .50M,
            VacancyFill = .40M,
        };
        var updateDto = new UpdatePositionDto { VacancyFill = 30 };

        var requestJson = JsonSerializer.Serialize(updateDto);
        var requestBytes = Encoding.UTF8.GetBytes(requestJson);

        _positionRepositoryMock.Setup(repo => repo.GetPosition(positionId)).ReturnsAsync(existingPosition);

        request.Body = new MemoryStream(requestBytes);
        request.ContentType = "application/json";

        var result = await _updatePosition.Run(request, positionId.ToString());

        var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
        badRequestResult.Value.Should().Be("VacancyFill must be between 0% and 100%.");
    }

    /*
    Note: PositionName-related tests are currently commented out due to a recent major logic change.
    Previously, PositionName was managed as an object within the Position entity.
    Now, it's been replaced with a PositionNameId reference, and PositionName management has been moved to its own separate CRUD operations.
    As a result, PositionNames can no longer be created or updated through the Position object.

    [Fact]
    public async Task UpdatesPositionName_WhenPositionNameIsProvided()
    {
        var context = new DefaultHttpContext();
        var request = context.Request;

        var positionId = Guid.NewGuid();
        var mockPositionNameId = Guid.NewGuid();
        var existingPosition = new Position
        {
            Id = positionId,
            CreationDecisionNumber = "123",
            PositionNameId = mockPositionNameId,
            VacancySize = .50M,
            VacancyFill = .40M,
            SubjectIds = new List<Guid>() { Guid.NewGuid() },
        };
        var updateDto = new UpdatePositionDto { PositionName = new PositionNameDto { Name = "New Position Name" } };

        var requestJson = JsonSerializer.Serialize(updateDto);
        var requestBytes = Encoding.UTF8.GetBytes(requestJson);

        _positionRepositoryMock.Setup(repo => repo.GetPosition(positionId)).ReturnsAsync(existingPosition);
        _subjectRepositoryMock
            .Setup(r => r.GetSubjectsByIds(It.IsAny<List<Guid>>()))
            .ReturnsAsync(
                new List<Subject>
                {
                    new Subject { Id = existingPosition.SubjectIds.First(), SubjectName = "TestSubject" },
                }
            );
        _positionNameRepositoryMock
            .Setup(repo => repo.GetPositionNameIdByName(updateDto.PositionName.Name))
            .ReturnsAsync(mockPositionNameId);
        _positionNameRepositoryMock
            .Setup(repo => repo.CreatePositionName(updateDto.PositionName.Name))
            .ReturnsAsync(Guid.NewGuid());

        request.Body = new MemoryStream(requestBytes);
        request.ContentType = "application/json";

        var result = await _updatePosition.Run(request, positionId.ToString());

        result.Should().BeOfType<NoContentResult>();
        existingPosition.PositionNameId.Should().NotBe(Guid.Empty);
    }
    */

    /*
    Note: PositionName-related tests are currently commented out due to a recent major logic change.
    Previously, PositionName was managed as an object within the Position entity.
    Now, it's been replaced with a PositionNameId reference, and PositionName management has been moved to its own separate CRUD operations.
    As a result, PositionNames can no longer be created or updated through the Position object.

    [Fact]
    public async Task CreatesPositionName_WhenPositionNameDoesNotExist()
    {
        var context = new DefaultHttpContext();
        var request = context.Request;

        var positionId = Guid.NewGuid();
        var mockPositionNameId = Guid.NewGuid();
        var existingPosition = new Position
        {
            Id = positionId,
            CreationDecisionNumber = "123",
            PositionNameId = mockPositionNameId,
            VacancySize = .50M,
            VacancyFill = .40M,
            SubjectIds = new List<Guid>() { Guid.NewGuid() },
        };
        var updateDto = new UpdatePositionDto { PositionName = new PositionNameDto { Name = "New Position Name" } };

        var requestJson = JsonSerializer.Serialize(updateDto);
        var requestBytes = Encoding.UTF8.GetBytes(requestJson);

        _positionRepositoryMock.Setup(repo => repo.GetPosition(positionId)).ReturnsAsync(existingPosition);
        _positionNameRepositoryMock
            .Setup(repo => repo.GetPositionNameIdByName(updateDto.PositionName.Name))
            .ReturnsAsync((Guid?)null);
        _positionNameRepositoryMock
            .Setup(repo => repo.CreatePositionName(updateDto.PositionName.Name))
            .ReturnsAsync(Guid.NewGuid());
        _subjectRepositoryMock
            .Setup(r => r.GetSubjectsByIds(It.IsAny<List<Guid>>()))
            .ReturnsAsync(
                new List<Subject>
                {
                    new Subject { Id = existingPosition.SubjectIds.First(), SubjectName = "TestSubject" },
                }
            );

        request.Body = new MemoryStream(requestBytes);
        request.ContentType = "application/json";

        var result = await _updatePosition.Run(request, positionId.ToString());

        _positionNameRepositoryMock.Verify(repo => repo.CreatePositionName(updateDto.PositionName.Name), Times.Once);

        result.Should().BeOfType<NoContentResult>();
    }
    */
}
