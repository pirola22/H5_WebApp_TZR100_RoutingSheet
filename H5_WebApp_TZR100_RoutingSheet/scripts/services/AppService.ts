/**
 * Service class to implement functions to retrieve, push data via Rest API with generic business logics if required. Will be used by the controller.
 */
module h5.application {

    export interface IAppService {
        getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean>;
        getDivisionList(company: string, division: string): ng.IPromise<M3.IMIResponse>;
        getWarehouseList(company: string): ng.IPromise<M3.IMIResponse>;
        getFacilityList(company: string, division: string): ng.IPromise<M3.IMIResponse>;
        selMPDSUM(faclity: string, structureType: string, Product: string): ng.IPromise<M3.IMIResponse>;
        lstRoutingMOs(fromStatus: string, toStatus: string, fromProduct: string, toProduct: string, facility: string): ng.IPromise<M3.IMIResponse>;
        addMWOHEDext(VHMFNO: string, RoutingSheetNo: string, SeqNo: string, VHWHLO: string,
            VHPRNO: string, VHORQA: string, V1OPDS: string, V2OPDS: string, VHSTRT: string,
            MMITDS: string, finalItemNo: string, finalItemName: string, V1PLGR: string,
            V2PLGR: string, VHORQT: string, finalMONumber: string, V1OPNO: string,
            V2OPNO: string, V1WOSQ: string, V2WOSQ: string
        ): ng.IPromise<M3.IMIResponse>;    
        deleteMWOHEDext(VHMFNO: string, RoutingSheetNo: string, SeqNo: string, VHWHLO: string): ng.IPromise<M3.IMIResponse>;
        LstRoutingSheet(RoutingSheetNo: String): ng.IPromise<M3.IMIResponse>;
        GetItems(itno: string): ng.IPromise<M3.IMIResponse>;
        GetMo(faci: string, prno: string, mfno: string): ng.IPromise<M3.IMIResponse>;
        searchItems(searchQuery: string, maxRecs: number): ng.IPromise<M3.IMIResponse>;
        getWarehouse(whlo: string): ng.IPromise<M3.IMIResponse>;
        getPrintFile(user: string):ng.IPromise<M3.IMIResponse>;
        updPrintFile(user: string, printer: string): ng.IPromise<M3.IMIResponse>;
        addPrintFile(user: string, printer: string): ng.IPromise<M3.IMIResponse>;
        getPrintAddress(printer: string):ng.IPromise<M3.IMIResponse>;
        lstPrinters(): ng.IPromise<M3.IMIResponse>;
        lstComponents(facility: string, product: string): ng.IPromise<M3.IMIResponse>;
        getIONURL(port: string, transaction: string) : ng.IPromise<M3.IMIResponse>
    }

    export class AppService implements IAppService {

        static $inject = ["RestService", "$filter", "$q"];
        
        static printFile = "ROUTINGPF"

        constructor(private restService: h5.application.IRestService, private $filter: h5.application.AppFilter, private $q: ng.IQService) {
        }

        public getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean> {
            let request = {
                DIVI: division,
                USID: m3User,
                PGNM: programName
            };

            return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30", request).then((val: M3.IMIResponse) => {
                if (angular.equals([], val.items)) {
                    request.DIVI = "";

                    return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30", request).then((val: M3.IMIResponse) => {

                        if (angular.equals([], val.items)) {

                            return false;
                        } else {
                            let test = val.item.ALO;
                            if (charAt < test.length && '1' == test.charAt(charAt)) {
                                return true;
                            } else {
                                return false;
                            }

                        }
                    });
                } else {

                    let test = val.item.ALO;
                    if (charAt < test.length && '1' == test.charAt(charAt)) {
                        return true;
                    } else {

                        return false;
                    }
                }
            });
        }


        public getDivisionList(company: string, division: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                DIVI: division
            };
            return this.restService.executeM3MIRestService("MNS100MI", "LstDivisions", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public getWarehouseList(company: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company
            };
            return this.restService.executeM3MIRestService("MMS005MI", "LstWarehouses", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }

        public getWarehouse(whlo: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                WHLO: whlo
            };
            return this.restService.executeM3MIRestService("MMS005MI", "GetWarehouse", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }

        public getFacilityList(company: string, division: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                DIVI: division
            };
            return this.restService.executeM3MIRestService("CRS008MI", "ListFacility", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public lstRoutingMOs(fromStatus: string, toStatus: string, fromProduct: string, toProduct: string, facility: string) {
            let requestData = {
                F_WHST: fromStatus,
                T_WHST: toStatus,
                F_PRNO: fromProduct,
                T_PRNO: toProduct,
                VHFACI: facility
            }
            return this.restService.executeM3MIRestService("CMS100MI", "LstROUTING_MOS", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public selMPDSUM(faclity: string, structureType: string, Product: string) {
            let requestData = {
                FACI: faclity,
                STRT: structureType,
                PRNO: Product,
            }
            return this.restService.executeM3MIRestService("MDBREADMI", "SelMPDSUM00", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public addMWOHEDext(VHMFNO: string, RoutingSheetNo: string, SeqNo: string, VHWHLO: string,
            MTNO: string, VHORQA: string, V1OPDS: string, V2OPDS: string, VHSTRT: string,
            MMITDS: string, finalItemNo: string, finalItemName: string, V1PLGR: string,
            V2PLGR: string, VHORQT: string, finalMONumber: string, V1OPNO: string,
            V2OPNO: string, V1WOSQ: string, V2WOSQ: string
        ) {
            let requestData = {
                FILE: "MWOHED",
                VEXI: 1,
                PK01: VHMFNO,
                PK02: RoutingSheetNo,
                PK03: SeqNo,
                PK04: VHWHLO,
                A030: MTNO,
                A130: VHORQA,
                A230: V1OPDS,
                A330: V2OPDS,
                A430: VHSTRT,
                A530: MMITDS,
                A630: finalItemNo,
                A730: finalItemName,
                A830: V1PLGR,
                A930: V2PLGR,
                N096: VHORQT,
                N296: finalMONumber,
                N396: V1OPNO,
                N496: V2OPNO,
                N596: V1WOSQ,
                N696: V2WOSQ
            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "AddFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        

        public deleteMWOHEDext(VHMFNO: string, RoutingSheetNo: string, SeqNo: string, VHWHLO: string) {
            let requestData = {
                FILE: "MWOHED",
                PK01: VHMFNO,
                PK02: RoutingSheetNo,
                PK03: SeqNo,
                PK04: VHWHLO
            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "DelFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public LstRoutingSheet(RoutingSheetNo: String) {
            let requestData = {
                F_PK02: RoutingSheetNo,
                T_PK02: RoutingSheetNo,
                F1FILE: "MWOHED"
                
                
                
            }
            
            return this.restService.executeM3MIRestService("CMS100MI", "LstRoutingSheet", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public GetItems(itno: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ITNO: itno
            };
            return this.restService.executeM3MIRestService("MMS200MI", "Get", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public GetMo(faci: string, prno: string, mfno: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                FACI: faci,
                PRNO: prno,
                MFNO: mfno
            }

            return this.restService.executeM3MIRestService("PMS100MI", "Get", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public searchItems(searchQuery: string, maxRecs: number): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SQRY: searchQuery
            };
            return this.restService.executeM3MIRestService("MMS200MI", "SearchItem", requestData, maxRecs).then((val: M3.IMIResponse) => { return val; });
        }
        
        public lstPrinters(): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                
            }
            return this.restService.executeM3MIRestService("CRS290MI", "LstPrinters", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public updPrintFile(user: string, printer: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                PRTF: "ROUTINGPF",
                USID: user,
                MEDC:"*PRT",
                SEQN: 1,
                
                DEV1: printer
            };
            return this.restService.executeM3MIRestService("MNS205MI", "Upd", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public addPrintFile(user: string, printer: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                PRTF: "ROUTINGPF",
                USID: user,
                MEDC:"*PRT",

                
                DEV1: printer
            };
            return this.restService.executeM3MIRestService("MNS205MI", "Add", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        
        public getPrintFile(user: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                PRTF: "ROUTINGPF",
                USID: user,
                MEDC:"*PRT",
                SEQN: 1
            };
            return this.restService.executeM3MIRestService("MNS205MI", "Get", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public getPrintAddress(printer : string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                DEV: printer

            };
            return this.restService.executeM3MIRestService("CRS290MI", "GetPrinter", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public lstComponents(facility: string, product: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                PMFACI: facility,
                PMPRNO:product,
                PMSTRT: "001"
            };
            return this.restService.executeM3MIRestService("CMS100MI", "Lst_Components", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        
        public getIONURL(transaction: string, port: string) : ng.IPromise<M3.IMIResponse>{
            let requestData = {
                F_PK02: transaction,
                T_PK02: transaction,
                F_PK03: port,
                T_PK03: port,
                F3KPID: "IONCON"
                
            }
            return this.restService.executeM3MIRestService("CMS100MI", "LstIONCON", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
    }
}