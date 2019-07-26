using CRSReference;
using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Serialization;

namespace SendingRawSOAPRequest.Models
{
    [XmlRoot(ElementName = "TSearchOneResult",Namespace="")]
    class SearchOneResultDTO
    {
        [XmlAttribute]
        public string WFM_Ready { get; set; }
        public string WFM_Id { get; set; }
        public string Afmeldcode { get; set; }
        public string Monteur_Medewerker { get; set; }
        public string Oorzaak_Storing_Monteur { get; set; }
        public string WFM_Status { get; set; }
        public string Networktype { get; set; }
        public string Kastlocatietab { get; set; }
        public string kastlocatiecabinet { get; set; }
        public string Kastlocatiecoax { get; set; }
        public string kastlocatieglas_port { get; set; }
        public string Kastlocatieglas_switch { get; set; }
        public string Kastlocatieglas { get; set; }
        public string verzorgingsgebied { get; set; }
        public string comment { get; set; }
        public string Eigen_Input { get; set; }
        public string Naw_email { get; set; }
        public string Naw_mobiel { get; set; }
        public string Naw_telefoon { get; set; }
        public string Naw_woonplaats { get; set; }
        public string Naw_postcode { get; set; }
        public string Naw_Locatieomschrijving { get; set; }
        public string Naw_Toevoeging { get; set; }
        public string Naw_Huisnummer { get; set; }
        public string Naw_Straat { get; set; }
        public string Naw_adres { get; set; }
        public string Naw_naam { get; set; }
        public string Dagdeel_Afspraak { get; set; }
        [SoapElement(DataType = "date")]
        public DateTime Datum_Afspraak { get; set; }
        public string Ticket_Nummer { get; set; }
        public string Ticket_Onderwerp { get; set; }
        public TNotitie[] Notities { get; set; }
    }
}
