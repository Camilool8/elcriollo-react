using PDVreact.Models;

namespace PDVreact.DTOs
{
    // DTOs/MesaDTO.cs
    public class MesaDTO
    {
        public int Id { get; set; }
        public string Estado { get; set; }
        public List<VentaDTO> Ventas { get; set; }
    }

}
