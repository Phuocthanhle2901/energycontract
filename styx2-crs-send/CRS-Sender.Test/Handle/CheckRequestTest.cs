using Common.Exceptions;
using CRS_Sender.Test.ModelsForTest;
using Microsoft.Extensions.Configuration;
using Moq;
using styx2_crs_send.Core;
using styx2_crs_send.Handle;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;
using CRSReference;
using CRSTranformer.Utils;

namespace CRS_Sender.Test.Handle
{
    public class CheckRequestTest
    {
        private readonly Mock<IConfiguration> mockConfig;
        private readonly ICheckRequest checkRequest;
        private readonly TaskModelTest taskModelTest;
        public CheckRequestTest()
        {
            taskModelTest = new TaskModelTest();
            mockConfig = new Mock<IConfiguration>();
            checkRequest = new CheckRequest(mockConfig.Object);

            mockConfig.Setup(s => s["SourceId"]).Returns("CAIW");
            mockConfig.Setup(s => s["SourceSystemId"]).Returns("CRS");
        }


        #region CheckSource
        /// <summary>
        /// check cases Throws HandleFailedException of CheckSource method
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="sourceSystemId"></param>
        /// <param name="priority"></param>
        [Theory]
        [InlineData("CAIWW", "CRS", "3")]
        [InlineData("CAIWW", "CRSS", "3")]
        [InlineData("CAIW", "CRSS", "3")]
        [InlineData("CAIW", "CRS", "1")]
        [InlineData("CAIW", "CRS", "2")]
        [InlineData("CAIW", "CRS", "4")]
        public void CheckSource_ThrowsHandleFailedException(string sourceId, string sourceSystemId, string priority)
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            taskModel.SourceId = sourceId;
            taskModel.SourceSystemId = sourceSystemId;
            taskModel.Prio3.Priority = priority;

            Assert.Throws<HandleFailedException>(() => checkRequest.CheckSource(taskModel));
        }
        
        /// <summary>
        /// check case Throw HandleFailedException when Prio3 is Null
        /// </summary>
        [Fact]
        public void CheckSource_NullPrio3_ThrowsHandleFailedException()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            
            taskModel.Prio3 = null;

            Assert.Throws<HandleFailedException>(() => checkRequest.CheckSource(taskModel));
        }

        /// <summary>
        /// check case Throw HandleFailedException when Prio3 is Null
        /// </summary>
        [Fact]
        public void CheckSource_NullPlanned_ThrowsHandleFailedException()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();

            taskModel.Planned = null;

            Assert.Throws<HandleFailedException>(() => checkRequest.CheckSource(taskModel));
        }

        /// <summary>
        /// check case Throw HandleFailedException when comment is Null
        /// </summary>
        [Fact]
        public void CheckSource_NullComment_ThrowsHandleFailedException()
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();

            taskModel.Prio3.Comment = null;

            Assert.Throws<HandleFailedException>(() => checkRequest.CheckSource(taskModel));
        }
        #endregion

        #region CheckEnumStatus
        /// <summary>
        /// check cases Throws HandleFailedException of CheckEnumStatus method
        /// </summary>
        /// <param name="mainStatus"></param>
        /// <param name="subStatus"></param>
        [Theory]
        [InlineData("WrongMainStatus", "TEMPORARY-FIX")]
        [InlineData("CANCELLED", "WrongSubStatus")]
        [InlineData("RESOLVED", "WrongSubStatus")]
        public void CheckEnumStatus_ThrowsHandleFailedException(string mainStatus, string subStatus)
        {
            Assert.Throws<HandleFailedException>(() => checkRequest.CheckEnumStatus(mainStatus, subStatus));
        }

        /// <summary>
        /// check cases successful of CheckEnumStatus method
        /// </summary>
        /// <param name="mainStatus"></param>
        /// <param name="subStatus"></param>
        [Theory]
        [InlineData("WIP", "")]
        [InlineData("RESOLVED", "")]
        [InlineData("RESOLVED", "TEMPORARY-FIX")]
        [InlineData("BACKGROUND-FIX", "")]
        [InlineData("HOLD", "")]
        [InlineData("CANCELLED", "CANCEL-OK")]
        [InlineData("CANCELLED", "CANCEL-EXPIRED")]
        public void CheckEnumStatus_ReturnsTrue(string mainStatus, string subStatus)
        {
            var result = checkRequest.CheckEnumStatus(mainStatus, subStatus);
            Assert.True(result);
        }
        #endregion

        #region CheckValue
        /// <summary>
        /// check case Throws HandleFailedException of CheckValue method with list DomainPermission
        /// </summary>
        [Fact]
        public void CheckValue_ListDomainPermission_ThrowsHandleFailedException()
        {
            var list = CRSDataProviderUtils.GetListDomainPermission();

            Assert.Throws<HandleFailedException>(() => checkRequest.CheckValue("WrongValue", It.IsAny<string>(), list));
        }

        /// <summary>
        /// check cases successful of CheckValue method with list DomainPermission
        /// </summary>
        /// <param name="value"></param>
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
        public void CheckValue_ListDomainPermission_ReturnsTrue(string value)
        {
            var list = CRSDataProviderUtils.GetListDomainPermission();
            var result = checkRequest.CheckValue(value, It.IsAny<string>(), list);

            Assert.True(result);
        }

        /// <summary>
        /// check case Throws HandleFailedException of CheckValue method with list PlanPeriodsType
        /// </summary>
        [Fact]
        public void CheckValue_ListPlanPeriodsType_ThrowsHandleFailedException()
        {
            var list = CRSDataProviderUtils.GetListPlanPeriodsType();

            Assert.Throws<HandleFailedException>(() => checkRequest.CheckValue("WrongValue", It.IsAny<string>(), list));
        }

        /// <summary>
        /// check cases successful of CheckValue method with list PlanPeriodsType
        /// </summary>
        /// <param name="value"></param>
        [Theory]
        [InlineData("MORNING")]
        [InlineData("EARLY_AFTERNOON")]
        [InlineData("LATE_AFTERNOON")]
        [InlineData("EVENING")]
        [InlineData("NIGHT")]
        [InlineData("EARLY_MORNING")]
        [InlineData("LATE_MORNING")]
        [InlineData("AFTERNOON")]
        [InlineData("EOB")]
        public void CheckValue_ListPlanPeriodsType_ReturnsTrue(string value)
        {
            var list = CRSDataProviderUtils.GetListPlanPeriodsType();
            var result = checkRequest.CheckValue(value, It.IsAny<string>(), list);

            Assert.True(result);
        }

        /// <summary>
        /// check case Throws HandleFailedException of CheckValue method with list Department
        /// </summary>
        [Fact]
        public void CheckValue_ListDepartment_ThrowsHandleFailedException()
        {
            var list = CRSDataProviderUtils.GetListDepartment();
            
            Assert.Throws<HandleFailedException>(() => checkRequest.CheckValue("WrongValue", It.IsAny<string>(), list));
        }

        /// <summary>
        /// check cases successful of CheckValue method with list Department
        /// </summary>
        /// <param name="value"></param>
        [Theory]
        [InlineData("NOC")]
        [InlineData("SERVICE_DESK")]
        [InlineData("BEHEERDER")]
        public void CheckValue_ListDepartment_ReturnsTrue(string value)
        {
            var list = CRSDataProviderUtils.GetListDepartment();
            var result = checkRequest.CheckValue(value, It.IsAny<string>(), list);

            Assert.True(result);
        }

        /// <summary>
        /// check case Throws HandleFailedException of CheckValue method with list NetworkType
        /// </summary>
        [Fact]
        public void CheckValue_ListNetworkType_ThrowsHandleFailedException()
        {
            var list = CRSDataProviderUtils.GetListNetworkType();

            Assert.Throws<HandleFailedException>(() => checkRequest.CheckValue("WrongValue", It.IsAny<string>(), list));
        }

        /// <summary>
        /// check cases successful of CheckValue method with list NetworkType
        /// </summary>
        /// <param name="value"></param>
        [Theory]
        [InlineData("FttH")]
        [InlineData("FttO")]
        [InlineData("FttS")]
        [InlineData("PtP")]
        [InlineData("COAX")]
        public void CheckValue_ListNetworkType_ReturnsTrue(string value)
        {
            var list = CRSDataProviderUtils.GetListNetworkType();
            var result = checkRequest.CheckValue(value, It.IsAny<string>(), list);

            Assert.True(result);
        }

        /// <summary>
        /// check case Throws HandleFailedException of CheckValue method with list FiberCode
        /// </summary>
        [Fact]
        public void CheckValue_ListFiberCode_ThrowsHandleFailedException()
        {
            var list = CRSDataProviderUtils.GetListFiberCode();

            Assert.Throws<HandleFailedException>(() => checkRequest.CheckValue("WrongValue", It.IsAny<string>(), list));
        }

        /// <summary>
        /// check cases successful of CheckValue method with list FiberCode
        /// </summary>
        /// <param name="value"></param>
        [Theory]
        [InlineData("FIBER_A")]
        [InlineData("FIBER_B")]
        public void CheckValue_ListFiberCode_ReturnsTrue(string value)
        {
            var list = CRSDataProviderUtils.GetListFiberCode();
            var result = checkRequest.CheckValue(value, It.IsAny<string>(), list);

            Assert.True(result);
        }
        #endregion

        #region checkStatusBeforeUpdate
        /// <summary>
        /// check case Thorws AlreadyExistingStatusException of checkStatusBeforeUpdate method
        /// </summary>
        /// <param name="mainStatus"></param>
        /// <param name="subStatus"></param>
        /// <param name="statusBeforeUpdate"></param>
        [Theory]
        [InlineData("WIP", "", CommonUtils.Cancel_Effective)]
        [InlineData("WIP", "", CommonUtils.Cancel_Expired)]
        [InlineData("WIP", "", CommonUtils.Resolved)]
        [InlineData("BACKGROUND-FIX", "", CommonUtils.Assigned)]
        [InlineData("HOLD", "", CommonUtils.Assigned)]
        [InlineData("TO-BE-CANCELLED", "", CommonUtils.Assigned)]
        [InlineData("CANCELLED", "", CommonUtils.Assigned)]
        [InlineData("RESOLVED", "", CommonUtils.Assigned)]
        [InlineData("RESOLVED", "", CommonUtils.To_Be_Cancelled)]
        [InlineData("WIP", "", CommonUtils.To_Be_Cancelled)]
        [InlineData("BACKGROUND-FIX", "", CommonUtils.To_Be_Cancelled)]
        [InlineData("HOLD", "", CommonUtils.To_Be_Cancelled)]
        [InlineData("ASSIGNED", "", CommonUtils.To_Be_Cancelled)]
        [InlineData("ASSIGNED", "", CommonUtils.WIP)]
        [InlineData("TO-BE-CANCELLED", "", CommonUtils.WIP)]
        [InlineData("CANCELLED", "", CommonUtils.WIP)]
        [InlineData("CANCELLED", "", CommonUtils.Hold)]
        [InlineData("RESOLVED", "", CommonUtils.Hold)]
        [InlineData("BACKGROUND-FIX", "", CommonUtils.Hold)]
        [InlineData("ASSIGNED", "", CommonUtils.Hold)]
        [InlineData("HOLD", "", CommonUtils.Background_Fix)]
        [InlineData("ASSIGNED", "", CommonUtils.Background_Fix)]
        [InlineData("CANCELLED", "", CommonUtils.Background_Fix)]
        [InlineData("RESOLVED", "", CommonUtils.Background_Fix)]
        [InlineData("RESOLVED", "", CommonUtils.Resolved_TemporaryFix)]
        [InlineData("RESOLVED", "WrongSubStatus", CommonUtils.Resolved_TemporaryFix)]
        [InlineData("ASSIGNED", "", CommonUtils.Resolved_TemporaryFix)]
        [InlineData("BACKGROUND-FIX", "", CommonUtils.Resolved_TemporaryFix)]
        [InlineData("HOLD", "", CommonUtils.Resolved_TemporaryFix)]
        [InlineData("CANCELLED", "", CommonUtils.Resolved_TemporaryFix)]
        public void checkStatusBeforeUpdate_ThorwsAlreadyExistingStatusException(string mainStatus, string subStatus, string statusBeforeUpdate)
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            taskModel.Status.MainStatus = mainStatus;
            taskModel.Status.SubStatus = subStatus;
            var searchOneResponse = taskModelTest.GetSearchOneResponse(statusBeforeUpdate);
            
            Assert.Throws<AlreadyExistingStatusException>(() => checkRequest.checkStatusBeforeUpdate(searchOneResponse.@return[0], taskModel));
        }

        /// <summary>
        /// check case successful of checkStatusBeforeUpdate method
        /// </summary>
        /// <param name="mainStatus"></param>
        /// <param name="subStatus"></param>
        /// <param name="statusBeforeUpdate"></param>
        [Theory]
        [InlineData("WIP", "", CommonUtils.Assigned)]
        [InlineData("ASSIGNED", "", CommonUtils.Assigned)]
        [InlineData("TO-BE-CANCELLED", "", CommonUtils.To_Be_Cancelled)]
        [InlineData("CANCELLED", "", CommonUtils.To_Be_Cancelled)]
        [InlineData("RESOLVED", "", CommonUtils.WIP)]
        [InlineData("WIP", "", CommonUtils.WIP)]
        [InlineData("HOLD", "", CommonUtils.WIP)]
        [InlineData("BACKGROUND-FIX", "", CommonUtils.WIP)]
        [InlineData("HOLD", "", CommonUtils.Hold)]
        [InlineData("WIP", "", CommonUtils.Hold)]
        [InlineData("BACKGROUND-FIX", "", CommonUtils.Background_Fix)]
        [InlineData("WIP", "", CommonUtils.Background_Fix)]
        [InlineData("WIP", "", CommonUtils.Resolved_TemporaryFix)]
        [InlineData("RESOLVED", "TEMPORARY-FIX", CommonUtils.Resolved_TemporaryFix)]
        public void checkStatusBeforeUpdate_ReturnsTrue(string mainStatus, string subStatus, string statusBeforeUpdate)
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            taskModel.Status.MainStatus = mainStatus;
            taskModel.Status.SubStatus = subStatus;
            var searchOneResponse = taskModelTest.GetSearchOneResponse(statusBeforeUpdate);

            var result = checkRequest.checkStatusBeforeUpdate(searchOneResponse.@return[0], taskModel);

            Assert.True(result);
        }
        #endregion

        #region CheckInputStatusForUpdateFields
        /// <summary>
        /// check cases throw HandleFailedException with null StatusCode
        /// </summary>
        [Theory]
        [InlineData("RESOLVED", "TEMPORARY-FIX")]
        [InlineData("WIP", "")]
        [InlineData("BACKGROUND-FIX", "")]
        [InlineData("CANCELLED", "CANCEL-OK")]
        [InlineData("CANCELLED", "CANCEL-EXPIRED")]
        [InlineData("HOLD", "")]
        [InlineData("TO-BE-CANCELLED", "")]
        public void CheckInputStatusForUpdateFields_NullStatusCode_ThrowsHandleFailedException(string mainStatus, string subStatus)
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            taskModel.Status.MainStatus = mainStatus;
            taskModel.Status.SubStatus = subStatus;
            taskModel.StatusCode = null;
            Assert.Throws<HandleFailedException>(() => checkRequest.CheckInputStatusForUpdateFields(taskModel));
        }

        /// <summary>
        /// check cases throw HandleFailedException with null Closure
        /// </summary>
        [Theory]
        [InlineData("RESOLVED", "")]
        [InlineData("CANCELLED", "CANCEL-OK")]
        [InlineData("CANCELLED", "CANCEL-EXPIRED")]
        [InlineData("TO-BE-CANCELLED", "")]
        public void CheckInputStatusForUpdateFields_NullClosure_ThrowsHandleFailedException(string mainStatus, string subStatus)
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            taskModel.Status.MainStatus = mainStatus;
            taskModel.Status.SubStatus = subStatus;
            taskModel.Prio3.Closure = null;
            Assert.Throws<HandleFailedException>(() => checkRequest.CheckInputStatusForUpdateFields(taskModel));
        }

        /// <summary>
        /// check cases return true with null Closure
        /// </summary>
        [Theory]
        [InlineData("RESOLVED", "TEMPORARY-FIX")]
        [InlineData("WIP", "")]
        [InlineData("BACKGROUND-FIX", "")]
        [InlineData("HOLD", "")]
        public void CheckInputStatusForUpdateFields_NullClosure_ReturnsTrue(string mainStatus, string subStatus)
        {
            var taskModel = taskModelTest.GetTaskModelSuccessful();
            taskModel.Status.MainStatus = mainStatus;
            taskModel.Status.SubStatus = subStatus;
            taskModel.Prio3.Closure = null;

            Assert.True(checkRequest.CheckInputStatusForUpdateFields(taskModel));
        }
        #endregion
    }
}
