# build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj trước để cache restore
COPY src/ContractHistoryService/Api/Api.csproj src/ContractHistoryService/Api/
RUN dotnet restore src/ContractHistoryService/Api/Api.csproj

# copy toàn bộ source
COPY . .

RUN dotnet publish src/ContractHistoryService/Api/Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Api.dll"]
