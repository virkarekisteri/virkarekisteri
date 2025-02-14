using Microsoft.EntityFrameworkCore;
using Virkarekisteri.Models;

namespace Virkarekisteri.Repositories;

public interface ISubjectRepository
{
    Task<List<Subject>> GetSubjects();
    Task<Subject?> GetSubject(Guid id);
    Task<Subject> CreateSubject(Subject subject);
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

    public async Task<Subject> CreateSubject(Subject subject)
    {
        db.Subjects.Add(subject);
        await db.SaveChangesAsync();
        return subject;
    }

    public async Task UpdateSubject(Subject existingSubject)
    {
        db.Subjects.Update(existingSubject);
        await db.SaveChangesAsync();
    }
}
