using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface ISubjectRepository
{
    Task<List<Subject>> GetSubjects();
    Task<Subject?> GetSubject(Guid id);
    Task<(bool Exists, Subject? Subject)> CreateSubject(Subject subject);
    Task UpdateSubject(Subject existingSubject);
}

public class SubjectRepository(VirkarekisteriDb db) : ISubjectRepository
{
    public async Task<List<Subject>> GetSubjects()
    {
        return await db.Subjects.ToListAsync();
    }

    public async Task<Subject?> GetSubject(Guid id)
    {
        return await db.Subjects.FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<(bool Exists, Subject? Subject)> CreateSubject(Subject subject)
    {
        // Check if a subject with the same name exists
        var existingSubject = await db.Subjects.FirstOrDefaultAsync(s => s.SubjectName == subject.SubjectName);

        if (existingSubject != null)
        {
            return (true, existingSubject); // Return that it already exists
        }

        // Add the new subject if it does not exist
        db.Subjects.Add(subject);
        await db.SaveChangesAsync();
        return (false, subject);
    }

    public async Task UpdateSubject(Subject existingSubject)
    {
        db.Subjects.Update(existingSubject);
        await db.SaveChangesAsync();
    }
}
