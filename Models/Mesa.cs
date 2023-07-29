namespace PDVreact.Models
{
    public class Mesa
    {
        public int Id { get; set; }
        public string Estado { get; set; }
        public List<Venta> Ventas { get; set; }
        public List<Factura> Facturas { get; set; } // Las facturas generadas para esta mesa
    }
}
