namespace PDVreact.Models
{
    public class Cuenta
    {
        public int Id { get; set; }
        public int VentaId { get; set; }  // Agregado
        public Venta Venta { get; set; }
        public decimal Total { get; set; } // Calculado a partir del Producto y la Cantidad en DetalleVenta.
    }
}
