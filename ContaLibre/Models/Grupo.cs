using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ContaLibre.Models
{
    /// <summary>
    /// Representa uno de los 9 grupos del PGC
    /// </summary>
    public class Grupo
    {
        [Required]
        [Key]
        public short NumGrupo { get; set; }

        [Required]
        [MaxLength(255)]
        public string Nombre { get; set; }

        [MaxLength(2000)]
        public string Descripcion { get; set; }

        public virtual ICollection<SubgrupoN2> SubgruposN2 { get; set; }
    }
}