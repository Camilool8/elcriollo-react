namespace PDVreact.Models
{
    public class Cliente
    {
        public int Id { get; set; } // Se genera automáticamente a partir del número 1500X
        public string Nombre { get; set; }
        public string Direccion { get; set; } // En caso de ser recurrentes
        public string Telefono { get; set; }
    }
}
