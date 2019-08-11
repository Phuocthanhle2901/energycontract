FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY ["Wms.Admin.Api/Wms.Admin.Api.csproj", "Wms.Admin.Api/"]
COPY ["Wms.Admin.Api/Nuget.config", "Wms.Admin.Api/"]
COPY ["Service/Service.csproj", "Service/"]
COPY ["DomainModel/DomainModel.csproj", "DomainModel/"]
COPY ["Common/Common.csproj", "Common/"]
COPY ["Entities/Entities.csproj", "Entities/"]
RUN dotnet restore "Wms.Admin.Api/Wms.Admin.Api.csproj" --configfile Wms.Admin.Api/Nuget.config -nowarn:msb3202,nu1503 --verbosity diag
COPY . .
WORKDIR "/src/Wms.Admin.Api"
RUN dotnet build "Wms.Admin.Api.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "Wms.Admin.Api.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Wms.Admin.Api.dll"]