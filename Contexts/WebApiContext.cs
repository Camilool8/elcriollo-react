using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PDVreact.Models;

public class WebApiContext : IdentityDbContext<Usuario, IdentityRole, string>
{
    public WebApiContext(DbContextOptions<WebApiContext> options)
        : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Producto> Productos { get; set; }
    public DbSet<Mesa> Mesas { get; set; }
    public DbSet<Venta> Ventas { get; set; }
    public DbSet<DetalleVenta> Detalle { get; set; }
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Inventario> Inventarios { get; set; }
    public DbSet<Factura> Facturas { get; set; }
    public DbSet<Cuenta> Cuentas { get; set;}



}
