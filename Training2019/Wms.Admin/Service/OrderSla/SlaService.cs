using AutoMapper;
using Common;
using DomainModel;
using DomainModel.DtoSlaRule;
using DomainModel.Enum;
using Entities.Main;
using Entities.Sla;
using IFD.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using static DomainModel.Enum.OrderSlaEnum;
using Priority = DomainModel.DtoSlaRule.Priority;

namespace Service.OrderSla
{
    public class SlaService : ISlaService
    {
        private readonly IUnitOfWork _slaUow;
        private readonly IUnitOfWork _mainUow;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly string _delimiter;

        public SlaService(IEnumerable<IUnitOfWork> unitOfWork, IConfiguration configuration, IMapper mapper, ILogger logger)
        {
            var unitOfWorks = unitOfWork as IUnitOfWork[] ?? unitOfWork.ToArray();
            _mainUow = unitOfWorks.FirstOrDefault(r => r.GetType() == typeof(UnitOfWork<MainContext>));
            _slaUow = unitOfWorks.FirstOrDefault(r => r.GetType() == typeof(UnitOfWork<SlaContext>));
            _configuration = configuration;
            _mapper = mapper;
            _delimiter = _configuration["delimiter"];
        }

        public List<CalendarSla> Calendar()
        {
            var listCalendar = _slaUow.GetRepository<Calendar>().GetAllByFilter().Select(x => new CalendarSla { Name = x.Name }).ToList();
            return listCalendar;
        }

        /// <summary>
        /// Get list SlaOrder
        /// </summary>
        /// <returns></returns>
        public List<SlaRule> GetListSlaOrder(RuleSearchDto search, SortRule sort)
        {
            var listRule = _slaUow.GetRepository<Rule>().GetAllByFilter(predicate: null, include: x => x.Include(i => i.RulePrimitivedataConditions));
            if (!string.IsNullOrEmpty(search.Organisatie))
            {
                var partys = search.Organisatie.Split(_delimiter);
                if (partys.Length < 2)
                {
                    throw new ClientException(LoggingEnum.UDR0027, "Invalid field organization data");
                }
                listRule = listRule.Where(x => x.PartyName == partys[0] && x.PartySystem == partys[1]);
            }
            if (search.Startdatum != null)
            {
                listRule = listRule.Where(x => x.Start.ToString().Contains(search.Startdatum.Value.ToString("d")));
            }
            if (!string.IsNullOrEmpty(search.Priority))
            {
                listRule = listRule.Where(x => x.Priority.ToString() == search.Priority);
            }
            //Sort by createdDate
            if (sort.SortBy == Search.createdDate.ToString())
            {
                if (sort.SortType == Direction.DESC.ToString())
                {
                    listRule = listRule.OrderByDescending(x => x.CreatedDate);
                }
                else
                {
                    listRule = listRule.OrderBy(x => x.CreatedDate);
                }
            }
            //Sort by updatedDate
            if (sort.SortBy == Search.updatedDate.ToString())
            {
                if (sort.SortType == Direction.DESC.ToString())
                {
                    listRule = listRule.OrderByDescending(x => x.UpdatedDate);
                }
                else
                {
                    listRule = listRule.OrderBy(x => x.UpdatedDate);
                }
            }
            //select SlaRule
            var result = listRule.Select(x => new { SlaRule = MappingSlaRulePrimitve(x) }).Select(i => i.SlaRule).ToList();

            if (!string.IsNullOrEmpty(search.Sla))
            {
                result = result.Where(x => x.SLA.ToLower().Contains(search.Sla.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(search.BuildingStatus))
            {
                result = result.Where(x => x.ConstructionStatus == search.BuildingStatus).Select(i => i).ToList();
            }
            if (!string.IsNullOrEmpty(search.ConnectionStatus))
            {
                result = result.Where(x => x.ConnectionStatus == search.ConnectionStatus).ToList();
            }
            if (!string.IsNullOrEmpty(search.NlType))
            {
                result = result.Where(x => x.NLType == search.NlType).ToList();
            }
            if (!string.IsNullOrEmpty(search.OrderType))
            {
                result = result.Where(x => x.Action == search.OrderType).ToList();
            }

            // sort by field
            if (sort != null)
            {
                if (sort.SortBy == Search.action.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.Action).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.Action).ToList();
                    }
                }
                else if (sort.SortBy == Search.calendar.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.Calendar).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.Calendar).ToList();
                    }

                }
                else if (sort.SortBy == Search.connectionStatus.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.ConnectionStatus).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.ConnectionStatus).ToList();
                    }

                }
                else if (sort.SortBy == Search.constructionStatus.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.ConstructionStatus).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.ConstructionStatus).ToList();
                    }

                }
                else if (sort.SortBy == Search.end.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.End).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.End).ToList();
                    }

                }
                else if (sort.SortBy == Search.measurementUnit.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.MeasurementUnit).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.MeasurementUnit).ToList();
                    }

                }
                else if (sort.SortBy == Search.networkType.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.NetworkType).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.NetworkType).ToList();
                    }

                }
                else if (sort.SortBy == Search.nlType.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.NLType).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.NLType).ToList();
                    }

                }
                else if (sort.SortBy == Search.organization.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.Organization).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.Organization).ToList();
                    }

                }
                else if (sort.SortBy == Search.priority.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.Priority).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.Priority).ToList();
                    }

                }
                else if (sort.SortBy == Search.ruleType.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.RuleType).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.RuleType).ToList();
                    }

                }
                else if (sort.SortBy == Search.sla.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.SLA).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.SLA).ToList();
                    }

                }
                else if (sort.SortBy == Search.slaRuleNr.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.SLARuleNr).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.SLARuleNr).ToList();
                    }

                }
                else if (sort.SortBy == Search.slaType.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.SLAType).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.SLAType).ToList();
                    }

                }
                else if (sort.SortBy == Search.start.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.Start).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.Start).ToList();
                    }

                }
                else if (sort.SortBy == Search.threshold.ToString())
                {
                    if (sort.SortType == Direction.DESC.ToString())
                    {
                        result = result.OrderByDescending(x => x.Threshold).ToList();
                    }
                    else
                    {
                        result = result.OrderBy(x => x.Threshold).ToList();
                    }
                }

            }
            return result;
        }

        public List<ConnectionStatusSla> GetConnectionStatus()
        {
            var listConnection = _mainUow.GetRepository<OrderSlaType>().GetAllByFilter(predicate: x => x.ConnectionStatus != null).Select(x => new ConnectionStatusSla { Name = x.ConnectionStatus }).Distinct().ToList();
            return listConnection;

        }

        public List<BuidingStatus> GetConstructionStatus()
        {
            var listConstructionStatus = _mainUow.GetRepository<OrderSlaType>().GetAllByFilter().Select(x => new BuidingStatus { Name = x.BuildingStatus.ToString() }).GroupBy(x => x.Name).Select(x => x.First()).ToList();
            return listConstructionStatus;
        }

        public List<MeasurementSla> GetMeasure()
        {
            var listMeasurement = _configuration.GetSection("Measurement").Get<List<string>>().Select(x => new MeasurementSla { Name = x }).ToList();
            return listMeasurement;
        }

        public List<UnitSla> GetMeasureUnit()
        {
            var listMeasure = _configuration.GetSection("MeasurementUnit").Get<List<string>>().Select(x => new UnitSla { Name = x }).ToList();
            return listMeasure;
        }

        public List<NetworkTypeSla> GetNetWorkType()
        {
            var listNetworkType = _configuration.GetSection("NetworkType").Get<List<string>>().Select(x => new NetworkTypeSla { Name = x }).ToList(); ;
            return listNetworkType;
        }

        public List<NlTypeSla> GetNlType()
        {
            var listNlType = _mainUow.GetRepository<OrderSlaType>().GetAllByFilter().Select(x => new NlTypeSla { Name = x.NLType.ToString() }).GroupBy(x => x.Name).Select(x => x.First()).ToList();
            return listNlType;
        }

        public List<OrderTypeSla> GetOrderType()
        {
            var listOrderType = _configuration.GetSection("OrderType").Get<List<string>>().Select(x => new OrderTypeSla { Name = x }).ToList();
            return listOrderType;
        }

        public List<OrganizationSla> GetOrganisatie()
        {
            var listOrganiBeheerder = _mainUow.GetRepository<Beheerder>().GetByFilter().Select(x => new OrganizationSla { Name = x.HeaderId + _delimiter + x.HeaderSystemId, slaType = SlaDirection.wms_beheerder });
            var listOrganiHuurder = _mainUow.GetRepository<Huurder>().GetByFilter().Select(x => new OrganizationSla { Name = x.HeaderId + _delimiter + x.HeaderSystemId, slaType = SlaDirection.huurder_wms });
            listOrganiBeheerder = listOrganiBeheerder.Concat(listOrganiHuurder);
            return listOrganiBeheerder.ToList();
        }

        public List<SlaType> GetSlaType()
        {
            var listSlaType = _configuration.GetSection("SLAType").Get<List<string>>().Select(x => new SlaType { Name = x }).ToList();
            return listSlaType;
        }

        public List<Priority> GetPriority()
        {
            var listMeasure = _configuration.GetSection("Priority").Get<List<string>>().Select(x => new Priority { Name = x }).ToList();
            return listMeasure;
        }

        /// <summary>
        /// Insert order of table Rule
        /// </summary>
        /// <param name="slaRule"></param>
        /// <returns></returns>
        public bool InsertSlaRule(SlaRule slaRule)
        {
            var sla = _mapper.Map<SlaRule, Rule>(slaRule);
            //list partyName & systemName
            var partys = slaRule.Organization.Split(_delimiter);
            if (partys.Length < 2)
            {
                throw new ClientException(LoggingEnum.UDR0027, "Invalid field organization data");
            }
            //set RulePrimitive 
            sla.RulePrimitivedataConditions = InsertAllOrderRulePrimitive(slaRule);
            sla.PartyName = partys[0];
            sla.PartySystem = partys[1];
            _slaUow.GetRepository<Rule>().Insert(sla);
            _slaUow.SaveChanges();
            return true;
        }

        /// <summary>
        /// Update Order SlaRule
        /// </summary>
        /// <param name="slaRule"></param>
        /// <returns></returns>
        public Result UpdateSlaRule(SlaRule slaRule)
        {
            var slaModel = _slaUow.GetRepository<Rule>().GetFirstOrDefault(predicate: x => x.Id == slaRule.Id, include: i => i.Include(u => u.RulePrimitivedataConditions));
            if (slaModel != null)
            {
                //list partyName & systemName
                var partys = slaRule.Organization.Split(_delimiter);
                if (partys.Length < 2)
                {
                    throw new ClientException(LoggingEnum.UDR0027, "Invalid field organization data");
                }
                slaModel.Start = slaRule.Start;
                slaModel.End = slaRule.End;
                slaModel.PartyName = partys[0];
                slaModel.PartySystem = partys[1];
                slaModel.SlaDirection = slaRule.SLAType ?? slaModel.SlaDirection;
                slaModel.ThresHold = slaRule.Threshold;
                slaModel.Priority = slaRule.Priority ?? slaModel.Priority;
                slaModel.NetworkType = slaRule.NetworkType ?? slaModel.NetworkType;
                slaModel.MeasureUnit = slaRule.MeasurementUnit ?? slaModel.MeasureUnit;
                slaModel.RuleType = slaRule.RuleType ?? slaModel.RuleType;
                slaModel.Rule_nr = slaRule.SLARuleNr;
                slaModel.Calendar = (int)(slaRule.Calendar);
                slaModel.RuleName = slaRule.SLA;

                //Update value of table RulePrimitivedataConditions
                //Update field Action
                var listRulePrim = slaModel.RulePrimitivedataConditions.ToList();
                listRulePrim = UpdateOrderRulePrimitive(listRulePrim, slaRule.Id, _configuration["Action"], slaRule.Action, DataTypeRule.STRING);
                //Update field NLType
                listRulePrim = UpdateOrderRulePrimitive(listRulePrim, slaRule.Id, _configuration["NlType"], slaRule.NLType, DataTypeRule.STRING);
                //Update field BuildingStatus
                listRulePrim = UpdateOrderRulePrimitive(listRulePrim, slaRule.Id, _configuration["BuildingStatus"], slaRule.ConstructionStatus, DataTypeRule.INTERGER);
                //Update field ConnectionStatus
                listRulePrim = UpdateOrderRulePrimitive(listRulePrim, slaRule.Id, _configuration["ConnectionStatus"], slaRule.ConnectionStatus, DataTypeRule.STRING);
                //Update field Domail
                listRulePrim = UpdateOrderRulePrimitive(listRulePrim, slaRule.Id, _configuration["Domail"], slaRule.DoMail.ToString(), DataTypeRule.INTERGER);
                //Update field RTD
                listRulePrim = UpdateOrderRulePrimitive(listRulePrim, slaRule.Id, _configuration["RTD"], slaRule.RTD.ToString(), DataTypeRule.INTERGER);

                slaModel.RulePrimitivedataConditions = listRulePrim;
                ///save changes model
                slaModel.UpdatedDate = DateTime.Now;
                _slaUow.GetRepository<Rule>().Update(slaModel);
                _slaUow.SaveChanges();
                return new Result
                {
                    Code = "0",
                    Text = "Successfully"
                };
            }
            return new Result
            {
                Code = "1",
                Text = $"Rule {slaRule.SLARuleNr} not existed"
            };
        }

        /// <summary>
        /// Insert Order RulePrimitivedataConditions
        /// </summary>
        /// <param name="idSlaRule"></param>
        /// <param name="fieldName"></param>
        /// <param name="value"></param>
        /// <param name="dataType"></param>
        public RulePrimitivedataConditions InsertOrderRulePrimitive(string fieldName, string value, DataTypeRule dataType)
        {
            var rulePrimitive = new RulePrimitivedataConditions
            {
                FieldName = fieldName,
                Value = value,
                DataType = dataType,
                Version = "n/a",
                MappingClass = "n/a",
                MappingPackage = "n/a",
                MappingNamespace = "n/a",
            };
            return rulePrimitive;
        }

        /// <summary>
        /// Insert All Order RulePrimitive
        /// </summary>
        /// <param name="slaRule"></param>
        /// <param name="id"></param>
        public List<RulePrimitivedataConditions> InsertAllOrderRulePrimitive(SlaRule slaRule)
        {
            var listRulePrim = new List<RulePrimitivedataConditions>();
            //Insert field Action
            if (!string.IsNullOrEmpty(slaRule.Action))
            {
                listRulePrim.Add(InsertOrderRulePrimitive(_configuration["Action"], slaRule.Action, DataTypeRule.STRING));
            }
            //Insert field NLType
            if (!string.IsNullOrEmpty(slaRule.NLType))
            {
                listRulePrim.Add(InsertOrderRulePrimitive(_configuration["NlType"], slaRule.NLType, DataTypeRule.STRING));
            }
            //Insert field BuildingStatus
            if (!string.IsNullOrEmpty(slaRule.ConstructionStatus))
            {
                listRulePrim.Add(InsertOrderRulePrimitive(_configuration["BuildingStatus"], slaRule.ConstructionStatus, DataTypeRule.INTERGER));
            }
            //Insert field ConnectionStatus
            if (!string.IsNullOrEmpty(slaRule.ConnectionStatus))
            {
                listRulePrim.Add(InsertOrderRulePrimitive(_configuration["ConnectionStatus"], slaRule.ConnectionStatus, DataTypeRule.STRING));
            }
            listRulePrim.Add(InsertOrderRulePrimitive(_configuration["Domail"], slaRule.DoMail.ToString(), DataTypeRule.INTERGER));
            //Insert field RTD
            listRulePrim.Add(InsertOrderRulePrimitive(_configuration["RTD"], slaRule.RTD.ToString(), DataTypeRule.INTERGER));
            return listRulePrim;
        }

        public string UpdateFiledRuleName(SlaDirection slaDirection)
        {
            if (slaDirection.Equals(SlaDirection.huurder_wms))
            {
                var huurderCount = _slaUow.GetRepository<Rule>().GetByFilter(x => x.SlaDirection == slaDirection).Count();
                return _configuration["HuurderRule_Wms"] + (huurderCount + 1);
            }
            else
            {
                var beeheerderCount = _slaUow.GetRepository<Rule>().GetByFilter(x => x.SlaDirection == slaDirection).Count();
                return _configuration["BeeheerderRule_Wms"] + (beeheerderCount + 1);
            }
        }

        public ResponseSlaRuleOrder GetAll(int page, int pSize, RuleSearchDto search, SortRule sort)
        {
            var result = GetListSlaOrder(search, sort);
            int tRecord = result.Count();
            int tPage = (tRecord / pSize) + ((tRecord % pSize) > 0 ? 1 : 0);
            var resultPagination = result.Skip(((page - 1) * pSize)).Take(pSize).ToList();

            return new ResponseSlaRuleOrder
            {
                pageSize = pSize,
                totalItem = tRecord,
                totalPage = tPage,
                listItem = resultPagination
            };
        }

        /// <summary>
        /// Update order RulePrimitive
        /// </summary>
        /// <param name="idSlaRule"></param>
        /// <param name="fieldName"></param>
        /// <param name="value"></param>
        /// <param name="dataType"></param>
        public List<RulePrimitivedataConditions> UpdateOrderRulePrimitive(List<RulePrimitivedataConditions> listRulePrimit, int slaRuleId, string fieldName, string value, DataTypeRule dataType)
        {
            var slaRulePrimit = listRulePrimit.FirstOrDefault(x => x.FieldName == fieldName && x.SlaRuleId == slaRuleId);
            if (slaRulePrimit != null)
            {
                slaRulePrimit.IsNullIgnore = string.IsNullOrEmpty(value) ? (sbyte)1 : (sbyte)0;
                slaRulePrimit.Value = value;
                return listRulePrimit;
            }
            else
            {
                if (string.IsNullOrEmpty(value))
                {
                    return listRulePrimit;
                }
                var result = InsertOrderRulePrimitive(fieldName, value, dataType);
                result.SlaRuleId = slaRuleId;
                listRulePrimit.Add(result);
                return listRulePrimit;
            }
        }

        public Availabilty GetAvailabilty()
        {
            var lastUpdate = new Availabilty
            {
                Name = _configuration["Availabilty"].ToString()
            };
            return lastUpdate;
        }
        /// <summary>
        /// Gets the sla orderby identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        public SlaRule GetSlaOrderbyId(int id)
        {
            var reuslt = _slaUow.GetRepository<Rule>().GetFirstOrDefault(predicate: x => x.Id == id,
                include: s => s.Include(o => o.RulePrimitivedataConditions));

            if (reuslt != null)
            {
                var slaOrder = MappingSlaRulePrimitve(reuslt);
                return slaOrder;
            }
            return null;
        }

        /// <summary>
        /// Mappings the sla rule primitve.
        /// </summary>
        /// <param name="rule">The rule.</param>
        /// <returns></returns>
        public SlaRule MappingSlaRulePrimitve(Rule rule)
        {
            var result = _mapper.Map<Rule, SlaRule>(rule);
            result.Organization = rule.PartyName + _delimiter + rule.PartySystem;
            result.NLType = rule.RulePrimitivedataConditions.FirstOrDefault(x => x.FieldName == _configuration["NlType"] && x.IsNullIgnore != 1) != null ?
                rule.RulePrimitivedataConditions.FirstOrDefault(x => x.FieldName == _configuration["NlType"] && x.IsNullIgnore != 1).Value : string.Empty;

            result.ConnectionStatus = rule.RulePrimitivedataConditions.FirstOrDefault(x => x.FieldName == _configuration["ConnectionStatus"] && x.IsNullIgnore != 1) != null ?
               rule.RulePrimitivedataConditions.FirstOrDefault(x => x.FieldName == _configuration["ConnectionStatus"] && x.IsNullIgnore != 1).Value : string.Empty;

            result.ConstructionStatus = rule.RulePrimitivedataConditions.FirstOrDefault(x => x.FieldName == _configuration["BuildingStatus"] && x.IsNullIgnore != 1) != null ?
               rule.RulePrimitivedataConditions.FirstOrDefault(x => x.FieldName == _configuration["BuildingStatus"] && x.IsNullIgnore != 1).Value : string.Empty;

            result.RTD = rule.RulePrimitivedataConditions.FirstOrDefault(x => x.FieldName == _configuration["RTD"] && x.IsNullIgnore != 1) != null ?
                  int.Parse(rule.RulePrimitivedataConditions.FirstOrDefault(x => x.FieldName == _configuration["RTD"] && x.IsNullIgnore != 1).Value) : 0;

            result.DoMail = rule.RulePrimitivedataConditions.FirstOrDefault(x => x.FieldName == _configuration["Domail"] && x.IsNullIgnore != 1) != null ?
                int.Parse(rule.RulePrimitivedataConditions.FirstOrDefault(x => x.FieldName == _configuration["Domail"] && x.IsNullIgnore != 1).Value) : 0;

            result.Action = rule.RulePrimitivedataConditions.FirstOrDefault(x => x.FieldName == _configuration["Action"] && x.IsNullIgnore != 1) != null ?
               (rule.RulePrimitivedataConditions.FirstOrDefault(x => x.FieldName == _configuration["Action"] && x.IsNullIgnore != 1).Value) : string.Empty;
            return result;
        }
    }
}