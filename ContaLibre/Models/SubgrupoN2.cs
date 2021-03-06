﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ContaLibre.Models
{
    /// <summary>
    /// Subgrupo de nivel 2 en el PGC (2 dígitos)
    /// </summary>
    public class SubgrupoN2 : IGrupoPgc
    {
        /// <summary>
        /// Clave del subgrupo de nivel 2 (debe tener 2 dígitos)
        /// </summary>
        [Required]
        [Key]
        public short NumGrupo { get; set; }

        [Required]
        [MaxLength(255)]
        public string Nombre { get; set; }

        [MaxLength(2000)]
        public string Descripcion
        {
            get; set;
        }

        [Required]
        [JsonIgnore]
        public virtual Grupo Grupo { get; set; }

        public virtual ICollection<SubgrupoN3> SubgruposN3 { get; set; }

        public override string ToString()
        {
            return string.Format("Subgrupo de Nivel 2 {0}: {1}", NumGrupo, Nombre);
        }
    }
}