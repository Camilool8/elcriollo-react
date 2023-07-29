CREATE DATABASE PDV;
DROP DATABASE PDV;
USE PDV;
USE [master];

IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [Nombre] nvarchar(max) NOT NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Categorias] (
    [Id] int NOT NULL IDENTITY,
    [Nombre] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Categorias] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Clientes] (
    [Id] int NOT NULL IDENTITY,
    [Nombre] nvarchar(max) NOT NULL,
    [Direccion] nvarchar(max) NOT NULL,
    [Telefono] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Clientes] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Mesas] (
    [Id] int NOT NULL IDENTITY,
    [Estado] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Mesas] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    [UsuarioId] nvarchar(450) NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UsuarioId] FOREIGN KEY ([UsuarioId]) REFERENCES [AspNetUsers] ([Id])
);
GO

CREATE TABLE [AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Productos] (
    [Id] int NOT NULL IDENTITY,
    [Codigo] nvarchar(max) NOT NULL,
    [Nombre] nvarchar(max) NOT NULL,
    [Precio] decimal(18,2) NOT NULL,
    [CategoriaId] int NOT NULL,
    CONSTRAINT [PK_Productos] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Productos_Categorias_CategoriaId] FOREIGN KEY ([CategoriaId]) REFERENCES [Categorias] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Ventas] (
    [Id] int NOT NULL IDENTITY,
    [UsuarioId] nvarchar(450) NOT NULL,
    [ClienteId] int NOT NULL,
    [Estado] nvarchar(max) NOT NULL,
    [MesaId] int NOT NULL,
    [MetodoPago] nvarchar(max) NOT NULL,
    [Fecha] datetime2 NOT NULL,
    CONSTRAINT [PK_Ventas] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Ventas_AspNetUsers_UsuarioId] FOREIGN KEY ([UsuarioId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Ventas_Clientes_ClienteId] FOREIGN KEY ([ClienteId]) REFERENCES [Clientes] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Ventas_Mesas_MesaId] FOREIGN KEY ([MesaId]) REFERENCES [Mesas] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Inventarios] (
    [Id] int NOT NULL IDENTITY,
    [ProductoId] int NOT NULL,
    [Cantidad] int NOT NULL,
    CONSTRAINT [PK_Inventarios] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Inventarios_Productos_ProductoId] FOREIGN KEY ([ProductoId]) REFERENCES [Productos] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Cuentas] (
    [Id] int NOT NULL IDENTITY,
    [VentaId] int NOT NULL,
    [Total] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_Cuentas] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Cuentas_Ventas_VentaId] FOREIGN KEY ([VentaId]) REFERENCES [Ventas] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Detalle] (
    [Id] int NOT NULL IDENTITY,
    [ProductoId] int NOT NULL,
    [Cantidad] int NOT NULL,
    [VentaId] int NOT NULL,
    CONSTRAINT [PK_Detalle] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Detalle_Productos_ProductoId] FOREIGN KEY ([ProductoId]) REFERENCES [Productos] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Detalle_Ventas_VentaId] FOREIGN KEY ([VentaId]) REFERENCES [Ventas] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Facturas] (
    [Id] int NOT NULL IDENTITY,
    [CuentaId] int NOT NULL,
    [Total] decimal(18,2) NOT NULL,
    [FechaHora] datetime2 NOT NULL,
    [Estado] nvarchar(max) NOT NULL,
    [MesaId] int NULL,
    CONSTRAINT [PK_Facturas] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Facturas_Cuentas_CuentaId] FOREIGN KEY ([CuentaId]) REFERENCES [Cuentas] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Facturas_Mesas_MesaId] FOREIGN KEY ([MesaId]) REFERENCES [Mesas] ([Id])
);
GO

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
GO

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;
GO

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
GO

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
GO

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
GO

CREATE INDEX [IX_AspNetUserRoles_UsuarioId] ON [AspNetUserRoles] ([UsuarioId]);
GO

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
GO

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;
GO

CREATE INDEX [IX_Cuentas_VentaId] ON [Cuentas] ([VentaId]);
GO

CREATE INDEX [IX_Detalle_ProductoId] ON [Detalle] ([ProductoId]);
GO

CREATE INDEX [IX_Detalle_VentaId] ON [Detalle] ([VentaId]);
GO

CREATE INDEX [IX_Facturas_CuentaId] ON [Facturas] ([CuentaId]);
GO

CREATE INDEX [IX_Facturas_MesaId] ON [Facturas] ([MesaId]);
GO

CREATE INDEX [IX_Inventarios_ProductoId] ON [Inventarios] ([ProductoId]);
GO

CREATE INDEX [IX_Productos_CategoriaId] ON [Productos] ([CategoriaId]);
GO

CREATE INDEX [IX_Ventas_ClienteId] ON [Ventas] ([ClienteId]);
GO

CREATE INDEX [IX_Ventas_MesaId] ON [Ventas] ([MesaId]);
GO

CREATE INDEX [IX_Ventas_UsuarioId] ON [Ventas] ([UsuarioId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20230726145056_initial', N'7.0.9');
GO

COMMIT;
GO




-- Insertar Categorias
INSERT INTO Categorias (Nombre) VALUES ('Sopas y Caldos');
INSERT INTO Categorias (Nombre) VALUES ('Carnes');
INSERT INTO Categorias (Nombre) VALUES ('Pescados y Mariscos');
INSERT INTO Categorias (Nombre) VALUES ('Pollo');
INSERT INTO Categorias (Nombre) VALUES ('Vegetarianos');
INSERT INTO Categorias (Nombre) VALUES ('Arroces');
INSERT INTO Categorias (Nombre) VALUES ('Ensaladas');
INSERT INTO Categorias (Nombre) VALUES ('Platos Regionales');
INSERT INTO Categorias (Nombre) VALUES ('Postres');
INSERT INTO Categorias (Nombre) VALUES ('Bebidas');
INSERT INTO Categorias (Nombre) VALUES ('Comida Rápida');
INSERT INTO Categorias (Nombre) VALUES ('Especiales del Día');
INSERT INTO Categorias (Nombre) VALUES ('Menú Infantil');



-- Insert Clientes
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Juan Perez', 'Calle Principal 123', '8095643321');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Maria Santos', 'Avenida Los Jardines 456', '8497896321');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Carlos Gomez', 'Boulevard de las Flores 789', '8294567890');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Ana Rodriguez', 'Calle Del Sol 321', '8093214567');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Pedro Martinez', 'Avenida Los Pinos 654', '8496541230');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Luisa Hernandez', 'Calle Palma Real 987', '8297890123');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Roberto Diaz', 'Avenida Del Mar 345', '8095678901');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Carmen Morales', 'Boulevard de los Heroes 678', '8493210987');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Miguel Guzman', 'Calle El Parque 234', '8295671234');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Carla Mendoza', 'Avenida Las Perlas 876', '8090987654');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Josefina Marte', 'Calle Luna 127', '8097539516');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Rafael Pujols', 'Avenida Estrellas 395', '8496123785');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Federico Batista', 'Boulevard Arcoiris 738', '8297946120');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Rosa Jimenez', 'Calle El Viento 421', '8092378569');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Oscar Nuñez', 'Avenida Las Palmeras 685', '8496432108');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Cecilia Bautista', 'Calle Sol Naciente 932', '8297109825');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Hector Ventura', 'Avenida Del Ocaso 533', '8099867412');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Liliana Duran', 'Boulevard de los Alamos 624', '8492987653');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Rodrigo Cordero', 'Calle Del Bosque 212', '8295678931');
INSERT INTO Clientes (Nombre, Direccion, Telefono) VALUES ('Mercedes Castillo', 'Avenida Las Orquideas 768', '8090987654');



-- Insertar Mesas
INSERT INTO Mesas (Estado) VALUES ('Libre');
INSERT INTO Mesas (Estado) VALUES ('Libre');
INSERT INTO Mesas (Estado) VALUES ('Libre');
INSERT INTO Mesas (Estado) VALUES ('Libre');
INSERT INTO Mesas (Estado) VALUES ('Reservada');
INSERT INTO Mesas (Estado) VALUES ('Libre');
INSERT INTO Mesas (Estado) VALUES ('Libre');
INSERT INTO Mesas (Estado) VALUES ('Reservada');
INSERT INTO Mesas (Estado) VALUES ('Reservada');


-- Sopas y Caldos
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('S01', 'Sopa de pollo', 150.00, 1);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('S02', 'Sopa de res', 180.00, 1);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('S03', 'Sancocho', 200.00, 1);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('S04', 'Asopao de camarones', 250.00, 1);

-- Carnes
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('C01', 'Churrasco', 500.00, 2);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('C02', 'Chuleta ahumada', 350.00, 2);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('C03', 'Rabo encendido', 450.00, 2);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('C04', 'Bistec encebollado', 400.00, 2);

-- Pescados y Mariscos
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('P01', 'Pescado frito', 400.00, 3);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('P02', 'Camarones al ajillo', 550.00, 3);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('P03', 'Langosta a la criolla', 1200.00, 3);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('P04', 'Ceviche de pulpo', 600.00, 3);

-- Pollo
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('PL01', 'Pollo guisado', 250.00, 4);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('PL02', 'Pechuga a la plancha', 300.00, 4);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('PL03', 'Pollo frito', 275.00, 4);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('PL04', 'Pollo al horno', 325.00, 4);

-- Vegetarianos
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('V01', 'Ensalada mixta', 150.00, 5);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('V02', 'Vegetales al wok', 200.00, 5);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('V03', 'Tofu a la criolla', 300.00, 5);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('V04', 'Pasta vegetariana', 275.00, 5);

-- Arroces
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('A01', 'Arroz con pollo', 250.00, 6);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('A02', 'Locrio de chicharrón', 300.00, 6);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('A03', 'Moro de habichuelas', 200.00, 6);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('A04', 'Paella criolla', 800.00, 6);

-- Ensaladas
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('E01', 'Ensalada César', 200.00, 7);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('E02', 'Ensalada de remolacha', 150.00, 7);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('E03', 'Ensalada griega', 250.00, 7);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('E04', 'Ensalada caprese', 275.00, 7);

-- Platos Regionales
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('PR01', 'Mofongo con camarones', 600.00, 8);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('PR02', 'La Bandera (Carne, Arroz y Habichuelas)', 350.00, 8);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('PR03', 'Tostones con salami', 300.00, 8);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('PR04', 'Chimichurri', 250.00, 8);

-- Postres
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('PO01', 'Flan de coco', 150.00, 9);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('PO02', 'Tres leches', 200.00, 9);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('PO03', 'Helado de vainilla', 100.00, 9);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('PO04', 'Bizcocho Dominicano', 250.00, 9);

-- Bebidas
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('B01', 'Presidente (cerveza)', 100.00, 10);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('B02', 'Jugo de chinola', 80.00, 10);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('B03', 'Café dominicano', 50.00, 10);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('B04', 'Mamajuana', 150.00, 10);

-- Comida Rápida
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('CR01', 'Hamburguesa El Criollo', 350.00, 11);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('CR02', 'Hot dog dominicano', 250.00, 11);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('CR03', 'Pizza de peperoni', 600.00, 11);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('CR04', 'Sandwich Club', 300.00, 11);

-- Especiales del Día
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('ED01', 'Lunes - Pollo BBQ', 300.00, 12);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('ED02', 'Martes - Pasta marinera', 450.00, 12);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('ED03', 'Miércoles - Pescado al coco', 500.00, 12);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('ED04', 'Jueves - Chivo guisado', 550.00, 12);

-- Menú Infantil
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('MI01', 'Nuggets de pollo', 200.00, 13);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('MI02', 'Mini pizza', 250.00, 13);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('MI03', 'Espaguetis con albóndigas', 300.00, 13);
INSERT INTO Productos (Codigo, Nombre, Precio, CategoriaId) VALUES ('MI04', 'Hot dog pequeño', 200.00, 13);




-- Generamos el inventario para cada producto de la tabla Productos
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (1, 100);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (2, 80);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (3, 90);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (4, 110);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (5, 85);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (6, 95);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (7, 120);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (8, 105);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (9, 70);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (10, 80);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (11, 90);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (12, 85);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (13, 100);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (14, 120);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (15, 110);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (16, 115);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (17, 105);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (18, 120);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (19, 90);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (20, 80);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (21, 70);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (22, 110);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (23, 100);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (24, 95);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (25, 85);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (26, 90);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (27, 100);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (28, 120);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (29, 110);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (30, 115);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (31, 105);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (32, 120);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (33, 90);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (34, 80);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (35, 70);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (36, 110);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (37, 100);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (38, 95);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (39, 85);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (40, 90);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (41, 100);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (42, 120);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (43, 110);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (44, 115);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (45, 105);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (46, 120);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (47, 90);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (48, 80);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (49, 70);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (50, 110);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (51, 100);
INSERT INTO Inventarios (ProductoId, Cantidad) VALUES (52, 95);
