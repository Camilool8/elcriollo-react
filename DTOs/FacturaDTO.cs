namespace PDVreact.DTOs
{
    public class FacturaDTO
    {
        public int Id { get; set; }
        public int CuentaId { get; set; }
        public decimal Total { get; set; }
        public DateTime FechaHora { get; set; }
        public string Estado { get; set; }
    }
}
