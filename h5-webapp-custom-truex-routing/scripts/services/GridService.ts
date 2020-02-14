/**
 * Utility service to design and control UI Grids used in the application
 */
module h5.application {

    export class GridService {

        static $inject = ["$filter", "$timeout", "StorageService", "languageService"];
        private baseGrid: IUIGrid;

        constructor(private $filter: h5.application.AppFilter, private $timeout: ng.ITimeoutService, private storageService: h5.application.StorageService, private languageService: h5.application.LanguageService) {
            this.init();
        }

        /**
        * Initialize a Grid object with default configurations to enable/disable features
        */
        private init() {
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
                exporterFieldCallback: (grid: any, row: any, col: any, value: any) => {
                    if (col.name.indexOf('Date') > 0) {
                        value = this.$filter('m3Date')(value, grid.appScope.appConfig.globalDateFormat);
                    }
                    return value;
                },
                exporterPdfCustomFormatter: (docDefinition: any) => {
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
                exporterPdfFooter: (currentPage: number, pageCount: number) => { return { text: 'Page ' + currentPage + ' of ' + pageCount, style: 'pageFooter' }; },
                exporterPdfTableStyle: { margin: [20, 30, 20, 30] },
                exporterPdfMaxGridWidth: 700,
                columnDefs: [{}],
                data: []
            };
        }

        /**
        * Get a copy of the base grid with default attributes
        */
        public getBaseGrid(): IUIGrid {
            return angular.copy(this.baseGrid);
        }

        /**
        * When called this function will adjust the UI Grid height based on the number of rows loaded
        * @param gridId the grid Id
        * @param noOfRows the number of rows in the grid
        * @param timeDelay the time delay to initiate resizing the grid
        * @param initialHeight the initial height to calculate the grid row(s) height, default is 150 px
        */
        public adjustGridHeight(gridId: string, noOfRows: number, timeDelay: number, initialHeight = 150) {
            noOfRows = (noOfRows < 1 ? 1 : noOfRows);
            this.$timeout(() => {
                let newHeight = noOfRows > 15 ? 600 : (initialHeight + noOfRows * 30);
                angular.element(document.getElementById(gridId)).css('height', newHeight + 'px');
            }, timeDelay);
        }

        /**
        * Save the current state of the UI Grid in the browser memory
        * @param gridId the grid Id
        */
        public saveGridState(gridId: string, gridApi: any) {
            let gridState = gridApi.saveState.save();
            this.storageService.setLocalData('h5.app.appName.gridState.' + gridId, gridState);
        }

        /**
        * Restore the last saved state of the UI Grid
        * @param gridId the grid Id
        */
        public restoreGridState(gridId: string, gridApi: any) {
            let gridState = this.storageService.getLocalData('h5.app.appName.gridState.' + gridId);
            if (gridState) {
                this.$timeout(() => {
                    gridApi.saveState.restore(undefined, gridState);
                }, 100);
            }
        }

        /**
        * Clear all the saved states of the UI Grids in the browser's storage
        */
        public clearGridStates() {
            let gridIds = ["sampleGrid1"];
            gridIds.forEach((gridId: string) => {
                this.storageService.removeLocalData('h5.app.appName.gridState.' + gridId);
            });

        }
        
        public getExplodedBomGrid(): IUIGrid {
            let explodedBomGrid: IUIGrid = angular.copy(this.baseGrid);
            //let footerCellTemplateNumString = "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\">{{ ( col.getAggregationValue() CUSTOM_FILTERS ) | number:2 }}</div>";
            explodedBomGrid.columnDefs = [
                { name: "PRNO", displayName: this.languageService.languageConstants.get('Final Prod #') },
                { name: "SEQN", displayName: this.languageService.languageConstants.get('Seq') },
                { name: "ITTY", displayName: this.languageService.languageConstants.get('Type') },
                { name: "PRN1", displayName: this.languageService.languageConstants.get('Product #') },
                //{ name: "MTNO", displayName: this.languageService.languageConstants.get('Item') },
                { name: "CNQT", displayName: this.languageService.languageConstants.get('Qty') },
                { name: "PEUN", displayName: this.languageService.languageConstants.get('Unit') }
                ];
                // exBomGrid.exporterCsvFilename = "exported_Bom.csv";
                // exBomGrid.exporterPdfFilename = "exported_Bom.pdf";
                explodedBomGrid.saveSelection = false;
                explodedBomGrid.multiSelect = false;
            return explodedBomGrid;
        }
        
        public getFinalProdSearchGrid(): IUIGrid {
            let finalProductSearchGrid: IUIGrid = angular.copy(this.baseGrid);
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
        }

        public getOpenMosGrid(): IUIGrid {
            let openMOsGrid: IUIGrid = angular.copy(this.baseGrid);

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
        }

        public getRoutingSheetGrid(): IUIGrid {
            let routingSheetGrid: IUIGrid = angular.copy(this.baseGrid);

            routingSheetGrid.columnDefs = [
                { name: "F1PK01", displayName: this.languageService.languageConstants.get('MO #') },
                { name: "F1PK03", displayName: this.languageService.languageConstants.get('Seq')  },
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

        }
    }

}