using DomainModel;
using DomainModel.DtoSlaRule;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Service.OrderSla
{
    public interface ISlaService
    {
        List<SlaRule> GetListSlaOrder(RuleSearchDto search, SortRule sort);
        SlaRule GetSlaOrderbyId(int id);
        List<SlaType> GetSlaType();
        List<OrganizationSla> GetOrganisatie();
        List<OrderTypeSla> GetOrderType();
        List<NetworkTypeSla> GetNetWorkType();
        List<ConnectionStatusSla> GetConnectionStatus();
        List<BuidingStatus> GetConstructionStatus();
        List<NlTypeSla> GetNlType();
        List<Priority> GetPriority();
        List<CalendarSla> Calendar();
        List<MeasurementSla> GetMeasure();
        List<UnitSla> GetMeasureUnit();
        bool InsertSlaRule(SlaRule slaRule);
        Result UpdateSlaRule(SlaRule slaRule);
        Availabilty GetAvailabilty();
        ResponseSlaRuleOrder GetAll(int page, int pageSize, RuleSearchDto search, SortRule sort);
    }
}

