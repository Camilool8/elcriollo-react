namespace PDVreact.DTOs
{
    public class DetalleVentaUpdateDTO
    {
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public int VentaId { get; set; }
        public int? CuentaId { get; set; }  
    }

}
