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
using ContalibreWebApi.Models;
using ContalibreWebApi.Models.Entities;
using Microsoft.AspNet.Identity;
using ContalibreWebApi.Models.ViewModels;

namespace ContalibreWebApi.Controllers
{
    public class ContabilidadesController : ApiControllerBase
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Contabilidades
        public IQueryable<ContabilidadViewModel> GetContabilidads()
        {
            return db.Contabilidades.Select(cont => new ContabilidadViewModel(cont));
        }

        [Route("api/Contabilidades/User")]
        public IQueryable<ContabilidadViewModel> GetContabilidadesCurrentUser()
        {
            return db.Contabilidades.Where(contabilidad => contabilidad.User.Id == UserIdentityId).Select(cont => new ContabilidadViewModel()
            {
                CompanyName = cont.CompanyName,
                Id = cont.Id,
                Year = cont.Year,
                UserName = cont.User.UserName,
                UserId = cont.UserId
            });
        }

        // GET: api/Contabilidades/5
        [ResponseType(typeof(Contabilidad))]
        public IHttpActionResult GetContabilidad(int id)
        {
            Contabilidad contabilidad = db.Contabilidades.Find(id);
            if (contabilidad == null)
            {
                return NotFound();
            }

            return Ok(new ContabilidadViewModel(contabilidad));
        }

        // PUT: api/Contabilidades/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutContabilidad(int id, Contabilidad contabilidad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != contabilidad.Id)
            {
                return BadRequest();
            }

            db.Entry(contabilidad).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContabilidadExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Contabilidades
        [ResponseType(typeof(Contabilidad))]
        public IHttpActionResult PostContabilidad(Contabilidad contabilidad)
        {
            contabilidad.UserId = UserIdentityId;

            ModelState.Clear();
            Validate(contabilidad);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Contabilidades.Add(contabilidad);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = contabilidad.Id }, contabilidad);
        }

        // DELETE: api/Contabilidades/5
        [ResponseType(typeof(Contabilidad))]
        public IHttpActionResult DeleteContabilidad(int id)
        {
            Contabilidad contabilidad = db.Contabilidades.Find(id);
            if (contabilidad == null)
            {
                return NotFound();
            }

            db.Contabilidades.Remove(contabilidad);
            db.SaveChanges();

            return Ok(contabilidad);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ContabilidadExists(int id)
        {
            return db.Contabilidades.Count(e => e.Id == id) > 0;
        }
    }
}