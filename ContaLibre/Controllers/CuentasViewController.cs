using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ContaLibre.Controllers
{
    public class CuentasViewController : Controller
    {
        public ActionResult New()
        {
            return View();
        }
    }
}