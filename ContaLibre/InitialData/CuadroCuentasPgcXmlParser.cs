using ContaLibre.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Xml;

namespace ContaLibre.InitialData
{
    public class CuadroCuentasPgcXmlParser
    {
        #region ' Constantes '

        private const string GRUPO_TAG = "grupo";
        private const string SUBGRUPO_TAG = "subgrupo2";
        private const string SUBGRUPO2_TAG = "subgrupo3";
        private const string CUENTA_TAG = "cuenta";

        private const string NOMBRE_TAG = "nombre";
        private const string DESCRIPCION_TAG = "descripcion";

        private const string GRUPOS_NUM_ATTR = "num";
        private const string CUENTA_ID_ATTR = "codigo";

        #endregion

        private List<Cuenta> _listaCuentas;
        private List<Grupo> _cuadroPgc;

        public void ParseCuadroCuentasPgc()
        {
            var stream = GetCuadroCuentasXmlStream();
            var document = new XmlDocument();
            document.Load(stream);
            _listaCuentas = new List<Cuenta>();
            _cuadroPgc = GetListaGruposPgc(document.GetElementsByTagName(GRUPO_TAG));
        }

        public List<Grupo> CuadroPgc
        {
            get
            {
                return _cuadroPgc;
            }
        }

        public List<Cuenta> Cuentas
        {
            get
            {
                return _listaCuentas;
            }
        }

        #region 'Funciones Privadas'

        private List<Grupo> GetListaGruposPgc(XmlNodeList listaNodos)
        {
            var resultado = new List<Grupo>();
            foreach (XmlNode nodo in listaNodos)
            {
                var grupo = CrearNodo<Grupo>(nodo);
                grupo.SubgruposN2 = new List<SubgrupoN2>();
                foreach (XmlNode child in nodo.SelectNodes(SUBGRUPO_TAG))
                {
                    ProcessGruposN2(grupo, child);
                }
                resultado.Add(grupo);
            }
            return resultado;
        }

        private T CrearNodo<T>(XmlNode nodo) where T : IGrupoPgc, new()
        {
            return new T()
            {
                NumGrupo = short.Parse(nodo.Attributes[GRUPOS_NUM_ATTR].Value),
                Nombre = nodo.SelectSingleNode(NOMBRE_TAG).InnerText,
                Descripcion = nodo.SelectSingleNode(DESCRIPCION_TAG).InnerText
            };
        }

        private void ProcessGruposN2(Grupo grupo, XmlNode nodo)
        {
            var grupoN2 = CrearNodo<SubgrupoN2>(nodo);
            grupoN2.SubgruposN3 = new List<SubgrupoN3>();
            grupo.SubgruposN2.Add(grupoN2);
            foreach (XmlNode child in nodo.SelectNodes(SUBGRUPO2_TAG))
            {
                ProcessGruposN3(grupoN2, child);
            }
        }

        private void ProcessGruposN3(SubgrupoN2 grupo, XmlNode nodo)
        {
            var grupoN3 = CrearNodo<SubgrupoN3>(nodo);
            grupo.SubgruposN3.Add(grupoN3);
            // No podemos añadir desde aqui las cuentas al subgrupo 3 porque ya pueden estar definidas por cada usuario, o ser cuentas por defecto
            foreach (XmlNode child in nodo.SelectNodes(CUENTA_TAG))
            {
                var cuenta = new Cuenta()
                {
                    Codigo = short.Parse(child.Attributes[CUENTA_ID_ATTR].Value),
                    Descripcion = child.SelectSingleNode(DESCRIPCION_TAG).InnerText,
                    Nombre = child.SelectSingleNode(NOMBRE_TAG).InnerText,
                    User = null,
                    SubgrupoN3 = grupoN3
                };
                _listaCuentas.Add(cuenta);
            }
        }

        private Stream GetCuadroCuentasXmlStream()
        {
            var assembly = Assembly.GetExecutingAssembly();
            return assembly.GetManifestResourceStream("ContaLibre.InitialData.PlanGeneralContableCuentas.xml");
        }

        #endregion
    }
}