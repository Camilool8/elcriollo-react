// DTOs/UsuarioDTO.cs
using System.Text.Json.Serialization;

namespace PDVreact.DTOs
{
    public class UsuarioDTO
    {
        public string Id { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Rol { get; set; } // Ahora es una cadena
        [JsonIgnore]
        public string Contraseña { get; set; }
    }
}
