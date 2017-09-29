using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Web;

namespace ContalibreWebApi.Models.Entities
{
    #region ' PartidaType enum '

    public enum PartidaType
    {
        Credit,
        Debit
    }

    #endregion

    public class Partida
    {
        #region ' Fields '

        private decimal _amount;

        #endregion

        #region ' Properties '

        [Key]
        [Required]
        public virtual int Id
        {
            get;
            set;
        }

        [Required]
        public virtual Account Account
        {
            get;
            set;
        }

        [Required]
        public virtual PartidaType PartidaType
        {
            get;
            set;
        }

        [Required]
        public virtual decimal Amount
        {
            get
            {
                return _amount;
            }
            set
            {
                if (value < decimal.Zero) throw new ArgumentException("Change the PartidaType property from debit to credit or vice versa to express negative amounts");
                _amount = value;
            }
        }

        [Required]
        public ApplicationUser User
        {
            get;
            set;
        }

        [Required]
        public Asiento Asiento
        {
            get;
            set;
        }

        #endregion

        #region ' Members '

        public override string ToString()
        {
            if (Account == null)
            {
                return "Incomplete";
            }
            else
            {
                var sb = new StringBuilder();
                if (PartidaType == PartidaType.Debit)
                {
                    sb.Append(FormatAmount());
                }
                else
                {
                    sb.Append(GetEmptyAmount());
                }

                sb.Append(GetEmptySeparation());

                if (PartidaType == PartidaType.Credit)
                {
                    sb.Append(FormatAmount());
                }
                else
                {
                    sb.Append(GetEmptyAmount());
                }

                sb.Append(GetEmptySeparation());
                sb.Append(string.Format("({0}) {1}", Account.Code, Account.Name));
                return sb.ToString();
            }
        }

        private string FormatAmount()
        {
            return string.Format("{0:00000000.000}", Amount);
        }

        private string GetEmptyAmount()
        {
            return "----------------";
        }

        private static string GetEmptySeparation()
        {
            return "    ";
        }

        public static string GetHeader()
        {
            var sb = new StringBuilder();
            sb.Append(string.Format("  DEBIT           {0} CREDIT         {1}ACCOUNT", GetEmptySeparation(), GetEmptySeparation()));
            sb.Append("\n---------------------------------------------------------------------------------------");
            return sb.ToString();
        }

        #endregion
    }
}