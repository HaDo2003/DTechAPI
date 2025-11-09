namespace DTech.Application.Helper
{
    public class CreateSlug
    {
        public static string GenerateSlug(string phrase)
        {
            string str = phrase.ToLower().Replace(" ", "-").Replace("/", "-").Replace(", ", "-").Replace(". ", "-");
            return str;
        }
    }
}
