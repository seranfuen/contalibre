using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ContaLibre.Models
{
    public class GrupoViewModel
    {
        public GrupoViewModel(IGrupoPgc grupo)
        {
            NumGrupo = grupo.NumGrupo;
            Nombre = grupo.Nombre;
            Descripcion = grupo.Descripcion;
        }

        public short NumGrupo { get; private set; }

        public string Nombre { get; private set; }

        public string Descripcion { get; private set; }

        public string NumGrupoNombre
        {
            get
            {
                return NumGrupo + " " + Nombre;
            }
        }
    }
}