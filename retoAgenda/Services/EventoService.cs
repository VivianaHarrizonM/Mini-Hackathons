using System.Text.Json;
using Microsoft.JSInterop;
using retoAgenda.Models;

namespace retoAgenda.Services
{
    public class EventoService
    {
        private readonly IJSRuntime _js;
        private const string ClaveStorage = "retoAgenda_eventos";

        public List<Categoria> Categorias { get; private set; } = new();
        public List<Evento> Eventos { get; private set; } = new();
        public bool EstaInicializado { get; private set; }

        public event Action? OnCambio;

        public EventoService(IJSRuntime js)
        {
            _js = js;
            CargarCategorias();
        }

        private void CargarCategorias()
        {
            Categorias = new List<Categoria>
            {
                new Categoria { Id = 1, Nombre = "Trabajo", Color = "#EF4444" },
                new Categoria { Id = 2, Nombre = "Personal", Color = "#10B981" },
                new Categoria { Id = 3, Nombre = "Estudio", Color = "#F59E0B" },
                new Categoria { Id = 4, Nombre = "Salud", Color = " #3B82F6" },
            };
        }

        public async Task InicializarAsync()
        {
            if (EstaInicializado) return;

            var json = await _js.InvokeAsync<string?>("localStorage.getItem", ClaveStorage);

            if (!string.IsNullOrWhiteSpace(json))
            {
                try
                {
                    var guardados = JsonSerializer.Deserialize<List<Evento>>(json);
                    Eventos = guardados ?? new List<Evento>();
                }
                catch
                {
                    CargarDatosDeEjemplo();
                }
            }
            else
            {
                CargarDatosDeEjemplo();
                await GuardarAsync();
            }

            EstaInicializado = true;
        }

        private void CargarDatosDeEjemplo()
        {
            var hoy = DateTime.Today;

            Eventos = new List<Evento>
            {
                new Evento
                {
                    Id = 1, Titulo = "Reunión de equipo", Descripcion = "Sync semanal de avances",
                    Fecha = hoy, HoraInicio = new TimeSpan(9, 0, 0), HoraFin = new TimeSpan(10, 0, 0),
                    CategoriaId = 1, EsRecordatorio = true
                },
                new Evento
                {
                    Id = 2, Titulo = "Entrega de tarea", Descripcion = "Proyecto final de la materia",
                    Fecha = hoy.AddDays(2), HoraInicio = new TimeSpan(23, 0, 0), HoraFin = new TimeSpan(23, 59, 0),
                    CategoriaId = 3, EsRecordatorio = true
                },
                new Evento
                {
                    Id = 3, Titulo = "Consulta médica", Descripcion = "Chequeo general",
                    Fecha = hoy.AddDays(5), HoraInicio = new TimeSpan(16, 30, 0), HoraFin = new TimeSpan(17, 30, 0),
                    CategoriaId = 4, EsRecordatorio = false
                },
            };
        }

        public List<Evento> ObtenerPorFecha(DateTime fecha) =>
            Eventos.Where(e => e.Fecha.Date == fecha.Date).ToList();

        public List<Evento> ObtenerPorRango(DateTime inicio, DateTime fin) =>
            Eventos.Where(e => e.Fecha.Date >= inicio.Date && e.Fecha.Date <= fin.Date)
                   .OrderBy(e => e.Fecha).ThenBy(e => e.HoraInicio).ToList();

        public List<Evento> ObtenerRecordatorios()
        {
            var hoy = DateTime.Today;
            return Eventos.Where(e => e.EsRecordatorio && e.Fecha.Date >= hoy && e.Fecha.Date <= hoy.AddDays(3))
                          .OrderBy(e => e.Fecha).ToList();
        }

        public Categoria? ObtenerCategoria(int id) => Categorias.FirstOrDefault(c => c.Id == id);

        public async Task AgregarEventoAsync(Evento evento)
        {
            evento.Id = Eventos.Count > 0 ? Eventos.Max(e => e.Id) + 1 : 1;
            Eventos.Add(evento);
            await GuardarAsync();
            NotificarCambio();
        }

        public async Task ActualizarEventoAsync(Evento evento)
        {
            var existente = Eventos.FirstOrDefault(e => e.Id == evento.Id);
            if (existente is null) return;

            existente.Titulo = evento.Titulo;
            existente.Descripcion = evento.Descripcion;
            existente.Fecha = evento.Fecha;
            existente.HoraInicio = evento.HoraInicio;
            existente.HoraFin = evento.HoraFin;
            existente.CategoriaId = evento.CategoriaId;
            existente.EsRecordatorio = evento.EsRecordatorio;

            await GuardarAsync();
            NotificarCambio();
        }

        public async Task EliminarEventoAsync(int id)
        {
            var existente = Eventos.FirstOrDefault(e => e.Id == id);
            if (existente is null) return;

            Eventos.Remove(existente);
            await GuardarAsync();
            NotificarCambio();
        }

        private async Task GuardarAsync()
        {
            var json = JsonSerializer.Serialize(Eventos);
            await _js.InvokeVoidAsync("localStorage.setItem", ClaveStorage, json);
        }

        private void NotificarCambio() => OnCambio?.Invoke();
    }
}