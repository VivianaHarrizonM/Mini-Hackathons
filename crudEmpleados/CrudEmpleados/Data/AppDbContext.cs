using CrudEmpleados.Models;
using Microsoft.EntityFrameworkCore;

namespace CrudEmpleados.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Empleado> Empleados => Set<Empleado>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Empleado>(e =>
        {
            e.HasIndex(x => x.Correo).IsUnique();
            e.Property(x => x.Salario).HasPrecision(12, 2);
        });
    }
}
