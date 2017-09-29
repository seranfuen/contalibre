using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Web;

namespace ContalibreWebApi.Models.Entities
{
    public class Asiento
    {
        #region ' Ctor '

        public Asiento()
        {
            Partidas = new List<Partida>();
        }

        #endregion

        #region ' Properties '

        [Key]
        [Required]
        public virtual int Id
        {
            get;
            set;
        }

        public virtual DateTimeOffset AsientoDate
        {
            get;
            set;
        }

        [Required]
        public virtual DateTimeOffset AsientoCreated
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

        public virtual List<Partida> Partidas
        {
            get;
            set;
        }

        [Required]
        public virtual Contabilidad Contabilidad
        {
            get;
            set;
        }

        #region ' Auto-calculated '

        #endregion

        #endregion

        #region ' Members '

        public void AddPartida(Account debitAccount, Account creditAccount, decimal amount)
        {
            AddPartidaDebit(debitAccount, amount);
            AddPartidaCredit(creditAccount, amount);
        }

        public void AddPartidaCredit(Account creditAccount, decimal amount)
        {
            var partida = new Partida()
            {
                Account = creditAccount,
                PartidaType = PartidaType.Credit,
                Amount = amount,
            };
            Partidas.Add(partida);
        }

        public void AddPartidaDebit(Account debitAccount, decimal amount)
        {
            var partida = new Partida()
            {
                Account = debitAccount,
                PartidaType = PartidaType.Debit,
                Amount = amount,
            };
            Partidas.Add(partida);
        }

        public bool Balances()
        {
            if (!Partidas.Any())
            {
                return true;
            } else
            {
                return Partidas.Where(partida => partida.PartidaType == PartidaType.Credit).Sum(partida => partida.Amount) ==
                    Partidas.Where(partida => partida.PartidaType == PartidaType.Debit).Sum(partida => partida.Amount);
            }
        }

        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.AppendLine(Partida.GetHeader());
            Partidas.ForEach(partida => sb.AppendLine(partida.ToString()));
            return sb.ToString();
        }

        #endregion
    }
}