FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/CustomerService/Api/Api.csproj", "src/CustomerService/Api/"]
COPY ["src/CustomerService/Application/Application.csproj", "src/CustomerService/Application/"]
COPY ["src/CustomerService/Domain/Domain.csproj", "src/CustomerService/Domain/"]
COPY ["src/CustomerService/Infrastructure/Infrastructure.csproj", "src/CustomerService/Infrastructure/"]
RUN dotnet restore "src/CustomerService/Api/Api.csproj"
COPY . .
WORKDIR "/src/src/CustomerService/Api"
RUN dotnet build "./Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Api.dll"]
