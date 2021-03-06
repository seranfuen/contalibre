﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ContaLibre.Models
{
    public class Cuenta
    {
        /// <summary>
        /// Clave de una cuenta. A diferencia de grupos y subgrupos que son únicos y por defecto,
        /// la cuenta está asociada a usuarios y un usuario puede tener dos cuentas con mismo código de diferente nombre
        /// </summary>
        [Required]
        [Key]
        public short Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Nombre { get; set; }

        /// <summary>
        /// Código de la cuenta
        /// </summary>
        [Required]
        public short Codigo { get; set; }

        [MaxLength(2000)]
        public string Descripcion
        {
            get; set;
        }

        [Required]
        [JsonIgnore]
        public virtual SubgrupoN3 SubgrupoN3
        {
            get;
            set;
        }

        /// <summary>
        /// Las cuentas que no tengan usuario asociado son cuentas por defecto que aparecen en el PGC y que se copiarán
        /// a cada usuario al crear una cuenta
        /// </summary>
        public virtual ApplicationUser User
        {
            get;
            set;
        }

        public bool IsUserAccount
        {
            get { return User != null; }
        }
    }
}