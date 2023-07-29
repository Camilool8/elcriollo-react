namespace PDVreact.Models
{
    public class Categoria
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public List<Producto> Productos { get; set; } // Los productos que pertenecen a esta categoría
    }
}
