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
            return db.Grupos.ToList();
        }
    }
}