using PDVreact.Models;

public class Venta
{
    public int Id { get; set; }
    public Usuario Usuario { get; set; }  // Propiedad para la navegación
    public Cliente Cliente { get; set; }
    public List<DetalleVenta> DetalleVentas { get; set; }
    public List<Cuenta> Cuentas { get; set; }
    public string Estado { get; set; }
    public Mesa Mesa { get; set; }
    public string MetodoPago { get; set; }
    public DateTime Fecha { get; set; }
}

