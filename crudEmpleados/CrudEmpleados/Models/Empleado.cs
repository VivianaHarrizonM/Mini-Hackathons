using System.ComponentModel.DataAnnotations;

namespace CrudEmpleados.Models;

public class Empleado
{
    public int Id { get; set; }

    [Required(ErrorMessage = "El nombre es obligatorio")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Entre 2 y 100 caracteres")]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El correo es obligatorio")]
    [EmailAddress(ErrorMessage = "Correo no válido")]
    [StringLength(150)]
    public string Correo { get; set; } = string.Empty;

    [Required(ErrorMessage = "El puesto es obligatorio")]
    [StringLength(80)]
    public string Puesto { get; set; } = string.Empty;

    [Range(1, 10_000_000, ErrorMessage = "El salario debe ser mayor a 0")]
    public decimal Salario { get; set; }

    public DateOnly FechaIngreso { get; set; } = DateOnly.FromDateTime(DateTime.Today);
}
