// DTOs/ProductoDTO.cs
using System.ComponentModel.DataAnnotations;

namespace PDVreact.DTOs
{
    public class ProductoDTO
    {
        public int Id { get; set; }
        [Required]
        public string Codigo { get; set; }
        [Required]
        public string Nombre { get; set; }
        public decimal Precio { get; set; }
        public int CategoriaId { get; set; }
    }
}
