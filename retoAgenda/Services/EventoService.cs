using retoAgenda.Models;

namespace retoAgenda.Services
{
    public class EventoService
    {
        public List<Categoria> Categorias { get; private set; } = new();
        public List<Evento> Eventos { get; private set; } = new();

        // Evento que los componentes pueden escuchar para redibujarse cuando algo cambia
        public event Action? OnCambio;

        public EventoService()
        {
            CargarDatosDeEjemplo();
        }

        private void CargarDatosDeEjemplo()
        {
            Categorias = new List<Categoria>
            {
                new Categoria { Id = 1, Nombre = "Trabajo", Color = "#3B82F6" },
                new Categoria { Id = 2, Nombre = "Personal", Color = "#10B981" },
                new Categoria { Id = 3, Nombre = "Estudio", Color = "#F59E0B" },
                new Categoria { Id = 4, Nombre = "Salud", Color = "#EF4444" },
            };

            var hoy = DateTime.Today;

            Eventos = new List<Evento>
            {
                new Evento
                {
                    Id = 1,
                    Titulo = "Reunión de equipo",
                    Descripcion = "Sync semanal de avances",
                    Fecha = hoy,
                    HoraInicio = new TimeSpan(9, 0, 0),
                    HoraFin = new TimeSpan(10, 0, 0),
                    CategoriaId = 1,
                    EsRecordatorio = true
                },
                new Evento
                {
                    Id = 2,
                    Titulo = "Entrega de tarea",
                    Descripcion = "Proyecto final de la materia",
                    Fecha = hoy.AddDays(2),
                    HoraInicio = new TimeSpan(23, 0, 0),
                    HoraFin = new TimeSpan(23, 59, 0),
                    CategoriaId = 3,
                    EsRecordatorio = true
                },
                new Evento
                {
                    Id = 3,
                    Titulo = "Consulta médica",
                    Descripcion = "Chequeo general",
                    Fecha = hoy.AddDays(5),
                    HoraInicio = new TimeSpan(16, 30, 0),
                    HoraFin = new TimeSpan(17, 30, 0),
                    CategoriaId = 4,
                    EsRecordatorio = false
                },
            };
        }

        public List<Evento> ObtenerPorFecha(DateTime fecha)
        {
            return Eventos.Where(e => e.Fecha.Date == fecha.Date).ToList();
        }

        public List<Evento> ObtenerPorRango(DateTime inicio, DateTime fin)
        {
            return Eventos
                .Where(e => e.Fecha.Date >= inicio.Date && e.Fecha.Date <= fin.Date)
                .OrderBy(e => e.Fecha)
                .ThenBy(e => e.HoraInicio)
                .ToList();
        }

        public List<Evento> ObtenerRecordatorios()
        {
            var hoy = DateTime.Today;
            return Eventos
                .Where(e => e.EsRecordatorio && e.Fecha.Date >= hoy && e.Fecha.Date <= hoy.AddDays(3))
                .OrderBy(e => e.Fecha)
                .ToList();
        }

        public Categoria? ObtenerCategoria(int id)
        {
            return Categorias.FirstOrDefault(c => c.Id == id);
        }

        public void AgregarEvento(Evento evento)
        {
            evento.Id = Eventos.Count > 0 ? Eventos.Max(e => e.Id) + 1 : 1;
            Eventos.Add(evento);
            NotificarCambio();
        }

        public void ActualizarEvento(Evento evento)
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

            NotificarCambio();
        }

        public void EliminarEvento(int id)
        {
            var existente = Eventos.FirstOrDefault(e => e.Id == id);
            if (existente is null) return;

            Eventos.Remove(existente);
            NotificarCambio();
        }

        private void NotificarCambio() => OnCambio?.Invoke();
    }
}