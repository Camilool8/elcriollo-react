using PDVreact.DTOs;

public class DetalleVentaDTO
{
    public int Id { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public int VentaId { get; set; }
    public ProductoDTO Producto { get; set; }
    public int? CuentaId { get; set; } 
}

