using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTech.Application.Interfaces
{
    public interface IHomeService
    {
        Task<object> GetHomePageDataAsync();
    }
}
