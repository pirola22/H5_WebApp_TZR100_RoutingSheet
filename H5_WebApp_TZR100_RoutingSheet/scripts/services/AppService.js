var h5;
(function (h5) {
    var application;
    (function (application) {
        var AppService = (function () {
            function AppService(restService, $filter, $q) {
                this.restService = restService;
                this.$filter = $filter;
                this.$q = $q;
            }
            AppService.prototype.getAuthority = function (company, division, m3User, programName, charAt) {
                var _this = this;
                var request = {
                    DIVI: division,
                    USID: m3User,
                    PGNM: programName
                };
                return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30", request).then(function (val) {
                    if (angular.equals([], val.items)) {
                        request.DIVI = "";
                        return _this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30", request).then(function (val) {
                            if (angular.equals([], val.items)) {
                                return false;
                            }
                            else {
                                var test = val.item.ALO;
                                if (charAt < test.length && '1' == test.charAt(charAt)) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                        });
                    }
                    else {
                        var test = val.item.ALO;
                        if (charAt < test.length && '1' == test.charAt(charAt)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                });
            };
            AppService.prototype.getDivisionList = function (company, division) {
                var requestData = {
                    CONO: company,
                    DIVI: division
                };
                return this.restService.executeM3MIRestService("MNS100MI", "LstDivisions", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getWarehouseList = function (company) {
                var requestData = {
                    CONO: company
                };
                return this.restService.executeM3MIRestService("MMS005MI", "LstWarehouses", requestData, 0).then(function (val) { return val; });
            };
            AppService.prototype.getWarehouse = function (whlo) {
                var requestData = {
                    WHLO: whlo
                };
                return this.restService.executeM3MIRestService("MMS005MI", "GetWarehouse", requestData, 0).then(function (val) { return val; });
            };
            AppService.prototype.getFacilityList = function (company, division) {
                var requestData = {
                    CONO: company,
                    DIVI: division
                };
                return this.restService.executeM3MIRestService("CRS008MI", "ListFacility", requestData).then(function (val) { return val; });
            };
            AppService.prototype.lstRoutingMOs = function (fromStatus, toStatus, fromProduct, toProduct, facility) {
                var requestData = {
                    F_WHST: fromStatus,
                    T_WHST: toStatus,
                    F_PRNO: fromProduct,
                    T_PRNO: toProduct,
                    VHFACI: facility
                };
                return this.restService.executeM3MIRestService("CMS100MI", "LstROUTING_MOS", requestData).then(function (val) { return val; });
            };
            AppService.prototype.selMPDSUM = function (faclity, structureType, Product) {
                var requestData = {
                    FACI: faclity,
                    STRT: structureType,
                    PRNO: Product,
                };
                return this.restService.executeM3MIRestService("MDBREADMI", "SelMPDSUM00", requestData).then(function (val) { return val; });
            };
            AppService.prototype.addMWOHEDext = function (VHMFNO, RoutingSheetNo, SeqNo, VHWHLO, MTNO, VHORQA, V1OPDS, V2OPDS, VHSTRT, MMITDS, finalItemNo, finalItemName, V1PLGR, V2PLGR, VHORQT, finalMONumber, V1OPNO, V2OPNO, V1WOSQ, V2WOSQ) {
                var requestData = {
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
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "AddFieldValue", requestData).then(function (val) { return val; });
            };
            AppService.prototype.deleteMWOHEDext = function (VHMFNO, RoutingSheetNo, SeqNo, VHWHLO) {
                var requestData = {
                    FILE: "MWOHED",
                    PK01: VHMFNO,
                    PK02: RoutingSheetNo,
                    PK03: SeqNo,
                    PK04: VHWHLO
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "DelFieldValue", requestData).then(function (val) { return val; });
            };
            AppService.prototype.LstRoutingSheet = function (RoutingSheetNo) {
                var requestData = {
                    F_PK02: RoutingSheetNo,
                    T_PK02: RoutingSheetNo,
                    F1FILE: "MWOHED"
                };
                return this.restService.executeM3MIRestService("CMS100MI", "LstRoutingSheet", requestData).then(function (val) { return val; });
            };
            AppService.prototype.GetItems = function (itno) {
                var requestData = {
                    ITNO: itno
                };
                return this.restService.executeM3MIRestService("MMS200MI", "Get", requestData).then(function (val) { return val; });
            };
            AppService.prototype.GetMo = function (faci, prno, mfno) {
                var requestData = {
                    FACI: faci,
                    PRNO: prno,
                    MFNO: mfno
                };
                return this.restService.executeM3MIRestService("PMS100MI", "Get", requestData).then(function (val) { return val; });
            };
            AppService.prototype.searchItems = function (searchQuery, maxRecs) {
                var requestData = {
                    SQRY: searchQuery
                };
                return this.restService.executeM3MIRestService("MMS200MI", "SearchItem", requestData, maxRecs).then(function (val) { return val; });
            };
            AppService.prototype.lstPrinters = function () {
                var requestData = {};
                return this.restService.executeM3MIRestService("CRS290MI", "LstPrinters", requestData).then(function (val) { return val; });
            };
            AppService.prototype.updPrintFile = function (user, printer) {
                var requestData = {
                    PRTF: "ROUTINGPF",
                    USID: user,
                    MEDC: "*PRT",
                    SEQN: 1,
                    DEV1: printer
                };
                return this.restService.executeM3MIRestService("MNS205MI", "Upd", requestData).then(function (val) { return val; });
            };
            AppService.prototype.addPrintFile = function (user, printer) {
                var requestData = {
                    PRTF: "ROUTINGPF",
                    USID: user,
                    MEDC: "*PRT",
                    DEV1: printer
                };
                return this.restService.executeM3MIRestService("MNS205MI", "Add", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getPrintFile = function (user) {
                var requestData = {
                    PRTF: "ROUTINGPF",
                    USID: user,
                    MEDC: "*PRT",
                    SEQN: 1
                };
                return this.restService.executeM3MIRestService("MNS205MI", "Get", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getPrintAddress = function (printer) {
                var requestData = {
                    DEV: printer
                };
                return this.restService.executeM3MIRestService("CRS290MI", "GetPrinter", requestData).then(function (val) { return val; });
            };
            AppService.prototype.lstComponents = function (facility, product) {
                var requestData = {
                    PMFACI: facility,
                    PMPRNO: product,
                    PMSTRT: "001"
                };
                return this.restService.executeM3MIRestService("CMS100MI", "Lst_Components", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getIONURL = function (transaction, port) {
                var requestData = {
                    F_PK02: transaction,
                    T_PK02: transaction,
                    F_PK03: port,
                    T_PK03: port,
                    F3KPID: "IONCON"
                };
                return this.restService.executeM3MIRestService("CMS100MI", "LstIONCON", requestData).then(function (val) { return val; });
            };
            AppService.$inject = ["RestService", "$filter", "$q"];
            AppService.printFile = "ROUTINGPF";
            return AppService;
        }());
        application.AppService = AppService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
