// Models/Usuario.cs
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace PDVreact.Models
{
    public class Usuario : IdentityUser
    {
        public string Nombre { get; set; }
        public ICollection<IdentityUserRole<string>> UserRoles { get; set; } // Para relacionar con los roles de Identity
        public ICollection<Venta> Ventas { get; set; } // Para relacionar con las ventas realizadas por el usuario
    }
}
