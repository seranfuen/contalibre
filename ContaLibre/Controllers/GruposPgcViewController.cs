using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ContaLibre.Controllers
{
    [AllowAnonymous]
    public class GruposPgcViewController : Controller
    {
        // GET: GruposPgcView
        public ActionResult Index()
        {
            return View();
        }
    }
}