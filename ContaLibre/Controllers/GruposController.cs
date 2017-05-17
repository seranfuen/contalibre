using ContaLibre.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ContaLibre.Controllers
{
    public class GruposController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Grupos
        public IEnumerable<GrupoViewModel> Get()
        {
            return db.Grupos.ToList().Select(grupo => new GrupoViewModel(grupo));
        }

        //// GET: api/Grupos/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST: api/Grupos
        //public void Post([FromBody]string value)
        //{
        //}

        //// PUT: api/Grupos/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE: api/Grupos/5
        //public void Delete(int id)
        //{
        //}
    }
}
