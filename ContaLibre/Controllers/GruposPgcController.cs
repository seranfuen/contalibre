using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using ContaLibre.Models;

namespace ContaLibre.Controllers
{
    public class GruposPgcController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/GruposPgc
        public IEnumerable<Grupo> GetGrupos()
        {
            var grupos = db.Grupos.ToList();
            foreach (var grupo in grupos)
            {
                foreach (var subgrupo2 in grupo.SubgruposN2)
                {
                    foreach (var subgrupo3 in subgrupo2.SubgruposN3)
                    {
                        subgrupo3.Cuentas = db.Cuentas.Where(cuenta => cuenta.SubgrupoN3.NumGrupo == subgrupo3.NumGrupo).ToList();
                    }
                }
            }
            return grupos;
        }
    }
}