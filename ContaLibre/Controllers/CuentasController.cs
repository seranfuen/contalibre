using ContaLibre.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ContaLibre.Controllers
{
    public class CuentasController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Cuentas/id
        public Cuenta GetCuenta(short id)
        {
            // TODO: Mover a una capa intermedia que gestione validaciones, etc
            return db.Cuentas.SingleOrDefault(cuenta => cuenta.Id == id);
        }

        [Route("Api/cuentasUsuario/{userId}")]
        public IEnumerable<Cuenta> GetCuenta(string userId = null)
        {
            // TODO: Mover a una capa intermedia que gestione validaciones, etc
            return db.Cuentas.Where(cuenta => userId == null && cuenta.User == null || cuenta.User.Id == userId);
        }

        public void PutCuenta(Cuenta cuenta)
        {
            // TODO: Mover a una capa intermedia que gestione validaciones, etc
            db.Cuentas.Add(cuenta);
            db.SaveChanges();
        }
    }
}
