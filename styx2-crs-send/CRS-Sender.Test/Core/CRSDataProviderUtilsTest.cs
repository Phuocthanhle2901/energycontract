using styx2_crs_send.Core;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace CRS_Sender.Test.Core
{
    public class CRSDataProviderUtilsTest
    {
        #region isXMLParserException
        [Theory]
        [InlineData("There is an error in XML document")]
        public void isXMlParserException_ReturnTrue_ExceptionMessage(string message)
        {
            var ex = new Exception(message);
            Assert.True(CRSDataProviderUtils.isXMlParserException(ex));
        }
        [Theory]
        [InlineData("There is an error in XML document")]
        [InlineData("anything else but the test still success bcoz the exception is InvalidOperation")]
        public void isXMlParserException_ReturnTrue_InvalidOPerationException(string message)
        {
            var ex = new InvalidOperationException(message);
            Assert.True(CRSDataProviderUtils.isXMlParserException(ex));
        }
        [Fact]
        public void isXMlParserException_ReturnFalse_NullException()
        {
            Assert.False(CRSDataProviderUtils.isXMlParserException(null));
        }
        [Theory]
        [InlineData("some message from exception")]
        [InlineData("anything else but the test still success bcoz the exception is not InvalidOperatorExcpt")]
        public void isXMlParserException_ReturnFalse_InvalidOPerationException(string message)
        {
            var ex = new Exception(message);
            Assert.False(CRSDataProviderUtils.isXMlParserException(ex));
        }
        #endregion

        #region TransformerStatus

        [Theory]
        [InlineData("assigned", "ASSIGNED")]
        [InlineData("work in progress", "WIP")]
        [InlineData("on hold", "HOLD")]
        [InlineData("background-fix", "BACKGROUND-FIX")]
        [InlineData("to be cancelled", "TO-BE-CANCELLED")]
        [InlineData("cancelled (effective)", "CANCELLED(CANCEL-OK)")]
        [InlineData("cancelled (expired)", "CANCELLED(CANCEL-EXPIRED)")]
        [InlineData("resolved", "RESOLVED")]
        [InlineData("resolved (temporary-fix)", "RESOLVED(TEMPORARY-FIX)")]
        [InlineData("anything else", "")]
        public void TransformerStatus(string status, string EnumStatus)
        {
            var value = CRSDataProviderUtils.TranformerStatus(status);
            Assert.Equal(EnumStatus, value);
        }
        #endregion

        #region GetListMainStatus
        [Theory]
        [InlineData("ASSIGNED")]
        [InlineData("WIP")]
        [InlineData("BACKGROUND-FIX")]
        [InlineData("HOLD")]
        [InlineData("TO-BE-CANCELLED")]
        [InlineData("RESOLVED")]
        public void GetListMainStatus_CheckValue(string value)
        {
            List<string> list = new List<string>();
            list = CRSDataProviderUtils.GetListMainStatus();
            Assert.Contains(value, list);
        }

        [Theory]
        [InlineData("CityRing-1V_OUTAGE")]
        [InlineData("CityRing-1V_MUTED")]
        [InlineData("CityRing-GT1V_OUTAGE")]
        [InlineData("CityRing-GT1V_MUTED")]
        [InlineData("CIF Domain")]
        [InlineData("CIF-AO Domain")]
        [InlineData("CIF-AO-NT Domain")]
        [InlineData("CIF-NT Domain")]
        [InlineData("CIF Domain (CabelDamage without service disruption)")]
        [InlineData("CIF Domain (CabelDamage with service disruption)")]
        [InlineData("FTU move")]
        public void GetListDomainPermission_CheckValue(string value)
        {
            List<string> list = new List<string>();
            list = CRSDataProviderUtils.GetListDomainPermission();
            Assert.Contains(value, list);
        }

        [Theory]
        [InlineData("AFTERNOON")]
        [InlineData("EARLY_AFTERNOON")]
        [InlineData("EARLY_MORNING")]
        [InlineData("EOB")]
        [InlineData("EVENING")]
        [InlineData("LATE_AFTERNOON")]
        [InlineData("LATE_MORNING")]
        [InlineData("MORNING")]
        [InlineData("NIGHT")]
        public void GetListPlanPeriodsType_CheckValue(string value)
        {
            List<string> list = new List<string>();
            list = CRSDataProviderUtils.GetListPlanPeriodsType();
            Assert.Contains(value, list);
        }

        [Theory]
        [InlineData("BEHEERDER")]
        [InlineData("NOC")]
        [InlineData("SERVICE_DESK")]
        public void GetListDepartment_CheckValue(string value)
        {
            List<string> list = new List<string>();
            list = CRSDataProviderUtils.GetListDepartment();
            Assert.Contains(value, list);
        }



        [Theory]
        [InlineData("COAX")]
        [InlineData("FttH")]
        [InlineData("FttO")]
        [InlineData("FttS")]
        [InlineData("PtP")]
        public void GetListNetworkType_CheckValue(string value)
        {
            List<string> list = new List<string>();
            list = CRSDataProviderUtils.GetListNetworkType();
            Assert.Contains(value, list);
        }

        [Theory]
        [InlineData("FIBER_A")]
        [InlineData("FIBER_B")]
        public void GetListFiberCodet_CheckValue(string value)
        {
            List<string> list = new List<string>();
            list = CRSDataProviderUtils.GetListFiberCode();
            Assert.Contains(value, list);
        }

        #endregion

        #region GetBindingForEndpoint
        [Fact]
        public void GetBindingForEndpoint_TypeOfCustomBinding()
        {
            var binding = CRSDataProviderUtils.GetBindingForEndpoint();
            Assert.NotNull(binding);
            Assert.IsType<System.ServiceModel.BasicHttpBinding>(binding);
        }
        #endregion
    }
}
