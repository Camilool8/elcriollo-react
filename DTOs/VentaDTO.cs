using System;

namespace PDVreact.DTOs
{
    public class VentaDTO
    {
        public int Id { get; set; }
        public string UsuarioId { get; set; }
        public int ClienteId { get; set; }
        public ClienteDTO Cliente { get; set; }  
        public List<DetalleVentaDTO> DetalleVentas { get; set; }
        public List<CuentaDTO> Cuentas { get; set; }
        public string Estado { get; set; }
        public int MesaId { get; set; }
        public string MetodoPago { get; set; }
        public DateTime Fecha { get; set; }
        public float Total { get; set; }
    }
}
