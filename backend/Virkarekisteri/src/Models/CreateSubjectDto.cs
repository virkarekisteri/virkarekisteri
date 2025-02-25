namespace Virkarekisteri.src.Models;

public class CreateSubjectDto
{
    public required string SubjectName { get; set; }
    public bool Active { get; set; }
}
