using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ContaLibre.Models
{
    public interface IGrupoPgc
    {
        short NumGrupo { get; set; }
        string Nombre { get; set; }
        string Descripcion { get; set; }
    }
}
