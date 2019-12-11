namespace DomainModel.Routing
{
    public class RoutingModel
    {
        public int AreaId { get; set; }
        public string Huurder { get; set; }
        public string Beheerder { get; set; }
        public string HuurderName => Huurder?.Split('|')?[0]?.Trim();
        public string HuurderSystemName => Huurder?.Split('|')?[1]?.Trim();

        public string BeheerderName => Beheerder?.Split('|')?[0]?.Trim();
        public string BeheerderSystemName => Beheerder?.Split('|')?[1]?.Trim();
    }
}
