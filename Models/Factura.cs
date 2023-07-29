namespace PDVreact.Models
{
    public class Factura
    {
        public int Id { get; set; }
        public int CuentaId { get; set; }
        public Cuenta Cuenta { get; set; }
        public decimal Total { get; set; } // Calculado a partir de los DetalleVenta o Cuentas de la Venta
        public DateTime FechaHora { get; set; } // Fecha y hora en que se generó la factura
        public string Estado { get; set; } // Puede ser 'Pagada' o 'No pagada'
    }
}
