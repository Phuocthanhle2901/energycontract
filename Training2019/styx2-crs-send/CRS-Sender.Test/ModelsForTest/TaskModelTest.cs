using Common.Models;
using CRSReference;
using CRSTranformer.Utils;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRS_Sender.Test.ModelsForTest
{
    public class TaskModelTest
    {
        public TaskModel GetTaskModelSuccessful()
        {
            return new TaskModel
            {
                TicketRef = "2661023-8",
                SourceId = "CAIW",
                SourceSystemId = "CRS",
                CreationTime = new DateTime(2019, 5, 29),
                ExternalTicketNo = "AS2019062501",
                RelatedIssue = "",
                Subject = "Testing for CAIW task 3",
                Status = new Status
                {
                    MainStatus = CommonUtils.ResolvedEnum,
                    SubStatus = CommonUtils.TemporaryFixEnum
                },
                Planned = new Planned
                {
                    From = new DateTime(2019, 4, 9),
                    Period = CommonEnum.PlanPeriodsType.MORNING.ToString(),
                    Time = new Time
                    {
                        From = DateTime.Now,
                        To = DateTime.Now,
                    },
                    Till = new DateTime(2019, 9, 30)
                },
                StatusCode = new StatusCode
                {
                    Code = "C91",
                    Text = "This is text for status code"
                },
                WishDate = new DateTime(2019, 12, 15),
                Originator = "originator",
                Contractant = "contractant",
                IsReadonly = true,
                UpdateCount = 1,
                Prio3 = new Prio34
                {
                    Affected = new List<Affected>
                    {
                        new Affected
                        {
                            Contact = new Contact
                            {
                                PersonName = new PersonName
                                {
                                    FirstName = "Danh",
                                    Intercalation = "Huu",
                                    LastName = "Nguyen"
                                },
                                PhoneNumber = "0799063688",
                                AdditionalphoneNumber = "0829279791",
                                Email = "danh.nguyen@infodation.vn"
                            },
                            Department = new Department
                            {
                                Organisation = "CAIW",
                                Name = CommonEnum.Department.NOC.ToString(),
                                Email = new List<string>
                                {
                                    "a@gmail.com"
                                },
                                PhoneNo = new List<string>
                                {
                                    "0799063688"
                                }
                            },
                            Address = new Address
                            {
                                Street = "50 Le Thanh Ton",
                                HouseNumber = new HouseNumber
                                {
                                    Value = 55,
                                    Extension = ""
                                },
                                ZipCode = "8888EE",
                                Room = "1",
                                City = "Nha Trang",
                                Country = "Viet Nam"
                            }
                        }
                    },
                    Ftu = new List<string>
                    {
                        "1"
                    },
                    Closure = new Closure
                    {
                        Category = new Category
                        {
                            Level2 = 2,
                            Level3 = 3
                        },
                        Description = "description of closure"
                    },
                    Priority = "3",
                    Analysis = new Analysis
                    {
                        Code = new List<string>
                        {
                            "1"
                        }
                    },
                    DomainPermission = CommonUtils.CityRing1V_OUTAGE,
                    ProblemDescription = "prob for meassage three",
                    FiberCode = CommonEnum.FiberCode.FIBER_A.ToString(),
                    NetworkType = CommonEnum.NetworkType.FttH.ToString(),
                    TypeOfBuilding = "Building T03",
                    ThroughputDependency = true,
                    Attenuation = "10",
                    CableInfo = new List<CableInfo>
                    {
                        new CableInfo
                        {
                            CableId = "1",
                            CableType = "FttH"
                        }
                    },
                    Comment = new List<Comment>
                    {
                        new Comment
                        {
                            Party = "party",
                            Author = new Author
                            {
                                FirstName = "FirstName",
                                Intercalation = "Intercalation",
                                LastName = "LastName"
                            },
                            Source = new Source
                            {
                                Id = "CAIW",
                                SystemId = "CRS"
                            },
                            Created = new DateTime(2019, 6, 27),
                            Note = "Test CAIW Styx2 sender task AS from CRS adapter to CAIW CRS, Updated"
                        }
                    },
                    ExecutorEnd = new DateTime(2019, 6, 27)
                }
            };
        }

        public searchOneResponse GetSearchOneResponse(string status)
        {
            return new searchOneResponse
            {
                @return = new TsearchOneResult[]
                {
                    new TsearchOneResult
                    {
                        WFM_Status = status
                    }
                }
            };
        }
    }
}
