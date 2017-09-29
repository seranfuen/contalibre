using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ContalibreWebApi.Models.Entities
{
    public class Contabilidad
    {
        #region ' Properties '

        [Key]
        [Required]
        public virtual int Id
        {
            get;
            set;
        }

        [Required]
        public virtual string CompanyName
        {
            get;
            set;
        }

        [Required]
        public virtual int Year
        {
            get;
            set;
        }

        [Required]
        public virtual ApplicationUser User
        {
            get;
            set;
        }

        #endregion
    }
}