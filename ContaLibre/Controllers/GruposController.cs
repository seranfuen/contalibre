using ContaLibre.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ContaLibre.Controllers
{
    [RoutePrefix("api/grupos")]
    public class GruposController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Grupos
        public IEnumerable<GrupoViewModel> Get()
        {
            return db.Grupos.ToList().Select(grupo => new GrupoViewModel(grupo));
        }

        // GET: api/Grupos/getSubgrupo2/numGrupo
        [Route("getSubgrupo2/{numGrupo}")]
        public IEnumerable<GrupoViewModel> GetSubgrupo2(int numGrupo)
        {
            return db.SubgruposN2.Where(grupo => grupo.Grupo.NumGrupo == numGrupo).ToList().Select(grupo => new GrupoViewModel(grupo));
        }

        [Route("getSubgrupo3/{numGrupo2}")]
        public IEnumerable<GrupoViewModel> GetSubgrupo3(int numGrupo2)
        {
            return db.SubgruposN3.Where(grupo => grupo.SubgrupoN2.NumGrupo == numGrupo2).ToList().Select(grupo => new GrupoViewModel(grupo));
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
