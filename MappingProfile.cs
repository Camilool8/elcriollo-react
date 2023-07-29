using AutoMapper;
using PDVreact.DTOs;
using PDVreact.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Usuario Mapping
        CreateMap<Usuario, UsuarioDTO>();
        CreateMap<UsuarioCreateDTO, Usuario>();

        // Cliente Mapping
        CreateMap<Cliente, ClienteDTO>();
        CreateMap<ClienteDTO, Cliente>();

        // Mesa Mapping
        CreateMap<Mesa, MesaDTO>();
        CreateMap<MesaDTO, Mesa>();

        // Producto Mapping
        CreateMap<Producto, ProductoDTO>();
        CreateMap<ProductoDTO, Producto>();

        // Categoria Mapping
        CreateMap<Categoria, CategoriaDTO>();
        CreateMap<CategoriaDTO, Categoria>();

        // Inventario Mapping
        CreateMap<Inventario, InventarioDTO>();
        CreateMap<InventarioDTO, Inventario>();

        // Venta Mapping
        CreateMap<Venta, VentaDTO>()
            .ForMember(dest => dest.UsuarioId, opt => opt.MapFrom(src => src.Usuario.Id))
            .ForMember(dest => dest.ClienteId, opt => opt.MapFrom(src => src.Cliente.Id))
            .ForMember(dest => dest.MesaId, opt => opt.MapFrom(src => src.Mesa.Id))
            .ForMember(dest => dest.Cliente, opt => opt.MapFrom(src => src.Cliente)); 
        CreateMap<VentaCreateDTO, Venta>();
        CreateMap<VentaUpdateDTO, Venta>();

        // DetalleVenta Mapping
        CreateMap<DetalleVenta, DetalleVentaDTO>()
            .ForMember(dest => dest.ProductoId, opt => opt.MapFrom(src => src.Producto.Id))
            .ForMember(dest => dest.VentaId, opt => opt.MapFrom(src => src.Venta.Id))
            .ForMember(dest => dest.Producto, opt => opt.MapFrom(src => src.Producto)); // New mapping for the complete product information
        CreateMap<DetalleVentaCreateDTO, DetalleVenta>();

        // Cuenta Mapping
        CreateMap<Cuenta, CuentaDTO>()
            .ForMember(dest => dest.VentaId, opt => opt.MapFrom(src => src.Venta.Id));
        CreateMap<CuentaDTO, Cuenta>();

        // Factura Mapping
        CreateMap<Factura, FacturaDTO>();
        CreateMap<FacturaDTO, Factura>();
    }
}
