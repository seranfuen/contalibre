using System;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ContalibreWebApi.Models.Entities;

namespace ContalibreWebApi.Tests.Models
{
    /// <summary>
    /// Descripción resumida de AsientoTests
    /// </summary>
    [TestClass]
    public class AsientoTests
    {
        public AsientoTests()
        {
            //
            // TODO: Agregar aquí la lógica del constructor
            //
        }

        private TestContext testContextInstance;

        /// <summary>
        ///Obtiene o establece el contexto de las pruebas que proporciona
        ///información y funcionalidad para la serie de pruebas actual.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        #region Atributos de prueba adicionales
        //
        // Puede usar los siguientes atributos adicionales conforme escribe las pruebas:
        //
        // Use ClassInitialize para ejecutar el código antes de ejecutar la primera prueba en la clase
        // [ClassInitialize()]
        // public static void MyClassInitialize(TestContext testContext) { }
        //
        // Use ClassCleanup para ejecutar el código una vez ejecutadas todas las pruebas en una clase
        // [ClassCleanup()]
        // public static void MyClassCleanup() { }
        //
        // Usar TestInitialize para ejecutar el código antes de ejecutar cada prueba 
        // [TestInitialize()]
        // public void MyTestInitialize() { }
        //
        // Use TestCleanup para ejecutar el código una vez ejecutadas todas las pruebas
        // [TestCleanup()]
        // public void MyTestCleanup() { }
        //
        #endregion

        [TestMethod]
        public void Test_VentaParteClientes_Cuadra()
        {
            // Venta de 3000 euros a clientes mas IVA (630 euros)
            // 3630 clientes a ventas 3000, IVA repercutido 630

            var asiento = new Asiento();
            asiento.AddPartidaDebit(GetClientesAccount(), 3630);
            asiento.AddPartidaCredit(GetVentasAccount(), 3000);
            Assert.IsFalse(asiento.Balances());
            asiento.AddPartidaCredit(GetHaciendaPublicaIVARepercutidoAccount(), 630);
            Assert.IsTrue(asiento.Balances());
        }

        [TestMethod]
        public void Test_CompraMercaderiasContadoNoIVA_Cuadra()
        {
            // Compra de 5000 euros de mercaderias al contado. Sin IVA
            var asiento = new Asiento();
            asiento.AddPartida(GetMercaderiasAccount(), GetBankAccount(), 5000);
            Assert.IsTrue(asiento.Balances());
        }

        [TestMethod]
        public void Test_CompraMercaderiasContadoMasReducirDeudaClientes_Cuadra()
        {
            // Compra de 1000 euros de mercaderias. Proveedor tenia deuda, como cliente, de 800 euros, que se reduce
            // Resto al contado. Sin IVA
            var asiento = new Asiento();
            asiento.AddPartidaDebit(GetMercaderiasAccount(), 1000);
            asiento.AddPartidaCredit(GetClientesAccount(), 800);
            asiento.AddPartidaCredit(GetBankAccount(), 200);
            Assert.IsTrue(asiento.Balances());
        }

        [TestMethod]
        public void Test_SeeToStringResult()
        {
            var asiento = new Asiento();
            asiento.AddPartidaDebit(GetClientesAccount(), 3630);
            asiento.AddPartidaCredit(GetVentasAccount(), 3000);
            Assert.IsFalse(asiento.Balances());
            asiento.AddPartidaCredit(GetHaciendaPublicaIVARepercutidoAccount(), 630);
            Assert.IsTrue(asiento.Balances());
            Console.WriteLine(asiento.ToString());
        }

        public Account GetClientesAccount()
        {
            var account = new Account(430, "Clientes", AccountType.Debit);
            return account;
        }

        public Account GetMercaderiasAccount()
        {
            var account = new Account(600, "Compra de Mercaderías", AccountType.Debit);
            return account;
        }

        public Account GetVentasAccount()
        {
            var account = new Account(700, "Ventas", AccountType.Credit);
            return account;
        }

        public Account GetBankAccount()
        {
            var account = new Account(572, "Bancos", AccountType.Debit);
            return account;
        }

        public Account GetHaciendaPublicaIVARepercutidoAccount()
        {
            var account = new Account(477, "Hacienda Pública, IVA Repercutido", AccountType.Credit);
            return account;
        }
    }
}
