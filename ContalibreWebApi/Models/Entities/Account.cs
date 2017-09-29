using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ContalibreWebApi.Models.Entities
{
    #region ' AccountType Enum '

    public enum AccountType
    {
        Debit,
        Credit,
        Equity
    }

    #endregion

    public class Account
    {
        #region ' Ctor '

        public Account()
        {

        }

        public Account(int code, string name, AccountType type)
        {
            Code = code;
            Name = name;
            AccountType = type;
        }

        #endregion

        #region ' Properties '

        [Key]
        public virtual int Id
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

        [Required]
        public virtual AccountType AccountType
        {
            get;
            set;
        }

        [Required]
        public virtual int Code
        {
            get;
            set;
        }

        [Required]
        public virtual string Name
        {
            get;
            set;
        }

        #endregion

        #region ' Members '

        public override string ToString()
        {
            return string.Format("Id: {0}, Code: {1}, Account: {2}, Type: {3}", Id, Code, Name, AccountType);
        }

        #endregion
    }
}