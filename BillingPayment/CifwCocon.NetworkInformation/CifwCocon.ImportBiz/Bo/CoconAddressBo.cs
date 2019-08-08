
namespace CifwCocon.ImportBiz.Bo
{
    public class CoconAddressBo : ReadOnlyBo
    {
        private string _zipCode;

        public string Zipcode
        {
            get => _zipCode;
            set
            {
                if (!string.IsNullOrEmpty(value))
                {
                    _zipCode = value.Replace(" ", "");
                }
            }
        }

        public int HouseNumber
        {
            get
            {
                var result = 0;
                if (!string.IsNullOrEmpty(AddressConnection))
                {
                    var address = AddressConnection.Split('_');
                    if (address.Length > 1)
                    {
                        var houseNumber = address[1];
                        int.TryParse(houseNumber, out result);
                    }
                    
                }
                return result;
            }
        }

        public string Room
        {
            get
            {
                string result = null;
                if (!string.IsNullOrEmpty(AddressConnection))
                {
                    var address = AddressConnection.Split('_');
                    if (address.Length > 3)
                    {
                        result = address[3];
                        if (string.IsNullOrWhiteSpace(result))
                        {
                            result = null;
                        }
                    }

                }
                return result;
            }
        }

        public string HousenumberExt {
            get
            {
                var result = string.Empty;
                if (!string.IsNullOrEmpty(AddressConnection))
                {
                    var address = AddressConnection.Split('_');
                    if (address.Length > 2)
                    {
                        if (string.IsNullOrWhiteSpace(address[2]))
                        {
                            return null;
                        }
                        result = address[2];
                    }
                }
                return result;
            }
        }
        public string FixedChangeStatus { get; set; }
        public string AddressConnection { get; set; }
        public int? RelationId { get; set; }
        public string NameOfRelation { get; set; }
        public string Article { get; set; }
        public byte? StatusOfPayment { get; set; }
        public bool RemovedFromEol { get; set; }
        public bool ProvidedFromEol { get; set; }

        public bool IsAddressValid
        {
            get
            {
                var result = true;
                if (string.IsNullOrEmpty(AddressConnection))
                {
                    result = false;
                }
                else if (AddressConnection.Split('_').Length != 4)
                {
                    result = false;
                }
                return result;
            }
        }
    }
}
