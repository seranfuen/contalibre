using ContalibreWebApi.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ContalibreWebApi.Models.ViewModels
{
    public class ContabilidadViewModel
    {
        #region ' Ctor '

        public ContabilidadViewModel(Contabilidad contabilidad)
        {
            Id = contabilidad.Id;
            CompanyName = contabilidad.CompanyName;
            Year = contabilidad.Year;
            UserName = contabilidad.User != null ? contabilidad.User.UserName : null;
        }

        public ContabilidadViewModel()
        {

        }

        #endregion

        #region ' Properties '

        public int Id
        {
            get;
            set;
        }

        public string CompanyName
        {
            get;
            set;
        }

        public int Year
        {
            get;
            set;
        }

        public string UserName
        {
            get;
            set;
        }

        #endregion
    }
}