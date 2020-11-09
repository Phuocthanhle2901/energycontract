namespace Common
{
    public class QueryParams
    {
        public int Size { get; set; } = 10;
        public int Page { get; set; } = 1;
        public string OrderBy { get; set; } = "Id";
        public string SortBy { get; set; } = "DESC";
    }
}
