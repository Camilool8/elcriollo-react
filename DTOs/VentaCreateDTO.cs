    namespace PDVreact.DTOs
    {
        public class VentaCreateDTO
        {
            public string UsuarioId { get; set; }
            public int ClienteId { get; set; }
            public string Estado { get; set; }
            public int MesaId { get; set; }
            public string MetodoPago { get; set; }

            public DateTime Fecha { get; set; }
        }
    }
