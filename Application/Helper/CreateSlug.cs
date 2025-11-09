using System.Text.RegularExpressions;

namespace DTech.Application.Helper
{
    public class CreateSlug
    {
        private static readonly Regex SlugPattern = new(@"[\s/,.:;]+", RegexOptions.Compiled);

        public static string GenerateSlug(string phrase)
        {
            return SlugPattern.Replace(phrase.ToLower(), "-");
        }
    }
}
