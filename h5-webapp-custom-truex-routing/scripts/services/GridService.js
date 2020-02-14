var h5;
(function (h5) {
    var application;
    (function (application) {
        var GridService = (function () {
            function GridService($filter, $timeout, storageService, languageService) {
                this.$filter = $filter;
                this.$timeout = $timeout;
                this.storageService = storageService;
                this.languageService = languageService;
                this.init();
            }
            GridService.prototype.init = function () {
                var _this = this;
                this.baseGrid = {
                    enableGridMenu: true,
                    enableRowSelection: true,
                    enableFullRowSelection: false,
                    modifierKeysToMultiSelect: true,
                    modifierKeysToMultiSelectCells: true,
                    enableRowHeaderSelection: true,
                    enableSelectAll: true,
                    showGridFooter: true,
                    showColumnFooter: true,
                    enableColumnMenus: true,
                    enableSorting: true,
                    enableFiltering: true,
                    flatEntityAccess: true,
                    fastWatch: true,
                    scrollDebounce: 500,
                    wheelScrollThrottle: 500,
                    virtualizationThreshold: 10,
                    exporterCsvFilename: "grid_data.csv",
                    exporterPdfFilename: "grid_data.pdf",
                    exporterFieldCallback: function (grid, row, col, value) {
                        if (col.name.indexOf('Date') > 0) {
                            value = _this.$filter('m3Date')(value, grid.appScope.appConfig.globalDateFormat);
                        }
                        return value;
                    },
                    exporterPdfCustomFormatter: function (docDefinition) {
                        docDefinition.styles.pageHeader = { fontSize: 10, italics: true, alignment: 'left', margin: 10 };
                        docDefinition.styles.pageFooter = { fontSize: 10, italics: true, alignment: 'right', margin: 10 };
                        return docDefinition;
                    },
                    exporterPdfDefaultStyle: { fontSize: 9 },
                    exporterPdfHeader: {
                        columns: [
                            { text: 'H5 Application', style: 'pageHeader' }
                        ]
                    },
                    exporterPdfFooter: function (currentPage, pageCount) { return { text: 'Page ' + currentPage + ' of ' + pageCount, style: 'pageFooter' }; },
                    exporterPdfTableStyle: { margin: [20, 30, 20, 30] },
                    exporterPdfMaxGridWidth: 700,
                    columnDefs: [{}],
                    data: []
                };
            };
            GridService.prototype.getBaseGrid = function () {
                return angular.copy(this.baseGrid);
            };
            GridService.prototype.adjustGridHeight = function (gridId, noOfRows, timeDelay, initialHeight) {
                if (initialHeight === void 0) { initialHeight = 150; }
                noOfRows = (noOfRows < 1 ? 1 : noOfRows);
                this.$timeout(function () {
                    var newHeight = noOfRows > 15 ? 600 : (initialHeight + noOfRows * 30);
                    angular.element(document.getElementById(gridId)).css('height', newHeight + 'px');
                }, timeDelay);
            };
            GridService.prototype.saveGridState = function (gridId, gridApi) {
                var gridState = gridApi.saveState.save();
                this.storageService.setLocalData('h5.app.appName.gridState.' + gridId, gridState);
            };
            GridService.prototype.restoreGridState = function (gridId, gridApi) {
                var gridState = this.storageService.getLocalData('h5.app.appName.gridState.' + gridId);
                if (gridState) {
                    this.$timeout(function () {
                        gridApi.saveState.restore(undefined, gridState);
                    }, 100);
                }
            };
            GridService.prototype.clearGridStates = function () {
                var _this = this;
                var gridIds = ["sampleGrid1"];
                gridIds.forEach(function (gridId) {
                    _this.storageService.removeLocalData('h5.app.appName.gridState.' + gridId);
                });
            };
            GridService.prototype.getExplodedBomGrid = function () {
                var explodedBomGrid = angular.copy(this.baseGrid);
                explodedBomGrid.columnDefs = [
                    { name: "PRNO", displayName: this.languageService.languageConstants.get('Final Prod #') },
                    { name: "SEQN", displayName: this.languageService.languageConstants.get('Seq') },
                    { name: "ITTY", displayName: this.languageService.languageConstants.get('Type') },
                    { name: "PRN1", displayName: this.languageService.languageConstants.get('Product #') },
                    { name: "CNQT", displayName: this.languageService.languageConstants.get('Qty') },
                    { name: "PEUN", displayName: this.languageService.languageConstants.get('Unit') }
                ];
                explodedBomGrid.saveSelection = false;
                explodedBomGrid.multiSelect = false;
                return explodedBomGrid;
            };
            GridService.prototype.getFinalProdSearchGrid = function () {
                var finalProductSearchGrid = angular.copy(this.baseGrid);
                finalProductSearchGrid.columnDefs = [
                    { name: "VHMFNO", displayName: this.languageService.languageConstants.get('MO #') },
                    { name: "VHPRNO", displayName: this.languageService.languageConstants.get('Product #') },
                    { name: "VHORQT", displayName: this.languageService.languageConstants.get('Order Qty') },
                    { name: "VHMAUN", displayName: this.languageService.languageConstants.get('UOM') },
                    { name: "VHWHST", displayName: this.languageService.languageConstants.get('MO Status') },
                    { name: "F1PK02", displayName: this.languageService.languageConstants.get('Routing Sheet') }
                ];
                finalProductSearchGrid.saveSelection = false;
                return finalProductSearchGrid;
            };
            GridService.prototype.getOpenMosGrid = function () {
                var openMOsGrid = angular.copy(this.baseGrid);
                openMOsGrid.columnDefs = [
                    { name: "VHMFNO", displayName: this.languageService.languageConstants.get('MO #') },
                    { name: "VHPRNO", displayName: this.languageService.languageConstants.get('Product #') },
                    { name: "VHORQT", displayName: this.languageService.languageConstants.get('Order Qty') },
                    { name: "VHMAUN", displayName: this.languageService.languageConstants.get('UOM') },
                    { name: "VHWHST", displayName: this.languageService.languageConstants.get('MO Status') },
                    { name: "F1PK02", displayName: this.languageService.languageConstants.get('Routing Sheet') }
                ];
                openMOsGrid.saveSelection = false;
                return openMOsGrid;
            };
            GridService.prototype.getRoutingSheetGrid = function () {
                var routingSheetGrid = angular.copy(this.baseGrid);
                routingSheetGrid.columnDefs = [
                    { name: "F1PK01", displayName: this.languageService.languageConstants.get('MO #') },
                    { name: "F1PK03", displayName: this.languageService.languageConstants.get('Seq') },
                    { name: "F1A030", displayName: this.languageService.languageConstants.get('Item No') },
                    { name: "F1A530", displayName: this.languageService.languageConstants.get('Item Name') },
                    { name: "F1A130", displayName: this.languageService.languageConstants.get('U/M') },
                    { name: "F1A230", displayName: this.languageService.languageConstants.get('Work Center 1') },
                    { name: "F1A330", displayName: this.languageService.languageConstants.get('Work Center 2') },
                    { name: "F1N096", displayName: this.languageService.languageConstants.get('Quantity') },
                    { name: "F1N396", displayName: this.languageService.languageConstants.get('W/C OP #1') },
                    { name: "F1N496", displayName: this.languageService.languageConstants.get('W/C OP #2') },
                    { name: "F1DAT1", displayName: this.languageService.languageConstants.get('Start Date') }
                ];
                routingSheetGrid.saveSelection = false;
                return routingSheetGrid;
            };
            GridService.$inject = ["$filter", "$timeout", "StorageService", "languageService"];
            return GridService;
        }());
        application.GridService = GridService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
