using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ContaLibre.Models
{
    /// <summary>
    /// Subgrupo de nivel 3 de cuentas (3 dígitos)
    /// </summary>
    public class SubgrupoN3 : IGrupoPgc
    {
        /// <summary>
        /// Clave del subgrupo de nivel 3. Debe tener tres dígitos
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
        public virtual SubgrupoN2 SubgrupoN2 { get; set; }

        [NotMapped]
        public virtual ICollection<Cuenta> Cuentas { get; set; }

        public override string ToString()
        {
            return string.Format("Subgrupo de Nivel 3 {0}: {1}", NumGrupo, Nombre);
        }
    }
}