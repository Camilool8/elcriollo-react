# The 'base' stage installs .NET runtime dependencies.
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# The 'build' stage installs .NET and Node.js build dependencies, and builds the app.
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["PDVreact.csproj", "."]
RUN dotnet restore "./PDVreact.csproj"
COPY . .

# Add Node.js for the build stage as well.
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs

WORKDIR "/src/."
RUN dotnet build "PDVreact.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PDVreact.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PDVreact.dll"]
