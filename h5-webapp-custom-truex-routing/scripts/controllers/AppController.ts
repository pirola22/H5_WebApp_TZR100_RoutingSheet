/**
 * Application controller which will have the global scope functions and models and can be accessed through out the application. 
 * Functions and models shared across one or more modules should be implemented here. 
 * For independent modules create module specific controllers and declare it as a nested controller, i.e under the module specific page.
 */
//git test
//git test

module h5.application {

    export class AppController {

        //Array of strings in this property represent names of services to be injected into this controller. Note: The services are declared in app.ts
        static $inject = ["$scope", "configService", "AppService", "RestService", "StorageService", "GridService", "m3UserService", "languageService", "$uibModal", "$interval", "$timeout", "$filter", "$q", "$window", "m3FormService", "$location","$http", "FileSaver"];

        private globalConfig: IGlobalConfiguration;

        
        constructor(private scope: IAppScope, private configService: h5.application.ConfigService, private appService: h5.application.IAppService, private restService: h5.application.RestService, private storageService: h5.application.StorageService, private gridService: h5.application.GridService, private userService: M3.IUserService, private languageService: h5.application.LanguageService, private $uibModal: ng.ui.bootstrap.IModalService, private $interval: ng.IIntervalService, private $timeout: ng.ITimeoutService, private $filter: h5.application.AppFilter, private $q: ng.IQService, private $window: ng.IWindowService, private formService: M3.FormService, private $location: ng.ILocationService , private $http : ng.IHttpService , private FileSaver: any) {
            this.init();
        }

        /**
        * The initialize function which will be called when the controller is created
        */
        private init() {
            this.scope.appReady = false;
            this.scope.loadingData = false;
            this.scope.statusBar = [];
            this.scope.statusBarIsCollapsed = true;
            this.scope.statusBarVisible = true;

            this.languageService.getAppLanguage().then((val: Odin.ILanguage) => {
                this.scope.languageConstants = this.languageService.languageConstants;
                this.initApplication();
            }, (errorResponse: any) => {
                Odin.Log.error("Error getting language constants " + errorResponse);
                this.scope.statusBar.push({ message: "Error getting language constants" + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
            if (this.$window.innerWidth <= 768) {
                this.scope.showSideNavLabel = false;
                this.scope.showSideNav = false;
            } else {
                this.scope.showSideNavLabel = true;
                this.scope.showSideNav = true;
            }
        }

        /**
        * This function will have any application specific initialization functions
        */
        private initApplication() {
            this.initGlobalConfig();
            this.initAppScope();
            this.initUIGrids();
            this.initScopeFunctions();
            this.$timeout(() => { this.scope.appReady = true; }, 5000);
            this.initApplicationConstants();

        }

        /**
        * This function will call the config service and set the global configuration model object with the configured settings 
        */
        private initGlobalConfig() {
            this.configService.getGlobalConfig().then((configData: any) => {
                this.scope.globalConfig = configData;
                this.initLanguage();
                this.initTheme();
                this.getUserContext();
                
                
                this.initModule();
            }, (errorResponse: any) => {
                Odin.Log.error("Error while getting global configuration " + errorResponse);
                this.scope.statusBar.push({ message: "Error while getting global configuration " + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
        }

        /**
        * Codes and function calls to initialize Application Scope model
        */
        private initAppScope() {
            //Initialize data objects
            this.scope.transactionStatus = {
                appConfig: false
            };
            this.scope["errorMessages"] = [];
            this.scope.infiniteScroll = {
                numToAdd: 20,
                currentItems: 20
            };
            this.scope.themes = [
                { themeId: 1, themeIcon: 'leanswiftchartreuse.png', themeName: "Theme1Name", panel: "panel-h5-theme-LC", navBar: "navbar-h5-theme-LC", sideNav: "sideNav-h5-theme-LC", button: "h5Button-h5-theme-LC", h5Grid: "h5Grid-h5-theme-LC", h5Dropdown: "h5Dropdown-h5-theme-LC", navTabs: "navtabs-h5-theme-LC", active: false, available: true },
                { themeId: 2, themeIcon: 'royalinfor.png', themeName: "Theme2Name", panel: "panel-h5-theme-RI", navBar: "navbar-h5-theme-RI", sideNav: "sideNav-h5-theme-RI", button: "h5Button-h5-theme-RI", h5Grid: "h5Grid-h5-theme-RI", h5Dropdown: "h5Dropdown-h5-theme-RI", navTabs: "navtabs-h5-theme-RI", active: false, available: true },
                { themeId: 3, themeIcon: 'summersmoothe.png', themeName: "Theme3Name", panel: "panel-h5-theme-SS", navBar: "navbar-h5-theme-SS", sideNav: "sideNav-h5-theme-SS", button: "h5Button-h5-theme-SS", h5Grid: "h5Grid-h5-theme-SS", h5Dropdown: "h5Dropdown-h5-theme-SS", navTabs: "navtabs-h5-theme-SS", active: false, available: true },
                { themeId: 4, themeIcon: 'pumkinspice.png', themeName: "Theme4Name", panel: "panel-h5-theme-PS", navBar: "navbar-h5-theme-PS", sideNav: "sideNav-h5-theme-PS", button: "h5Button-h5-theme-PS", h5Grid: "h5Grid-h5-theme-PS", h5Dropdown: "h5Dropdown-h5-theme-PS", navTabs: "navtabs-h5-theme-PS", active: false, available: true },
                { themeId: 5, themeIcon: 'visionimpared.png', themeName: "Theme5Name", panel: "panel-h5-theme-VI", navBar: "navbar-h5-theme-VI", sideNav: "sideNav-h5-theme-VI", button: "h5Button-h5-theme-VI", h5Grid: "h5Grid-h5-theme-VI", h5Dropdown: "h5Dropdown-h5-theme-VI", navTabs: "navtabs-h5-theme-VI", active: false, available: true },
                { themeId: 6, themeIcon: 'lipstickjungle.png', themeName: "Theme6Name", panel: "panel-h5-theme-LJ", navBar: "navbar-h5-theme-LJ", sideNav: "sideNav-h5-theme-LJ", button: "h5Button-h5-theme-LJ", h5Grid: "h5Grid-h5-theme-LJ", h5Dropdown: "h5Dropdown-h5-theme-LJ", navTabs: "navtabs-h5-theme-LJ", active: false, available: true },
                { themeId: 7, themeIcon: 'silverlining.png', themeName: "Theme7Name", panel: "panel-h5-theme-SL", navBar: "navbar-h5-theme-SL", sideNav: "sideNav-h5-theme-SL", button: "h5Button-h5-theme-SL", h5Grid: "h5Grid-h5-theme-SL", h5Dropdown: "h5Dropdown-h5-theme-SL", navTabs: "navtabs-h5-theme-SL", active: false, available: true },
                { themeId: 8, themeIcon: 'steelclouds.png', themeName: "Theme8Name", panel: "panel-h5-theme-SC", navBar: "navbar-h5-theme-SC", sideNav: "sideNav-h5-theme-SC", button: "h5Button-h5-theme-SC", h5Grid: "h5Grid-h5-theme-SC", h5Dropdown: "h5Dropdown-h5-theme-SC", navTabs: "navtabs-h5-theme-SC", active: false, available: true }
            ];
            this.scope.textures = [
                { textureId: 1, textureIcon: 'diamond.png', textureName: "Wallpaper1Name", appBG: "h5-texture-one", active: false, available: true },
                { textureId: 2, textureIcon: 'grid.png', textureName: "Wallpaper2Name", appBG: "h5-texture-two", active: false, available: true },
                { textureId: 3, textureIcon: 'linen.png', textureName: "Wallpaper3Name", appBG: "h5-texture-three", active: false, available: true },
                { textureId: 4, textureIcon: 'tiles.png', textureName: "Wallpaper4Name", appBG: "h5-texture-four", active: false, available: true },
                { textureId: 5, textureIcon: 'wood.png', textureName: "Wallpaper5Name", appBG: "h5-texture-five", active: false, available: true }
            ];
            this.scope.supportedLanguages = [{ officialTranslations: false, languageCode: "ar-AR", active: false, available: true }, { officialTranslations: false, languageCode: "cs-CZ", active: false, available: true },
                { officialTranslations: false, languageCode: "da-DK", active: false, available: true }, { officialTranslations: false, languageCode: "de-DE", active: false, available: true },
                { officialTranslations: false, languageCode: "el-GR", active: false, available: true }, { officialTranslations: true, languageCode: "en-US", active: true, available: true },
                { officialTranslations: false, languageCode: "es-ES", active: false, available: true }, { officialTranslations: false, languageCode: "fi-FI", active: false, available: true },
                { officialTranslations: true, languageCode: "fr-FR", active: false, available: true }, { officialTranslations: false, languageCode: "he-IL", active: false, available: true },
                { officialTranslations: false, languageCode: "hu-HU", active: false, available: true }, { officialTranslations: false, languageCode: "it-IT", active: false, available: true },
                { officialTranslations: false, languageCode: "ja-JP", active: false, available: true }, { officialTranslations: false, languageCode: "nb-NO", active: false, available: true },
                { officialTranslations: false, languageCode: "nl-NL", active: false, available: true }, { officialTranslations: false, languageCode: "pl-PL", active: false, available: true },
                { officialTranslations: false, languageCode: "pt-PT", active: false, available: true }, { officialTranslations: false, languageCode: "ru-RU", active: false, available: true },
                { officialTranslations: true, languageCode: "sv-SE", active: false, available: true }, { officialTranslations: false, languageCode: "tr-TR", active: false, available: true },
                { officialTranslations: false, languageCode: "zh-CN", active: false, available: true }, { officialTranslations: false, languageCode: "ta-IN", active: false, available: true }
            ];
            this.scope.statusBarMessagetype = { Information: 0, Warning: 1, Error: 2 };
            this.scope.views = {
                h5Application: { url: "views/Application.html" },
                routing: {url: "views/Routing.html"},
                errorModule: { url: "views/Error.html" }
            };
            this.scope.modules = [
                { moduleId: 1, activeIcon: '', inactiveIcon: '', heading: 'Routing Application', content: this.scope.views.routing.url, active: true, available: true }
            ];
            this.scope.appConfig = {};
            this.scope.userContext = new M3.UserContext();
            this.scope["dateRef"] = new Date();

            //Function calls which initialize module specific data objects
            this.initGlobalSelection();
            this.initRouting();
        }

        /**
        * Initialize Global Selection model
        */
        private initGlobalSelection() {
            this.scope.globalSelection = {
                reload: true,
                transactionStatus: {
                 
                }
            };
        }

        /**
        * Initialize the Sample Module 1 model
        */
        private initRouting() {
            this.scope.routing = {
                reload: true,
                explodedBomGrid: {},
                
                openMOsGrid: {},
                
                routingSheetGrid: {},
                
                finalProductSearchGrid: {},

                openMOsGridData: [],

                warehouse: "",
                
                warehouseDetails: [],
                
                sequence: 0 ,
                
                downloadXML: false,
                
                sendEmail: true,
                
                printerSetup:{
                    printers: [],
                    updatePrintFile: false,
                },
                
                 printer:{
                    printer : "",
                    printerAddress : "",
                    printFile: "",
                    user: ""
                },
                
                transactionStatus: {
                    getPrintFile: false,
                    updPrintFile: false,
                    addPrintFile: false,
                    getPrintAddress: false,
                    getPrinters: false,
                    lstRoutingMOs: false,
                    lstComponents: false,
                    selMPDSUM: false,
                    addMWOHEDext: false,
                    deleteMWOHEDext: false, 
                    lstRoutingSheet: false,
                    GetMo: false,
                    GetItem: false,
                    GetWarehouse: false,
                    LstIONCON: false
                },

                explodedBOM: {
                    finalMO: "",
                    facility: "",
                    structureType: "",
                    finalProduct: "",
                    selectedItem: [],
                    selectedItemDetails:[]
                },

                openMos: {
                    facility: "",
                    product: "",
                    selectedItems: [],
                    routingSheetNumber:""
                },

                routingSheet: {
                    facility: "",
                    structureType: "",
                    finalProduct: "",
                    finalMO: "",
                    routingSheetNumber: "",
                    selectedItems: [], 
                    data: [],
                    itemComponents : [],
                    responsible: "",
                    startDate: "",
                    status :0,
                    isOpen: true,
                    numberOfCopies: 1
                },

                finalProductSearch: {
                    facility: "",
                    finalProduct: "",
                    moFromStatus: "",
                    moToStatus: "",
                    selectedItem: []
                }
            };
        }

        /**
        * Initialize the application constants/labels
        */
        private initApplicationConstants() {
            //Add the Constants, Labels, Options which are not need to be hard-coded and used in the application
        }

        /**
        * Initialize the binding of controller function mapping with the module scope
        */
        private initScopeFunctions() {
            //Add function binding to the scope models which are required to access from grid scope
        }

        /**
        * Initialize UI grids objects defined in all modules
        */
        private initUIGrids() {
            //Initialize the grid objects via gridService
            this.scope.routing.explodedBomGrid = this.gridService.getExplodedBomGrid();
            this.scope.routing.openMOsGrid = this.gridService.getOpenMosGrid();
            this.scope.routing.routingSheetGrid = this.gridService.getRoutingSheetGrid();
            this.scope.routing.finalProductSearchGrid = this.gridService.getFinalProdSearchGrid();
            
            
            
            this.initUIGridsOnRegisterApi();
            
            
            
        }

        /**
        * Initialize UI Grid On Register API if required
        */
        private initUIGridsOnRegisterApi() {
            //Initialize the onRegisterApi with the callback functions associated with grid events
            this.scope.routing.explodedBomGrid.onRegisterApi = (gridApi)  => {
                this.scope.routing.explodedBomGrid.gridApi = gridApi;
                this.gridService.adjustGridHeight("explodedBomGrid", this.scope.routing.explodedBomGrid.data.length, 500);

                gridApi.core.on.renderingComplete(this.scope, (handler: any) => { this.gridService.restoreGridState("explodedBomGrid", gridApi); });

                gridApi.core.on.sortChanged(this.scope, (handler: any) => { this.gridService.saveGridState("explodedBomGrid", gridApi); });
                gridApi.core.on.columnVisibilityChanged(this.scope, (handler: any) => { this.gridService.saveGridState("explodedBomGrid", gridApi); });
                gridApi.core.on.filterChanged(this.scope, (handler: any) => { this.gridService.saveGridState("explodedBomGrid", gridApi); });
                gridApi.colMovable.on.columnPositionChanged(this.scope, (handler: any) => { this.gridService.saveGridState("explodedBomGrid", gridApi); });
                gridApi.colResizable.on.columnSizeChanged(this.scope, (handler: any) => { this.gridService.saveGridState("explodedBomGrid", gridApi); });

                gridApi.cellNav.on.viewPortKeyDown(this.scope, (event: any) => {
                    if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                        let cells = gridApi.cellNav.getCurrentSelection();
                        this.copyCellContentToClipBoard(cells);
                    }
                });

                gridApi.selection.on.rowSelectionChanged( this.scope, (row:any) => {
                     this.exBomRowSelected(row);
                 });
            };


            this.scope.routing.openMOsGrid.onRegisterApi = (gridApi)  => {
                this.scope.routing.openMOsGrid.gridApi = gridApi;
                this.gridService.adjustGridHeight("openMOsGrid", this.scope.routing.openMOsGrid.data.length, 500);
                gridApi.core.on.renderingComplete(this.scope, (handler: any) => { this.gridService.restoreGridState("openMOsGrid", gridApi); });

                gridApi.core.on.sortChanged(this.scope, (handler: any) => { this.gridService.saveGridState("openMOsGrid", gridApi); });
                gridApi.core.on.columnVisibilityChanged(this.scope, (handler: any) => { this.gridService.saveGridState("openMOsGrid", gridApi); });
                gridApi.core.on.filterChanged(this.scope, (handler: any) => { this.gridService.saveGridState("openMOsGrid", gridApi); });
                gridApi.colMovable.on.columnPositionChanged(this.scope, (handler: any) => { this.gridService.saveGridState("openMOsGrid", gridApi); });
                gridApi.colResizable.on.columnSizeChanged(this.scope, (handler: any) => { this.gridService.saveGridState("openMOsGrid", gridApi); });

                gridApi.cellNav.on.viewPortKeyDown(this.scope, (event: any) => {
                    if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                        let cells = gridApi.cellNav.getCurrentSelection();
                        this.copyCellContentToClipBoard(cells);
                    }
                });


                gridApi.selection.on.rowSelectionChanged(this.scope, (row: any) => {
                    this.gridService.saveGridState("openMOsGrid", gridApi);
                    this.openMOsSelected(gridApi.selection.getSelectedRows());
                });
                gridApi.selection.on.rowSelectionChangedBatch(this.scope, (row: any) => {
                    this.gridService.saveGridState("openMOsGrid", gridApi);
                   this.openMOsSelected(gridApi.selection.getSelectedRows());
                });

            };

            this.scope.routing.routingSheetGrid.onRegisterApi = (gridApi)  => {
                this.scope.routing.routingSheetGrid.gridApi = gridApi;
                this.gridService.adjustGridHeight("routingSheetGrid", this.scope.routing.routingSheetGrid.data.length, 500);

                gridApi.core.on.renderingComplete(this.scope, (handler: any) => { this.gridService.restoreGridState("routingSheetGrid", gridApi); });

                gridApi.core.on.sortChanged(this.scope, (handler: any) => { this.gridService.saveGridState("routingSheetGrid", gridApi); });
                gridApi.core.on.columnVisibilityChanged(this.scope, (handler: any) => { this.gridService.saveGridState("routingSheetGrid", gridApi); });
                gridApi.core.on.filterChanged(this.scope, (handler: any) => { this.gridService.saveGridState("routingSheetGrid", gridApi); });
                gridApi.colMovable.on.columnPositionChanged(this.scope, (handler: any) => { this.gridService.saveGridState("routingSheetGrid", gridApi); });
                gridApi.colResizable.on.columnSizeChanged(this.scope, (handler: any) => { this.gridService.saveGridState("routingSheetGrid", gridApi); });

                gridApi.cellNav.on.viewPortKeyDown(this.scope, (event: any) => {
                    if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                        let cells = gridApi.cellNav.getCurrentSelection();
                        this.copyCellContentToClipBoard(cells);
                    }
                });

                
                gridApi.selection.on.rowSelectionChanged(this.scope, (row: any) => {
                    this.gridService.saveGridState("routingSheetGrid", gridApi);
                    this.routingSheetSelected(gridApi.selection.getSelectedRows());
                });
                gridApi.selection.on.rowSelectionChangedBatch(this.scope, (row: any) => {
                    this.gridService.saveGridState("routingSheetGrid", gridApi);
                   this.routingSheetSelected(gridApi.selection.getSelectedRows());
                });
            };


            this.scope.routing.finalProductSearchGrid.onRegisterApi = (gridApi)  => {
                this.scope.routing.finalProductSearchGrid.gridApi = gridApi;

                this.gridService.adjustGridHeight("finalProductSearchGrid", this.scope.routing.finalProductSearchGrid.data.length, 500);
                
                gridApi.core.on.renderingComplete(this.scope, (handler: any) => { this.gridService.restoreGridState("finalProductSearchGrid", gridApi); });

                gridApi.core.on.sortChanged(this.scope, (handler: any) => { this.gridService.saveGridState("finalProductSearchGrid", gridApi); });
                gridApi.core.on.columnVisibilityChanged(this.scope, (handler: any) => { this.gridService.saveGridState("finalProductSearchGrid", gridApi); });
                gridApi.core.on.filterChanged(this.scope, (handler: any) => { this.gridService.saveGridState("finalProductSearchGrid", gridApi); });
                gridApi.colMovable.on.columnPositionChanged(this.scope, (handler: any) => { this.gridService.saveGridState("finalProductSearchGrid", gridApi); });
                gridApi.colResizable.on.columnSizeChanged(this.scope, (handler: any) => { this.gridService.saveGridState("finalProductSearchGrid", gridApi); });

                gridApi.cellNav.on.viewPortKeyDown(this.scope, (event: any) => {
                    if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                        let cells = gridApi.cellNav.getCurrentSelection();
                        this.copyCellContentToClipBoard(cells);
                    }
                });

                gridApi.selection.on.rowSelectionChanged( this.scope, (row:any) => {
                   // this.gridService.saveGridState("finalProductSearchGrid", gridApi);
                    this.clearExplodedBomPage();
                    this.clearOpenMOsPage();
                    this.clearRoutingSheetPage();
                    this.finalProductRowSelected(row);
                    this.scope.IsDisabled = false;
                    //angular.element(document.getElementsByName('routingSheetNumber')).disabled = false;
                });
            };
        }

        

        /**
        * Reset UI Grid Column Definitions (Required to reflect if the user changed the application language)
        */
        private resetUIGridsColumnDefs() {
            //Reset UI grids columnDefs            
        }

        /**
        * Initialize theme on application start
        */
        private initTheme() {
            let themeId = this.storageService.getLocalData('h5.app.appName.theme.selected');
            let textureId = this.storageService.getLocalData('h5.app.appName.texture.selected');
            themeId = angular.isNumber(themeId) ? themeId : angular.isNumber(this.scope.globalConfig.defaultThemeId) ? this.scope.globalConfig.defaultThemeId : 1;
            textureId = angular.isNumber(textureId) ? textureId : angular.isNumber(this.scope.globalConfig.defaultTextureId) ? this.scope.globalConfig.defaultTextureId : 1;
            this.themeSelected(themeId);
            this.textureSelected(textureId); 

            this.scope.themes.forEach((theme) => {
                if (this.scope.globalConfig.excludeThemes.indexOf(theme.themeId) > -1) {
                    theme.available = false;
                } else {
                    theme.available = true;
                }
            });
            this.scope.textures.forEach((texture) => {
                if (this.scope.globalConfig.excludeWallpapers.indexOf(texture.textureId) > -1) {
                    texture.available = false;
                } else {
                    texture.available = true;
                }
            });
        }

        /**
        * Initialize module on application start
        */
        private initModule() {
            let moduleId = this.storageService.getLocalData('h5.app.appName.module.selected');
            moduleId = angular.isNumber(moduleId) ? moduleId : 1;
            this.scope.activeModule = moduleId;
            this.scope.modules.forEach((appmodule) => {
                if (angular.equals(moduleId, appmodule.moduleId)) {
                    appmodule.active = true;
                } else {
                    appmodule.active = false;
                }
                if (this.scope.globalConfig.excludeModules.indexOf(appmodule.moduleId) > -1) {
                    appmodule.available = false;
                } else {
                    appmodule.available = true;
                }
            });
        }

        /**
        *  Initialize language on application start
        */
        private initLanguage() {
            let languageCode = this.storageService.getLocalData('h5.app.appName.language.selected');
            languageCode = angular.isString(languageCode) ? languageCode : angular.isString(this.scope.globalConfig.defaultLanguage) ? this.scope.globalConfig.defaultLanguage : "en-US";
            this.scope.currentLanguage = languageCode;
            if (!angular.equals(this.scope.currentLanguage, "en-US")) {
                this.languageService.changeAppLanguage(languageCode).then((val: Odin.ILanguage) => {
                    this.resetUIGridsColumnDefs();
                }, (errorResponse: any) => {
                    Odin.Log.error("Error getting language " + errorResponse);
                    this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });

                });
            }
            this.scope.supportedLanguages.forEach((language) => {
                if (angular.equals(language.languageCode, languageCode)) {
                    language.active = true;
                } else {
                    language.active = false;
                }
                if (this.scope.globalConfig.excludeLanguages.indexOf(language.languageCode) > -1) {
                    language.available = false;
                } else {
                    language.available = true;
                }
            });
        }

        /**
        * Set the application theme
        * @param themeId the theme id
        */
        private themeSelected(themeId: number) {
            this.scope.themes.forEach((theme) => {
                if (angular.equals(theme.themeId, themeId)) {
                    theme.active = true;
                    this.scope.theme = theme;
                } else {
                    theme.active = false;
                }
            });
            this.storageService.setLocalData('h5.app.appName.theme.selected', themeId);
        }

        /**
        * Set the application background
        * @param textureId the texture id
        */
        private textureSelected(textureId: number) {
            this.scope.textures.forEach((texture) => {
                if (angular.equals(texture.textureId, textureId)) {
                    texture.active = true;
                    this.scope.texture = texture;
                } else {
                    texture.active = false;
                }
            });
            this.storageService.setLocalData('h5.app.appName.texture.selected', textureId);
        }

        /**
        * Get User Context for the logged in H5 user
        */
        private getUserContext() {
            Odin.Log.debug("is H5 " + this.userService.isH5() + " is Iframe " + Odin.Util.isIframe());
           // this.scope.loadingData = true;
            this.userService.getUserContext().then((val: M3.IUserContext) => {
                this.scope.userContext = val;
                this.loadGlobalData();
                
            }, (reason: any) => {
                Odin.Log.error("Can't get user context from h5 due to " + reason.errorMessage);
                this.scope.statusBar.push({ message: "Can't get user context from h5 " + [reason.errorMessage], statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });

                this.showError("Can't get user context from h5 ", [reason.errorMessage]);
                this.loadGlobalData();
            });
            
        }

        /**
        * Launch the H5 program or H5 link when the app runs inside the H5 client
        */
        private launchM3Program(link: string): void {
            Odin.Log.debug("H5 link to launch -->" + link);
            this.formService.launch(link);
        }

        /**
        * Trigger load application data when the user hit a specific key
        */
        private mapKeyUp(event: any) {
            //F4 : 115, ENTER : 13
            if (event.keyCode === 115 && document.activeElement.name === "finalProduct") {
                this.clearFinalProductSearchPage();
                this.openFinalProductSearchPage(); 
            }
        }


        /**
        * Used by infinite scroll functionality in the ui-select dropdown with large number of records
        */
        private addMoreItemsToScroll() {
            this.scope.infiniteScroll.currentItems += this.scope.infiniteScroll.numToAdd;
        };

        /**
        * Hack function to facilitate copy paste shortcut in ui grid cells
        */
        private copyCellContentToClipBoard(cells: any) {
            let hiddenTextArea = angular.element(document.getElementById("gridClipboard"));
            hiddenTextArea.val("");
            let textToCopy = '', rowId = cells[0].row.uid;
            cells.forEach((cell: any) => {
                textToCopy = textToCopy == '' ? textToCopy : textToCopy + ",";
                let cellValue = cell.row.entity[cell.col.name];
                if (angular.isDefined(cellValue)) {
                    if (cell.row.uid !== rowId) {
                        textToCopy += '\n';
                        rowId = cell.row.uid;
                    }
                    textToCopy += cellValue;
                }

            });
            hiddenTextArea.val(textToCopy);
            hiddenTextArea.select();
        }

        /**
        * Opens About Page in a modal window
        */
        private openAboutPage() {
            let options: any = {
                animation: true,
                templateUrl: "views/About.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the modal window where user can change the application theme
        */
        private openChangeThemePage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeThemeModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the modal window where user can change the application wallpaper
        */
        private openChangeWallpaperPage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeWallpaperModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the modal window where user can change the application language
        */
        private openChangeAppLanguagePage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeLanguageModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Change the application language
        * @param languageCode the language code to change
        */
        private changeAppLanguage(languageCode: string) {
            this.scope.supportedLanguages.forEach((language) => {
                if (angular.equals(language.languageCode, languageCode)) {
                    language.active = true;
                    this.scope.currentLanguage = languageCode;
                } else {
                    language.active = false;
                }
            });
            this.languageService.changeAppLanguage(languageCode).then((val: Odin.ILanguage) => {
                this.scope.appReady = false;
                this.closeModalWindow();
                this.resetUIGridsColumnDefs();
                this.$timeout(() => { this.scope.appReady = true; }, 1000);
            }, (errorResponse: any) => {
                Odin.Log.error("Error getting language " + errorResponse);
                this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
            this.storageService.setLocalData('h5.app.appName.language.selected', languageCode);
        }
        
        /**
        * Toggle Side Nav Menu bar based on screen size
        */
        private sideMenuToggler(): void {
            if (this.$window.innerWidth <= 768) {
                this.scope.showSideNavLabel = false;
                this.scope.showSideNav = !this.scope.showSideNav;
            } else {
                this.scope.showSideNav = true;
                this.scope.showSideNavLabel = !this.scope.showSideNavLabel;
            }
        }

        /**
        * Close the modal window if any opened
        */
        private closeModalWindow() {
            this.scope.modalWindow.close("close");
        }

        /**
        * Close the status bar panel in the footer
        */
        private closeStatusBar() {
            this.scope.statusBarIsCollapsed = true;
            this.scope.statusBar = [];
        }

        /**
        * Remove the row item at the status bar
        */
        private removeStatusBarItemAt(index: number): void {
            if (index || index == 0) {
                this.scope.statusBar.splice(this.scope.statusBar.length - 1 - index, 1);
            }
            this.scope.statusBarIsCollapsed = this.scope.statusBar.length == 0;
        };


        private parseError(errorResponse: ng.IHttpPromiseCallbackArg<any>) {
            let error = "Error occurred while processing below request(s)";
            let errorMessages: string[] = this.scope["errorMessages"];
            let errorMessage = "Request URL: " + errorResponse.config.url + ", Status: " + errorResponse.status +
                " (" + errorResponse.statusText + ")";
            if (angular.isObject(errorResponse.data) && angular.isObject(errorResponse.data.eLink)) {
                errorMessage = errorMessage + ", Error : " + errorResponse.data.eLink.code + " (" + errorResponse.data.eLink.message + ") ";
                if (angular.isString(errorResponse.data.eLink.details)) {
                    errorMessage = errorMessage + errorResponse.data.eLink.details;
                }
            }
            if (errorMessages.indexOf(errorMessage) == -1) {
                errorMessages.push(errorMessage);
            }
            this.showError(error, errorMessages);
        }

        /**
        * Show the error message in application error panel
        * @param error the error prefix/description to show
        * @param errorMessages array of error messages to display
        */
        private showError(error: string, errorMessages: string[]) {
            this.scope["hasError"] = true;
            this.scope["error"] = error;
            this.scope["errorMessages"] = errorMessages;
            if (angular.isObject(this.scope["destroyErrMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyErrMsgTimer"]);
            }
            this.scope["destroyErrMsgTimer"] = this.$timeout(() => { this.hideError(); }, 30000);
        }

        /**
        * Function to hide/clear the error messages
        */
        private hideError() {
            this.scope["hasError"] = false;
            this.scope["error"] = null;
            this.scope["errorMessages"] = [];
            this.scope["destroyErrMsgTimer"] = undefined;
        }

        /**
         * Show the warning message in application error panel
         * @param warning the warning prefix/description to show
         * @param warningMessages array of warning messages to display
         */
        private showWarning(warning: string, warningMessages: string[]) {
            this.scope["hasWarning"] = true;
            this.scope["warning"] = warning;
            this.scope["warningMessages"] = warningMessages;
            if (angular.isObject(this.scope["destroyWarnMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyWarnMsgTimer"]);
            }
            this.scope["destroyWarnMsgTimer"] = this.$timeout(() => { this.hideWarning(); }, 10000);
        }

        /**
        * Function to hide/clear the warning messages
        */
        private hideWarning() {
            this.scope["hasWarning"] = false;
            this.scope["warning"] = null;
            this.scope["warningMessages"] = null;
            this.scope["destroyWarnMsgTimer"] = undefined;
        }

        /**
        * Show the info message in application error panel
        * @param info the warning prefix/description to show
        * @param infoMessages array of info messages to display
        */
        private showInfo(info: string, infoMessages: string[]) {
            this.scope["hasInfo"] = true;
            this.scope["info"] = info;
            this.scope["infoMessages"] = infoMessages;
            if (angular.isObject(this.scope["destroyInfoMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyInfoMsgTimer"]);
            }
            this.scope["destroyInfoMsgTimer"] = this.$timeout(() => { this.hideInfo(); }, 10000);
        }

        /**
        * Function to hide/clear the info messages
        */
        private hideInfo() {
            this.scope["hasInfo"] = false;
            this.scope["info"] = null;
            this.scope["infoMessages"] = null;
            this.scope["destroyInfoMsgTimer"] = undefined;
        }

        /**
        * Add function calls which are required to be called during application load data for the first time 
        */
        private loadGlobalData() {
 
            let userContext = this.scope.userContext;
            let globalConfig = this.scope.globalConfig;

            this.loadAppConfig(userContext.company, userContext.division, userContext.m3User, globalConfig.environment).then((val: any) => {
                if(this.scope.appConfig.authorizedUser === true){ // added for security
                    console.log("authorized");
                    
                    //any functions that load default data
                    
                    this.loadData(this.scope.activeModule);
                    this.loadDefaultFields();
                    this.getPrinters();
                    this.hideWarning();
                }else{// added for security
                    console.log("NOT authorized");// added for security
                    window.alert("NOT Authorized, Please Contact Security"); // added for security
                    
                }
                
               
            });
        }


        /**
        * Auto selecting an option based on the query parameters or logged in user's details
        */
        private loadDefaultFields() {
            let userContext = this.scope.userContext;
            let appConfig = this.scope.appConfig;
        }

        /**
        * Upon calling this function will reset the application data for all modules/tabs and load the application data for the active module/tab
        */
        private loadApplicationData() {
            let categories = ['globalSelection', 'routing'];
            this.clearData(categories);
            this.resetReloadStatus();
            this.loadData(this.scope.activeModule);
        }

        /**
        * Re-initializing or clearing the data based on modules or categories/business logic should be implemented here
        * @param categories the categories to clear data
        */
        private clearData(categories: string[]) {
            categories.forEach((category) => {
                if (category == "globalSelection") {
                    //Reset data from the global selection object
                }
                if (category == "routing") {
                    //Reset data from the specific module or category
                }
            });
        }

        /**
        * Code for resetting reload status of all module's to stop showing loading indicator should be implemented here
        */
        private resetReloadStatus() {
            //this.scope.sampleModule1.reload = true;
        }

        /**
        * Call this function from the view when a tab/module is selected to load
        * @param moduleId the selected module id
        */
        private moduleSelected(moduleId: number) {
            this.scope.activeModule = moduleId;
            this.scope.modules.forEach((appmodule) => {
                if (angular.equals(moduleId, appmodule.moduleId)) {
                    appmodule.active = true;
                } else {
                    appmodule.active = false;
                }
            });
            this.storageService.setLocalData('h5.app.appName.module.selected', moduleId);
            this.loadData(this.scope.activeModule);
        }

        /**
        * This function will be called whenever the tab is selected, so add the functions calls with respect to the tab id
        * @param activeModule the module to activate/load
        */
        private loadData(activeModule: number) {
            
            switch (activeModule) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
            }
        }

        /**
        * This function will be called to iterate over the transactions states of a tab and set the loading indicator to true if there any running transactions
        */
        private refreshTransactionStatus() {
            //Global Status
            let isLoading = false;
            for (let transaction in this.scope.transactionStatus) {
                let value = this.scope.transactionStatus[transaction];
                if (value == true) {
                    isLoading = true;
                    break;
                }
            }

            for (let transaction in this.scope.globalSelection.transactionStatus) {
                let value = this.scope.globalSelection.transactionStatus[transaction];
                if (value == true) {
                    isLoading = true;
                    break;
                }
            }
            this.scope.loadingData = isLoading;
            if (isLoading) { return; }

            switch (this.scope.activeModule) {
                case 1:
                    // for (let transaction in this.scope.sampleModule1.transactionStatus) {
                    //     let value = this.scope.sampleModule1.transactionStatus[transaction];
                    //     if (value == true) {
                    //         isLoading = true;
                    //         break;
                    //     }
                    // }
                    // this.scope.loadingData = isLoading;
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
            }
        }

        //************************************************Application specific functions starts************************************************

        /**
        * Load Application Configurations
        */
        private loadAppConfig(company: string, division: string, user: string, environment: string): ng.IPromise<any> {
            let deferred = this.$q.defer();
            this.scope.appConfig = this.scope.globalConfig.appConfig;
            this.scope.appConfig.searchQuery = this.$location.search();
            this.scope.appConfig.enableM3Authority = true //added for security
            
            if (this.scope.appConfig.enableM3Authority) {
                this.scope.loadingData = true;
                this.scope.transactionStatus.appConfig = true;
                
                let programName = "TZR100";
                let promise1 = this.appService.getAuthority(company, division, user, programName, 1).then((result: boolean) => {
                    this.scope.appConfig.authorizedUser = result;// added for security 
                });
                let promises = [promise1];
                this.$q.all(promises).finally(() => {
                    deferred.resolve(this.scope.appConfig);
                    this.scope.transactionStatus.appConfig = false;
                    this.refreshTransactionStatus();
                });
            } else {
                deferred.resolve(this.scope.appConfig);
            }
            return deferred.promise;
        }

        private clearPage(): void{
        
            this.clearExplodedBomPage();
            this.clearOpenMOsPage();
            this.clearRoutingSheetPage();

            this.scope.IsDisabled = false;
    
        }
       

        
        /**
        * Called when a Row is selected in the Sample Data List Grid
        * @param selectedRow the selected row object
        */
        
        private createRoutingSheet(): void {

            this.clearOpenMOsPage();
            this.clearRoutingSheetPage();

            var finalMo = this.scope.routing.explodedBOM.finalMO;
            var facility = this.scope.routing.explodedBOM.facility;
            var structureType = this.scope.routing.explodedBOM.structureType;
            var finalProduct = this.scope.routing.explodedBOM.finalProduct;


            if (finalMo == "" || facility == "" || structureType == "" || finalProduct == "") {
                //show warning message
                let warningMessage = "Please select a Final Product using Prompt(F4).";
                this.showWarning(warningMessage, null);
                return;
            }

            this.scope.loadingData = true;
            this.scope.routing.transactionStatus.selMPDSUM = true;
        
            this.appService.selMPDSUM(facility, structureType, finalProduct).then((val: any) => {
                this.scope.routing.explodedBomGrid.data = val.items;
                let data = [];
                val.items.forEach((MOs: any) => {
                //If the selected item has already present in routing sheet
                    if(MOs.CNQT >= 0){
                        data.push(MOs);
                    }
                });
                this.scope.routing.explodedBomGrid.data = data;
                if (angular.isArray(val.items)) {
                    this.gridService.adjustGridHeight("explodedBomGrid", val.items.length, 500);
                }

                this.scope.routing.transactionStatus.selMPDSUM = false;
                this.refreshTransactionStatus();
            }, (err: any) => {
                let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.routing.transactionStatus.selMPDSUM = false;
                this.refreshTransactionStatus();
            });


            this.scope.loadingData = true;
            this.scope.routing.transactionStatus.GetWarehouse = true;
            
            this.appService.GetMo(facility, finalProduct, finalMo).then((val:any) => {

                this.scope.routing.routingSheet.status = val.item.WHST;
                console.log(this.scope.routing.routingSheet.status);
                if(this.scope.routing.routingSheet.status == 90){
                    this.scope.routing.routingSheet.isOpen = false;
                } else {
                    this.scope.routing.routingSheet.isOpen = true;
                }
                this.scope.routing.routingSheet.startDate = val.item.STDT;
                this.scope.routing.routingSheet.responsible = this.scope.userContext.m3User;
                //this.scope.routing.routingSheet.status = val.item.
                this.scope.routing.warehouse = val.item.WHLO;
                this.scope.routing.transactionStatus.GetWarehouse = false;
                this.refreshTransactionStatus();
                
                this.clearRoutingSheetPage();
                this.LstRoutingSheet(finalMo);
                
            }, (err: any) => {
                let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.routing.transactionStatus.GetWarehouse = false;
                this.refreshTransactionStatus();
            });

            this.scope.IsDisabled = true;
            //angular.element(document.getElementsByName('routingSheetNumber')).disabled = true;

            
        }

        private validateRouting(): boolean {
            
            let status = true;
            this.scope.routing.openMos.selectedItems.forEach((MOs: any, index: any) => {
                //If the selected item has already present in routing sheet
                if(MOs.F1PK02 > 0) {
                    if(this.scope.routing.openMos.routingSheetNumber === ''){
                        this.scope.routing.openMos.routingSheetNumber = MOs.F1PK02;
                        }
                    this.showWarning("The Selected MO already added to a routing sheet " + MOs.F1PK02, null);
                    status = false;
                }
            });

            return status;
        }

        private addToRoutingSheet(): void {
           
            // take timestamp last ten digit for routing number.
            //var routingSheetNo = (new Date().getTime().toString()).substr(3);
            var routingSheetNo = this.scope.routing.explodedBOM.finalMO;
            
            if( this.scope.routing.openMos.selectedItems.length == 0) {
                this.showWarning("Please select an MO to add.", null);
                return;
            }
            
            if(this.validateRouting()) {
                
                this.scope.routing.openMos.selectedItems.forEach((MOs: any, index: any) => {
                    
                    var MONumber = MOs.VHMFNO; // This MO number is from openMO grid
                    var itemNo = MOs.VHPRNO; // this is from open mo grid
                    this.getNewSequenceNo();
                    var Sequence = this.scope.routing.sequence;
                    var finalMoNumber = this.scope.routing.finalProductSearch.selectedItem.VHMFNO; // this one is from final search product is same as exbom Final MO
                    var finalItemNo = this.scope.routing.explodedBOM.selectedItem.PRNO; // item number from selected exbox grid record
                    var V1OPDS = MOs.V1OPDS;
                    var V2OPDS = MOs.V2OPDS;
                    var VHSTRT = "001"  // as advised by rachel
                    var V1PLGR = MOs.V1PLGR;
                    var V2PLGR = MOs.V2PLGR;
                    var VHORQT = MOs.VHORQT;
                    var V1OPNO = MOs.V1OPNO;
                    var V2OPNO = MOs.V2OPNO;
                    var V1WOSQ = MOs.V1WOSQ;
                    var V2WOSQ = MOs.V2WOSQ;
                    var facility = this.scope.routing.openMos.facility;

                    var finalItemName; //TODO

                    this.scope.loadingData = true;
                    this.scope.routing.transactionStatus.addMWOHEDext = true;
                    
                    //Get warhouse warehouse for each MO in Open Mos grid
                    this.appService.GetMo(facility, itemNo, MONumber).then((val:any) => {
                         
                        this.appService.addMWOHEDext(
                            MONumber, routingSheetNo, Sequence, val.item.WHLO, itemNo, val.item.MAUN, V1OPDS, V2OPDS, 
                            VHSTRT, val.item.ITDS, finalItemNo, finalItemName, V1PLGR, V2PLGR, VHORQT, 
                            finalMoNumber, V1OPNO, V2OPNO, V1WOSQ, V2WOSQ)
                            .then((val: any) => {
                                this.scope.routing.transactionStatus.addMWOHEDext = false;
                                this.refreshTransactionStatus();
                                this.LstRoutingSheet(routingSheetNo);
                            }, (err: any) => {
                                let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                                this.showError(error, [err.errorMessage]);
                                this.scope.routing.transactionStatus.addMWOHEDext = false;
                                this.refreshTransactionStatus();
                            });
                        
                    }, (err: any) => {
                        let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                        this.showError(error, [err.errorMessage]);
                        this.scope.routing.transactionStatus.addMWOHEDext = false;
                        this.refreshTransactionStatus();
                    });
                });
                
            } 
            else {
                this.LstRoutingSheet(this.scope.routing.openMos.routingSheetNumber);
            }
            
            
            
        }
        
         private getNewSequenceNo(): void {

            let newSeq;
            
           
             
            let highestSeq = 1;
            this.scope.routing.routingSheetGrid.data.forEach((MOs: any, index: any) => {
                var seq = MOs.F1PK03;
                if(seq >= highestSeq){
                    highestSeq = parseInt(seq) + 1;
                }
                
            });
             
             newSeq = highestSeq
             
            this.scope.routing.sequence = newSeq;
             
      
        }

         private findRoutingSheet(): void {
             var routingSheetNo = this.scope.routing.routingSheet.routingSheetNumber;
             if (routingSheetNo != "") {

                 this.scope.routing.routingSheet.structureType = "001";
                 this.scope.routing.routingSheet.facility = "650"; //TODO remove hardcode

                 this.scope.loadingData = true;
                 this.scope.routing.transactionStatus.lstRoutingSheet = true;

                 this.appService.LstRoutingSheet(routingSheetNo).then((val: any) => {
                     if (val.items.length > 0) {
                         this.scope.routing.routingSheetGrid.data = val.items;
                         this.scope.routing.routingSheet.data = val.items;

                         this.scope.routing.routingSheet.finalMO = val.items[0].F1PK02;
                         this.scope.routing.routingSheet.finalProduct = val.items[val.items.length - 1].F1A030;

                         this.scope.routing.explodedBOM.facility = "650"; //TODO remove hardcode
                         this.scope.routing.explodedBOM.finalMO = val.items[0].F1PK02;
                         this.scope.routing.explodedBOM.finalProduct = val.items[val.items.length - 1].F1A030;
                         this.scope.routing.explodedBOM.structureType = "001";

                         //list componenets
                         this.scope.routing.transactionStatus.lstComponents = true;

                         this.appService.lstComponents(this.scope.routing.routingSheet.facility, val.items[0].F1A030).then((val: any) => {
                             this.scope.routing.routingSheet.itemComponents = val.items;

                             this.scope.routing.transactionStatus.lstComponents = false;
                             this.refreshTransactionStatus();
                         }, (err: any) => {
                             //do nothing
                             let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                             this.showError(error, [err.errorMessage]);
                             // this.scope.routing.printerSetup.printers.selected = this.scope.routing.printerSetup.printers[0];
                             this.scope.routing.transactionStatus.lstComponents = false;
                             this.scope.routing.routingSheet.data[0].MTNO = "";
                             this.scope.routing.routingSheet.data[0].ITDS = "";
                             this.refreshTransactionStatus();
                         }).finally(() => {
                             this.scope.routing.routingSheet.itemComponents.forEach((components) => {

                                 this.scope.routing.routingSheet.data[0].MTNO = components.MTNO;
                                 this.scope.routing.routingSheet.data[0].ITDS = components.ITNO;

                             });
                             // this.scope.routing.routingSheet.data[index].MTNO = "MTNO " + index;
                             // this.scope.routing.routingSheet.data[index].ITDS = "ITDS " + index;
                         });

                         if (angular.isArray(val.items)) {
                             this.gridService.adjustGridHeight("routingSheetGrid", val.items.length, 500);
                         }

                         this.scope.loadingData = true;
                         this.scope.routing.transactionStatus.GetWarehouse = true;
                         this.appService.GetMo(this.scope.routing.routingSheet.facility, this.scope.routing.routingSheet.finalProduct, this.scope.routing.routingSheet.finalMO).then((val: any) => {
                             this.scope.routing.routingSheet.status = val.item.WHST;
                             console.log(this.scope.routing.routingSheet.status);
                             if(this.scope.routing.routingSheet.status == 90){
                                 this.scope.routing.routingSheet.isOpen = false;
                             }else{
                                 this.scope.routing.routingSheet.isOpen = true;
                                 }
                             this.scope.routing.routingSheet.startDate = val.item.STDT;
                             this.scope.routing.routingSheet.responsible = this.scope.userContext.m3User;
                             this.scope.routing.warehouse = val.item.WHLO;
                             this.scope.routing.transactionStatus.GetWarehouse = false;
                             this.refreshTransactionStatus();
                             this.getWarehouseDetails();
                         }, (err: any) => {
                             let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                             this.showError(error, [err.errorMessage]);
                             this.scope.routing.transactionStatus.GetWarehouse = false;
                             this.refreshTransactionStatus();
                         });
                         this.scope.routing.transactionStatus.lstRoutingSheet = false;
                         this.refreshTransactionStatus();
                     }else{
                         let error = "Routing Sheet does not exist";
                             this.showError(error, null);
                             this.scope.routing.transactionStatus.GetWarehouse = false;
                             this.refreshTransactionStatus();
                     }
                     //this.createRoutingSheet();
                 }, (err: any) => {
                     let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                     this.showError(error, [err.errorMessage]);
                     this.scope.routing.transactionStatus.lstRoutingSheet = false;
                     this.refreshTransactionStatus();
                 });
             } else {
                 let warningMessage = "Please Enter a Routing Sheet Number.";
                 this.showWarning(warningMessage, null);
                 return;
             }
         }


        private getWarehouse(facility: string, finalProduct: string, finalMo: string):void {

            this.scope.loadingData = true;
            this.scope.routing.transactionStatus.GetWarehouse = true;
            this.appService.GetMo(facility, finalProduct, finalMo).then((val:any) => {

                this.scope.routing.explodedBOM.selectedItemDetails = val.item;
                this.scope.routing.warehouse = val.item.WHLO;
                this.scope.routing.transactionStatus.GetWarehouse = false;
                this.refreshTransactionStatus();
            }, (err: any) => {
                let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.routing.transactionStatus.GetWarehouse = false;
                this.refreshTransactionStatus();
            });
        }

        private LstRoutingSheet(routingSheetNo: string): void {
            
            
            this.scope.routing.routingSheet.facility = this.scope.routing.explodedBOM.facility;
            this.scope.routing.routingSheet.finalMO =  this.scope.routing.explodedBOM.finalMO;
            this.scope.routing.routingSheet.finalProduct =  this.scope.routing.explodedBOM.finalProduct;
           
            this.scope.routing.routingSheet.routingSheetNumber = routingSheetNo;
            this.scope.routing.routingSheet.structureType = "001";

            this.scope.loadingData = true;
            this.scope.routing.transactionStatus.lstRoutingSheet = true;
            
            this.appService.LstRoutingSheet(routingSheetNo).then((val: any) => {
                this.scope.routing.routingSheetGrid.data = val.items;
                this.scope.routing.routingSheet.data = val.items;
                
                this.scope.routing.transactionStatus.lstComponents = true;

                this.appService.lstComponents(this.scope.routing.routingSheet.facility, val.items[0].F1A030).then((val: any) => {
                    this.scope.routing.routingSheet.itemComponents = val.items;

                    this.scope.routing.transactionStatus.lstComponents = false;
                    this.refreshTransactionStatus();
                }, (err: any) => {
                    //do nothing
                    let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    this.showError(error, [err.errorMessage]);
                    // this.scope.routing.printerSetup.printers.selected = this.scope.routing.printerSetup.printers[0];
                    this.scope.routing.transactionStatus.lstComponents = false;
                    this.scope.routing.routingSheet.data[0].MTNO = "";
                    this.scope.routing.routingSheet.data[0].ITDS = "";
                    this.refreshTransactionStatus();
                }).finally(() => {
                    this.scope.routing.routingSheet.itemComponents.forEach((components) => {

                        this.scope.routing.routingSheet.data[0].MTNO = components.MTNO;
                        this.scope.routing.routingSheet.data[0].ITDS = components.ITNO;

                    });
                    // this.scope.routing.routingSheet.data[index].MTNO = "MTNO " + index;
                    // this.scope.routing.routingSheet.data[index].ITDS = "ITDS " + index;
                });



                if (angular.isArray(val.items)) {
                    this.gridService.adjustGridHeight("routingSheetGrid", val.items.length, 500);
                }

                this.scope.routing.transactionStatus.lstRoutingSheet = false;
                this.refreshTransactionStatus();
            }, (err: any) => {
                let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.routing.transactionStatus.lstRoutingSheet = false;
                this.refreshTransactionStatus();
            });


            this.getWarehouseDetails();

        }

        private getWarehouseDetails(): void {

            this.scope.loadingData = true;
            this.scope.routing.transactionStatus.GetWarehouse = true;
            this.appService.getWarehouse(this.scope.routing.warehouse).then((val:any) => {
                this.scope.routing.warehouseDetails = val.item;

                this.scope.routing.transactionStatus.GetWarehouse = false;
                this.refreshTransactionStatus();
            }, (err: any) => {
                let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.routing.transactionStatus.GetWarehouse = false;
                this.refreshTransactionStatus();
            });
            
        }
        
        private deleteAllLines(): void {
            
            if(this.scope.routing.routingSheetGrid.data.length > 0){
            
                    var routingSheetNo = this.scope.routing.routingSheet.routingSheetNumber;
        
                    this.scope.routing.routingSheet.data.forEach((MOs: any, index: any) => {
                        var MFNO = MOs.F1PK01;
                        var Seq = MOs.F1PK03;
                        var WHLO = MOs.F1PK04;
        
                        this.scope.loadingData = true;
                        this.scope.routing.transactionStatus.deleteMWOHEDext = true;
        
                        this.appService.deleteMWOHEDext(MFNO, routingSheetNo, Seq, WHLO).then((val: any) => {
        
                            this.scope.routing.transactionStatus.deleteMWOHEDext = false;
                            this.refreshTransactionStatus();
                            this.clearRoutingSheetPage();
                        }, (err: any) => {
                            let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                            this.showError(error, [err.errorMessage]);
                            this.scope.routing.transactionStatus.deleteMWOHEDext = false;
                            this.refreshTransactionStatus();
                        });
                    });
        
                    
                   
                }
               

        }

        private deleteLines(): void{
            if(this.scope.routing.routingSheetGrid.data.length > 0){
                var routingSheetNo = this.scope.routing.routingSheet.routingSheetNumber;
    
                this.scope.routing.routingSheet.selectedItems.forEach((MOs: any, index: any) => {
                    var MFNO = MOs.F1PK01;
                    var Seq = MOs.F1PK03;
                    var WHLO = MOs.F1PK04;
    
                    this.scope.loadingData = true;
                    this.scope.routing.transactionStatus.deleteMWOHEDext = true;
                    
                    this.appService.deleteMWOHEDext(MFNO, routingSheetNo, Seq, WHLO).then((val: any) => {
                        
                        this.scope.routing.transactionStatus.deleteMWOHEDext = false;
                        this.refreshTransactionStatus();
                        this.clearRoutingSheetPage();
                        this.LstRoutingSheet(routingSheetNo);
                    }, (err: any) => {
                        let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                        this.showError(error, [err.errorMessage]);
                        this.scope.routing.transactionStatus.deleteMWOHEDext = false;
                        this.refreshTransactionStatus();
                        this.clearRoutingSheetPage();
                        this.LstRoutingSheet(routingSheetNo);
                    });
                });
    
                
           }
        }

        private routingSheetSelected(rows: any): void {
            this.scope.routing.routingSheet.selectedItems = rows;
        }

        private openMOsSelected(rows: any): void {
            this.scope.routing.openMos.selectedItems = rows;
        }

        private exBomRowSelected(row: any): void {
            this.scope.routing.explodedBOM.selectedItem = row.entity;

            this.getWarehouse(this.scope.routing.explodedBOM.facility, row.entity.PRNO, this.scope.routing.explodedBOM.finalMO);
            
            this.clearOpenMOsPage()
            //this.clearRoutingSheetPage();
            this.populateOpenMos();
        }
        
        private finalProductRowSelected(row: any):void {
            this.scope.routing.finalProductSearch.selectedItem = row.entity;
            this.closeModalWindow();
            this.populateExplodedBomData();
        }

        private populateOpenMos(): void {

            var facility = this.scope.routing.explodedBOM.selectedItem.FACI
            var product = this.scope.routing.explodedBOM.selectedItem.PRN1;
            var moFromStatus = "20";
            var moToStatus = "80";

            this.scope.routing.openMos.facility = facility
            this.scope.routing.openMos.product = product

            this.scope.loadingData = true;
            this.scope.routing.transactionStatus.lstRoutingMOs = true;
            
            this.appService.lstRoutingMOs(moFromStatus, moToStatus, product, product, facility).then((val: any) => {
                this.scope.routing.openMOsGrid.data = val.items;

                if (angular.isArray(val.items)) {
                    this.gridService.adjustGridHeight("openMOsGrid", val.items.length, 500);
                }

                this.scope.routing.transactionStatus.lstRoutingMOs = false;
                this.refreshTransactionStatus();
            }, (err: any) => {
                let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.routing.transactionStatus.lstRoutingMOs = false;
                this.refreshTransactionStatus();
            });

        }

        private populateExplodedBomData(): void {
            
            this.scope.routing.explodedBOM.facility = this.scope.routing.finalProductSearch.selectedItem.VHFACI;
            this.scope.routing.explodedBOM.finalMO = this.scope.routing.finalProductSearch.selectedItem.VHMFNO;
            this.scope.routing.explodedBOM.finalProduct = this.scope.routing.finalProductSearch.selectedItem.VHPRNO;
            this.scope.routing.explodedBOM.structureType = "001";
        }

        // When the search button in the model is clicked
        private searchFinalProduct(): void {
            var facility = this.scope.routing.finalProductSearch.facility;
            var finalProduct = this.scope.routing.finalProductSearch.finalProduct;
            var moFromStatus = this.scope.routing.finalProductSearch.moFromStatus;
            var moToStatus = this.scope.routing.finalProductSearch.moToStatus;

            if (facility == "") {
                //show warning message
                let warningMessage = "Please Enter a Facility.";
                this.showWarning(warningMessage, null);
                return;
            } else if(finalProduct == ""){
                let warningMessage = "Please Enter a Product.";
                this.showWarning(warningMessage, null);
                return;
            } else if(moFromStatus == ""){
                let warningMessage = "Please Enter from Status.";
                this.showWarning(warningMessage, null);
                return;
            } else if(moToStatus == ""){
                let warningMessage = "Please Enter to status.";
                this.showWarning(warningMessage, null);
                return;
            }

            this.scope.loadingData = true;
            this.scope.routing.transactionStatus.lstRoutingMOs = true;
            
            this.appService.lstRoutingMOs(moFromStatus, moToStatus, finalProduct, finalProduct, facility).then((val: any) => {
                this.scope.routing.finalProductSearchGrid.data = val.items;

                if (angular.isArray(val.items)) {
                    this.gridService.adjustGridHeight("finalProductSearchGrid", val.items.length, 500);
                }

                this.scope.routing.transactionStatus.lstRoutingMOs = false;
                this.refreshTransactionStatus();
            }, (err: any) => {
                let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.routing.transactionStatus.lstRoutingMOs = false;
                this.refreshTransactionStatus();
            });
        }

        private clearFinalProductSearchPage() {
            this.scope.routing.finalProductSearch.facility="";
            this.scope.routing.finalProductSearch.finalProduct="";
            this.scope.routing.finalProductSearch.moFromStatus="";
            this.scope.routing.finalProductSearch.moToStatus="";

            this.scope.routing.finalProductSearchGrid.data = [];
        }

        private clearOpenMOsPage() {            
            this.scope.routing.openMos.facility = "";
            this.scope.routing.openMos.product = "";
            this.scope.routing.openMos.selectedItems = [];
            this.scope.routing.openMOsGrid.data = [];
        }

        private clearExplodedBomPage() {
            this.scope.routing.explodedBOM.facility = "";
            this.scope.routing.explodedBOM.finalMO = "";
            this.scope.routing.explodedBOM.finalProduct = ""
            this.scope.routing.explodedBOM.structureType = ""
            this.scope.routing.explodedBOM.selectedItem = []
            this.scope.routing.explodedBomGrid.data = [];
            this.scope.routing.explodedBOM.selectedItemDetails = []
        }

        private clearRoutingSheetPage() {
            this.scope.routing.routingSheet.facility = "";
            this.scope.routing.routingSheet.finalMO = "";
            this.scope.routing.routingSheet.finalProduct = "";
            this.scope.routing.routingSheet.routingSheetNumber = "";
            this.scope.routing.routingSheet.structureType = "";
            this.scope.routing.routingSheet.isOpen = true;
            this.scope.routing.routingSheet.selectedItems = [];
            this.scope.routing.routingSheetGrid.data = [];
            this.scope.routing.routingSheet.data = [];
        }
        
        private browseFinalProduct(){
            this.clearFinalProductSearchPage();
            this.openFinalProductSearchPage(); 
        }

        private openFinalProductSearchPage() {
            let options: any = {
                animation: true,
                templateUrl: "views/FinalProductSearchModal.html",
                size: "lg",
                scope: this.scope
            }
            this.scope.routing.finalProductSearch.finalProduct = this.scope.routing.explodedBOM.finalProduct;
            this.scope.routing.finalProductSearch.facility = this.scope.userContext.FACI;
            this.scope.routing.finalProductSearch.moFromStatus = "20";
            this.scope.routing.finalProductSearch.moToStatus = "80";

            this.scope.modalWindow = this.$uibModal.open(options);
            
            if(this.scope.routing.finalProductSearch.finalProduct != ""){
                this.searchFinalProduct();
            }
        }

         private getPrinters(): void {
            this.scope.routing.transactionStatus.getPrinters = true;
            this.appService.lstPrinters().then((val: any) => {
                
                
                this.scope.routing.printerSetup.printers = val.items;
                this.scope.routing.transactionStatus.getPrinters = false;
                this.getDefaultPrinter(); // loads default printer in printer lists

            }, (err: any) => {
                let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.routing.transactionStatus.getPrinters = false;
                this.refreshTransactionStatus();
            });
        }
        
        
        private getDefaultPrinter(): void {
            let user = this.scope.userContext.m3User;
            
            this.scope.routing.transactionStatus.getPrintFile = true;
            this.appService.getPrintFile(user).then((val: any) => {

                this.scope.routing.printer.printer = val.items[0].DEV;
                this.scope.routing.printer.user = val.items[0].USID;
                this.scope.routing.printer.printFile = val.items[0].PRTF;
                this.scope.routing.printerSetup.printers.selected = val.items[0].DEV;

                this.scope.routing.transactionStatus.getPrintFile = false;
                this.refreshTransactionStatus();
            }, (err: any) => {
                //do nothing
                this.scope.routing.printerSetup.printers.selected = this.scope.routing.printerSetup.printers[0];
                this.appService.addPrintFile(user, "").then((val: any) => {

                    console.log("PrintFile Updated")
                    this.scope.routing.transactionStatus.addPrintFile = false;
                    this.getDefaultPrinter();

                }, (err: any) => {
                    console.log("err");
                    let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    this.showError(error, [err.errorMessage]);
                    this.scope.routing.transactionStatus.addPrintFile = false;
                    this.refreshTransactionStatus();
                });
                this.scope.routing.transactionStatus.getPrintFile = false;
                this.refreshTransactionStatus();
            });

        }
        
        private updPrintFile(): void {
            let user = this.scope.userContext.m3User;
            let printer = this.scope.routing.printerSetup.printers.selected;
            this.scope.routing.printer.printer = this.scope.routing.printerSetup.printers.selected;
            this.scope.routing.transactionStatus.updPrintFile = true;
            this.appService.updPrintFile(user, printer).then((val: any) => {

                console.log("PrintFile Updated")
                this.scope.routing.transactionStatus.updPrintFile = false;
                this.sendXML();

            }, (err: any) => {
                this.scope.routing.transactionStatus.addPrintFile = true;
                this.appService.addPrintFile(user, printer).then((val: any) => {

                    console.log("PrintFile Updated")
                    this.scope.routing.transactionStatus.addPrintFile = false;
                    this.sendXML();
                    this.getPrinters();

                }, (err: any) => {

                    let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    this.showError(error, [err.errorMessage]);
                    this.scope.routing.transactionStatus.addPrintFile = false;
                    this.refreshTransactionStatus();
                });
                
                this.scope.routing.transactionStatus.updPrintFile = false;
                this.refreshTransactionStatus();
            });

        }

        private printRoutingSheet(): void {
            if (this.scope.routing.routingSheetGrid.data.length > 0) {
                let updatePrintFile = this.scope.routing.printerSetup.updatePrintFile;
                if (updatePrintFile) {
                    this.updPrintFile();
                } else {
                    this.sendXML();
                }
            }else{
                let warningMessage = "Routing Sheet is Blank";
                this.showWarning(warningMessage, null);
                return;
            }
        }


        private sendXML(): void {

            let connectionString = "";
            let transaction = "sendXML"
            let port = location.port; //if dev, make sure port is in ion con manager
            
            
            this.scope.routing.transactionStatus.LstIONCON = true;

            this.appService.getIONURL(transaction, port).then((val: any) => {

                let data = val.items[0];
                let URL = data.F3A230 + data.F3A330 + data.F3A130; //url + colon + port;
                let path = data.F3A430; // /infor/CustomerApi/"ionapi"/
                let transaction = data.F3PK02;

                connectionString = URL + path + transaction;
               

                this.scope.routing.transactionStatus.LstIONCON = false;

                let printFile;
                let printer = this.scope.routing.printerSetup.printers.selected;
                this.scope.routing.printer.printer = this.scope.routing.printerSetup.printers.selected;

                this.appService.getPrintAddress(printer).then((val: any) => {

                    this.scope.routing.transactionStatus.getPrintAddress = true;
                    this.refreshTransactionStatus();

                    this.scope.routing.printer.printerAddress = val.items[0].PVRA;

                    let dateTime = new Date();

                    let filename = "RoutingSheet_" + this.scope.routing.routingSheet.routingSheetNumber;

                    var doc = document.implementation.createDocument("", "", null);
                    var RootElem = doc.createElement("M3OutDocument");

                    //Metadata
                    var MetadataNode = this.getMetaDataNode(doc, dateTime, filename);
                    RootElem.appendChild(MetadataNode);


                    printFile = this.scope.routing.printer.printFile;

                    //Document 
                    var DocumentNode = doc.createElement("Document");
                    var ZZPRTF = doc.createElement("ZZPRTF");
                    ZZPRTF.setAttribute("Label", "Printer file");
                    ZZPRTF.innerHTML = printFile;
                    DocumentNode.appendChild(ZZPRTF);

                    var ZZXMLT = doc.createElement("ZZXMLT");
                    ZZXMLT.setAttribute("Label", "Variant");
                    ZZXMLT.innerHTML = "05";
                    DocumentNode.appendChild(ZZXMLT);

                    var ZZXMLD = doc.createElement("ZZXMLD");
                    ZZXMLD.setAttribute("Label", "XML variant des");
                    ZZXMLD.innerHTML = "ROUTING SHEET";
                    DocumentNode.appendChild(ZZXMLD);

                    var ZZCSVN = doc.createElement("ZZCSVN");
                    ZZCSVN.setAttribute("Label", "Country version");
                    ZZCSVN.innerHTML = "US";
                    DocumentNode.appendChild(ZZCSVN);

                    //Cover
                    var CoverNode = this.getCoverNode(doc, dateTime);
                    DocumentNode.appendChild(CoverNode);

                    //Formatting
                    var FormattingNode = this.getFormattingNode(doc);
                    DocumentNode.appendChild(FormattingNode);

                    //Header
                    var HeaderNode = this.getHeaderNode(doc);
                    DocumentNode.appendChild(HeaderNode);

                    //DocumentHeader
                    var DocumentHeaderNode = this.getDocumentHeaderNode(doc);
                    DocumentNode.appendChild(DocumentHeaderNode);

                    //SubDocument
                    var SubdocumentNode = this.getSubdocumentNode(doc);
                    DocumentNode.appendChild(SubdocumentNode);

                    //Media
                    var MediaNode = this.getMediaNode(doc, filename);
                    DocumentNode.appendChild(MediaNode);

                    var DataAreaNode = doc.createElement("DataArea");
                    DataAreaNode.appendChild(DocumentNode);
                    RootElem.appendChild(DataAreaNode);
                    doc.appendChild(RootElem);

                    let xml = new XMLSerializer().serializeToString(doc);

                    console.log(xml);


                    var base_url = "https://ion-truex-t.tac.com:7443/infor/"
                    var trans = "CustomerApi/streamserv/sendXML";
                    var url = base_url + trans;
                    //var bearerToken = "";
                    
                    var req = {
                        method: 'POST',
                        url: connectionString,
                        headers: {
                            'Content-Type': undefined
                        },
                        data: xml
                    }
                    this.$http(req).then((val: any) => {
                        console.log(val.response);

                    }, (err: any) => {
                        console.log(err.data);

                    });

                    if (this.scope.routing.downloadXML) {

                        this.FileSaver.saveAs(new Blob([xml], { type: 'text/xml' }), filename);
                    }
                    this.scope.routing.transactionStatus.getPrintAddress = false;
                    this.refreshTransactionStatus();

                }, (err: any) => {
                    let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    this.showError(error, [err.errorMessage]);
                    this.scope.routing.transactionStatus.getPrintAddress = false;
                    this.refreshTransactionStatus();
                });


            }, (err: any) => {
                let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.routing.transactionStatus.LstIONCON = false;
                this.refreshTransactionStatus();
            });

            



        }

        public getMetaDataNode(doc :Document, dateTime: Date, file: string):any {

            //Metadata
            var MetadataNode = doc.createElement("metadata");
            var ZZCONO = doc.createElement("ZZCONO");
            ZZCONO.innerHTML = this.scope.userContext.company;
            MetadataNode.appendChild(ZZCONO);

            var ZZDIVI = doc.createElement("ZZDIVI");
            ZZDIVI.innerHTML = this.scope.userContext.division;
            MetadataNode.appendChild(ZZDIVI);

            var ZZDATE = doc.createElement("ZZDATE");
            //ZZDATE.innerHTML = "2019-05-07";

            var MM = ((dateTime.getMonth() + 1) < 10 ? '0' : '') + (dateTime.getMonth() + 1);
            var dd = (dateTime.getDate() < 10 ? '0' : '') + dateTime.getDate();
            ZZDATE.innerHTML = dateTime.getFullYear() + "-" + MM + "-" + dd;
            MetadataNode.appendChild(ZZDATE);

            var ZZTIME = doc.createElement("ZZTIME");
            //ZZTIME.innerHTML = "13:51:06-05:00";
            var hr = (dateTime.getHours() < 10 ? '0' : '') + dateTime.getHours();
            var min = (dateTime.getMinutes() < 10 ? '0' : '') + dateTime.getMinutes();
            var sec = (dateTime.getSeconds() < 10 ? '0' : '') + dateTime.getSeconds();
            ZZTIME.innerHTML =hr + ":" + min + ":" + sec;
            MetadataNode.appendChild(ZZTIME);

            var ZZUSER = doc.createElement("ZZUSER");
            ZZUSER.innerHTML = this.scope.userContext.m3User;
            MetadataNode.appendChild(ZZUSER);

            var ZZBJNO = doc.createElement("ZZBJNO");
            //ZZBJNO.innerHTML = "025705817566651720";
            MetadataNode.appendChild(ZZBJNO);

            var ZZPRTF = doc.createElement("ZZPRTF");
            ZZPRTF.innerHTML = this.scope.routing.printer.printFile;
            MetadataNode.appendChild(ZZPRTF);

            var ZZFILE = doc.createElement("ZZFILE");
            ZZFILE.innerHTML =  file;
            MetadataNode.appendChild(ZZFILE);

            var ZZSIID = doc.createElement("ZZSIID");
            ZZSIID.innerHTML = "TEST_XML";
            MetadataNode.appendChild(ZZSIID);

            return MetadataNode;
        }

        public getCoverNode(doc: Document, dateTime: Date): any {

            var CoverNode = doc.createElement("Cover");
            var HeadingNode = doc.createElement("Heading");

            var ZZUBPG = doc.createElement("ZZUBPG");
            ZZUBPG.innerHTML="PMS240";
            HeadingNode.appendChild(ZZUBPG);

            var ZZPR40 = doc.createElement("ZZPR40");
            ZZPR40.innerHTML="Manufact Order. Print Documents";
            HeadingNode.appendChild(ZZPR40);


            var ZZDATE = doc.createElement("ZZDATE");
            //ZZDATE.innerHTML = "2019-05-07";

            var MM = ((dateTime.getMonth() + 1) < 10 ? '0' : '') + (dateTime.getMonth() + 1);
            var dd = (dateTime.getDate() < 10 ? '0' : '') + dateTime.getDate();
            ZZDATE.innerHTML = dateTime.getFullYear() + "-" + MM + "-" + dd;
            HeadingNode.appendChild(ZZDATE);

            var ZZTIME = doc.createElement("ZZTIME");
            //ZZTIME.innerHTML = "13:51:06-05:00";
            var hr = (dateTime.getHours() < 10 ? '0' : '') + dateTime.getHours();
            var min = (dateTime.getMinutes() < 10 ? '0' : '') + dateTime.getMinutes();
            var sec = (dateTime.getSeconds() < 10 ? '0' : '') + dateTime.getSeconds();
            ZZTIME.innerHTML =hr + ":" + min + ":" + sec;
            HeadingNode.appendChild(ZZTIME);

            var ZZUSER = doc.createElement("ZZUSER");
            ZZUSER.innerHTML=this.scope.userContext.m3User;;
            HeadingNode.appendChild(ZZUSER);

            var ZZSPGM = doc.createElement("ZZSPGM");
            ZZSPGM.innerHTML="PMS241";
            HeadingNode.appendChild(ZZSPGM);

            var ZZROW2 = doc.createElement("ZZROW2");
            ZZROW2.innerHTML="***  ***";
            HeadingNode.appendChild(ZZROW2);

            var ZZROW3 = doc.createElement("ZZROW3");
            ZZROW3.innerHTML="*** TRUEX COMPANY (005/005) ***";
            HeadingNode.appendChild(ZZROW3);

            CoverNode.appendChild(HeadingNode);

            return CoverNode;
        }


        public getFormattingNode(doc: Document): any {

            var FormattingNode = doc.createElement("Formatting");

            var M3StandardFormatVersion = doc.createElement("M3StandardFormatVersion");
            M3StandardFormatVersion.innerHTML = "1";
            FormattingNode.appendChild(M3StandardFormatVersion);

            var ReportLayout = doc.createElement("ReportLayout");
            ReportLayout.innerHTML = "M3_STD_05-01";
            FormattingNode.appendChild(ReportLayout);

            var Structure = doc.createElement("Structure");
            Structure.innerHTML = "M3_STD_05-01";
            FormattingNode.appendChild(Structure);

            var PaperSize =  doc.createElement("PaperSize");
            PaperSize.innerHTML = "LETTER";
            FormattingNode.appendChild(PaperSize);

            var LocalizationNode = doc.createElement("Localization");

            var DocumentDivisionNode = doc.createElement("DocumentDivision");
            DocumentDivisionNode.innerHTML = this.scope.userContext.division;
            LocalizationNode.appendChild(DocumentDivisionNode);

            var CountryVersion = doc.createElement("CountryVersion");
            CountryVersion.innerHTML="US";
            LocalizationNode.appendChild(CountryVersion);

            var BaseCountry = doc.createElement("BaseCountry");
            BaseCountry.innerHTML="US";
            LocalizationNode.appendChild(BaseCountry);

            var FromToCountry = doc.createElement("FromToCountry")
            FromToCountry.innerHTML="US";
            LocalizationNode.appendChild(FromToCountry);

            var DocumentLanguage = doc.createElement("DocumentLanguage");
            DocumentLanguage.innerHTML="GB";
            LocalizationNode.appendChild(DocumentLanguage);

            var Locale = doc.createElement("Locale");
            Locale.innerHTML="en-US";
            LocalizationNode.appendChild(Locale);

            var DateFormat = doc.createElement("DateFormat");
            DateFormat.innerHTML="YYMMDD";
            LocalizationNode.appendChild(DateFormat);

            var DecimalFormat = doc.createElement("DecimalFormat");
            LocalizationNode.appendChild(DecimalFormat);

            var ThousandSeparator = doc.createElement("ThousandSeparator");
            ThousandSeparator.innerHTML="."
            LocalizationNode.appendChild(ThousandSeparator);

            var DocumentInformationNode =  doc.createElement("DocumentInformation");
            
            var DebitCreditCodeUsed = doc.createElement("DebitCreditCodeUsed");
            DebitCreditCodeUsed.innerHTML = false;
            DocumentInformationNode.appendChild(DebitCreditCodeUsed);

            FormattingNode.appendChild(LocalizationNode);
            FormattingNode.appendChild(DocumentInformationNode);
            return FormattingNode;
        }

        public getHeaderNode(doc: Document): any {

            var HeaderNode = doc.createElement("Header");
            HeaderNode.setAttribute("Label", "Header");

            var AddressNode = doc.createElement("Address")
            AddressNode.setAttribute("Label", "Company address");
            AddressNode.setAttribute("Type", "Company")

            var xxCUNM = doc.createElement("xxCUNM");
            xxCUNM.innerHTML = this.scope.routing.warehouseDetails.CONM;
            AddressNode.appendChild(xxCUNM);

            var xxADR1 = doc.createElement("xxADR1");
            xxADR1.innerHTML = this.scope.routing.warehouseDetails.ADR1;
            AddressNode.appendChild(xxADR1);

            var xxADR2 = doc.createElement("xxADR2");
            xxADR2.innerHTML = this.scope.routing.warehouseDetails.ADR2;
            AddressNode.appendChild(xxADR2);

            var xxADR3 = doc.createElement("xxADR3");
            xxADR3.innerHTML = this.scope.routing.warehouseDetails.ADR3;
            AddressNode.appendChild(xxADR3);

            var xxADR4 = doc.createElement("xxADR4");
            xxADR4.innerHTML = this.scope.routing.warehouseDetails.ADR4;
            AddressNode.appendChild(xxADR4);

            HeaderNode.appendChild(AddressNode);
            return HeaderNode;
        }
        
        

        public getDocumentHeaderNode(doc: Document): any {
            
            var DocumentHeaderNode = doc.createElement("DocumentHeader");
            DocumentHeaderNode.setAttribute("Label", "Document header");
            
            var F1A130 = doc.createElement("F1A130");
            F1A130.setAttribute("Label", "Mfg U/M");
            F1A130.innerHTML = this.scope.routing.routingSheet.data[0].F1A130;
            DocumentHeaderNode.appendChild(F1A130);
            
            var F1N296 = doc.createElement("F1N296");
            F1N296.setAttribute("Label", "Final MO number");
            F1N296.innerHTML = this.scope.routing.routingSheet.data[0].F1N296;
            DocumentHeaderNode.appendChild(F1N296);

            var F1A630 = doc.createElement("F1A630");
            F1A630.setAttribute("Label", "Final Product");
            F1A630.innerHTML = this.scope.routing.routingSheet.data[0].F1A630;
            DocumentHeaderNode.appendChild(F1A630);

            var M3USID = doc.createElement("M3USID");
            M3USID.setAttribute("Label", "Responsible");
            M3USID.innerHTML = this.scope.routing.routingSheet.responsible;
            DocumentHeaderNode.appendChild(M3USID);

            var F1A730 = doc.createElement("F1A730");
            F1A730.setAttribute("Label", "Name");
            F1A730.innerHTML = this.scope.routing.routingSheet.data[0].F1A530;
            DocumentHeaderNode.appendChild(F1A730);

            var F1N096 = doc.createElement("F1N096");
            F1N096.setAttribute("Label", "Order qty");
            F1N096.innerHTML = this.scope.routing.routingSheet.data[0].F1N096;
            DocumentHeaderNode.appendChild(F1N096);

            var F1DAT1 = doc.createElement("F1DAT1");
            F1DAT1.setAttribute("Label", "Start date");
            F1DAT1.innerHTML = this.scope.routing.routingSheet.startDate;
            DocumentHeaderNode.appendChild(F1DAT1);

            var F1PK02 = doc.createElement("F1PK02");
            F1PK02.setAttribute("Label", "Router Number");
            F1PK02.innerHTML = this.scope.routing.routingSheet.routingSheetNumber;
            DocumentHeaderNode.appendChild(F1PK02);

            return DocumentHeaderNode;
        }

        public getMediaNode(doc: Document, file: string): any {
            let printFile = this.scope.routing.printer.printFile;
            let printer = this.scope.routing.printer.printer;
            let user = this.scope.routing.printer.user;   
            let printAddress = this.scope.routing.printer.printerAddress;
            
            var MediaNode = doc.createElement("Media");

            var PrintNode = doc.createElement("Printer");

            var PrinterAddress = doc.createElement("PrinterAddress");
            PrinterAddress.innerHTML = printAddress;
            PrintNode.appendChild(PrinterAddress);

            var PrinterModification = doc.createElement("PrinterModification");
            PrinterModification.innerHTML = "";
            PrintNode.appendChild(PrinterModification);
            
            var NumberOfCopies = doc.createElement("NumberOfCopies");
            NumberOfCopies.innerHTML = this.scope.routing.routingSheet.numberOfCopies;
            PrintNode.appendChild(NumberOfCopies);
            
            var Archive = doc.createElement("Archive");
            Archive.innerHTML = false
            PrintNode.appendChild(Archive);

            var MailNode = doc.createElement("Mail");
            
            let email = "";
            if (this.scope.routing.sendEmail) {
                email = user + "@teknorapex.com";
            }

            var ToMail = doc.createElement("ToMail")
            ToMail.innerHTML=email; //TODO:
            MailNode.appendChild(ToMail);

            var FromMail = doc.createElement("FromMail")
            FromMail.innerHTML="apus@truex.com"; //TODO:
            MailNode.appendChild(FromMail);

            var Archive = doc.createElement("Archive")
            Archive.innerHTML = false;
            MailNode.appendChild(Archive);

            var ReportFileType = doc.createElement("ReportFileType")
            ReportFileType.innerHTML = "PDF";
            MailNode.appendChild(ReportFileType);


            var FileNode = doc.createElement("File");

            var FilePath = doc.createElement("FilePath");
            FilePath.innerHTML=""; //TODO:
            FileNode.appendChild(FilePath);

            var FileName = doc.createElement("FileName");
            FileName.innerHTML=""; //TODO:
            FileNode.appendChild(FileName);

            var Archive = doc.createElement("Archive")
            Archive.innerHTML = false;
            FileNode.appendChild(Archive);

            var ReportFileType = doc.createElement("ReportFileType")
            ReportFileType.innerHTML = "PDF";
            FileNode.appendChild(ReportFileType);

            var ArchiveNode = doc.createElement("Archive");

            var Company = doc.createElement("Company");
            Company.setAttribute("Name", "M3_Company");
            Company.innerHTML = this.scope.userContext.company;
            ArchiveNode.appendChild(Company);

            var Division = doc.createElement("Division");
            Division.setAttribute("Name", "M3_Division");
            Division.innerHTML = this.scope.userContext.division;
            ArchiveNode.appendChild(Division);

            var AccountingEntity = doc.createElement("AccountingEntity");
            AccountingEntity.setAttribute("Name", "M3_AccountingEntity");
            AccountingEntity.innerHTML =  this.scope.userContext.company + "_" + this.scope.userContext.division;
            ArchiveNode.appendChild(AccountingEntity);


            var DocumentType = doc.createElement("DocumentType");
            DocumentType.innerHTML = printFile;
            ArchiveNode.appendChild(DocumentType);

            var Acl = doc.createElement("Acl");
            Acl.innerHTML = "PMZ242PFACL";//??
            ArchiveNode.appendChild(Acl);

            var FileName = doc.createElement("FileName");
            FileName.innerHTML = file;
            ArchiveNode.appendChild(FileName);

            var Attribute1 = doc.createElement("Attribute");
            Attribute1.setAttribute("Name","M3ROUT");

            var Value1 = doc.createElement("Value");
            Value1.innerHTML = this.scope.routing.routingSheet.routingSheetNumber;
            Attribute1.appendChild(Value1);

            ArchiveNode.appendChild(Attribute1);

            var Attribute2 = doc.createElement("Attribute");
            Attribute2.setAttribute("Name","M3ITNO");

            var Value2 = doc.createElement("Value");
            Value2.innerHTML = this.scope.routing.routingSheet.finalProduct;
            Attribute2.appendChild(Value2);

            ArchiveNode.appendChild(Attribute2);

            var Attribute3 = doc.createElement("Attribute");
            Attribute3.setAttribute("Name","M3PRNO");

            var Value3 = doc.createElement("Value");
            Value3.innerHTML = this.scope.routing.routingSheet.finalMO;
            Attribute3.appendChild(Value3);

            ArchiveNode.appendChild(Attribute3);

            MediaNode.appendChild(PrintNode);
            MediaNode.appendChild(MailNode);
            MediaNode.appendChild(FileNode);
            MediaNode.appendChild(ArchiveNode);

            return MediaNode;
        }
        
        
        

        public getSubdocumentNode(doc: Document): any {

            var SubdocumentNode = doc.createElement("Subdocument");
            SubdocumentNode.setAttribute("Label", "Subdocument");

            var xxSUBD = doc.createElement("xxSUBD");
            xxSUBD.setAttribute("Label", "Subdocument");
            xxSUBD.innerHTML=true;
            SubdocumentNode.appendChild(xxSUBD);

            var RouteNode = doc.createElement("Route");
            RouteNode.setAttribute("Label", "Route");

            var F1PK03 = doc.createElement("F1PK03");
            F1PK03.setAttribute("Label","Sequence");
            F1PK03.innerHTML = "";
            RouteNode.appendChild(F1PK03);

            var F1A030 = doc.createElement("F1A030");
            F1A030.setAttribute("Label","MO Number");
            F1A030.innerHTML = "";
            RouteNode.appendChild(F1A030);

            var F1A530 = doc.createElement("F1A530");
            F1A530.setAttribute("Label","Item Number");
            F1A530.innerHTML = "";
            RouteNode.appendChild(F1A530);

            var F1A530 = doc.createElement("F1A540");
            F1A530.setAttribute("Label", "Item Name");
            F1A530.innerHTML = "";
            RouteNode.appendChild(F1A530); 
            //<F1A530 Lable="Item Name"/>

            var WCDESC = doc.createElement("WCDESC");
            WCDESC.setAttribute("Label","Op description");
            WCDESC.innerHTML = "";
            RouteNode.appendChild(WCDESC);

            var WCOPER = doc.createElement("WCOPER");
            WCOPER.setAttribute("Label","Op No.");
            WCOPER.innerHTML = "";
            RouteNode.appendChild(WCOPER);

            var WCNAME = doc.createElement("WCNAME");
            WCNAME.setAttribute("Label","W/C");
            WCNAME.innerHTML = "";
            RouteNode.appendChild(WCNAME);

            var WCREPT = doc.createElement("WCREPT");
            WCREPT.setAttribute("Label","Reporting No.");
            WCREPT.innerHTML = "";
            RouteNode.appendChild(WCREPT);

            this.scope.routing.routingSheet.itemComponents.forEach((components) => {
                //console.log(components);
                if (components.PMBYPR != 1) {

                    var ItemComponents = doc.createElement("Component");
                    var MTNO = doc.createElement("MTNO");
                    MTNO.innerHTML = components.PMMTNO;
                    ItemComponents.appendChild(MTNO);

                    var ITDS = doc.createElement("ITDS");
                    ITDS.innerHTML = components.MMITDS;
                    ItemComponents.appendChild(ITDS);
                    RouteNode.appendChild(ItemComponents);
                }
            });
            
            this.scope.routing.routingSheet.data.forEach((MOs: any, index: any) => {
                var ItemNode = doc.createElement("Item");

                var F1PK03 = doc.createElement("F1PK03");
                F1PK03.innerHTML = MOs.F1PK03;
                ItemNode.appendChild(F1PK03);

                var F1PK01 = doc.createElement("F1PK01");
                F1PK01.innerHTML = MOs.F1PK01;
                ItemNode.appendChild(F1PK01);
                
                var F1A030 = doc.createElement("F1A030");
                F1A030.innerHTML = MOs.F1A030;
                ItemNode.appendChild(F1A030);

                var F1A530 = doc.createElement("F1A530");
                F1A530.innerHTML = MOs.F1A530;
                ItemNode.appendChild(F1A530);

                var F1N096 = doc.createElement("F1N096");
                F1N096.innerHTML = MOs.F1N096;
                ItemNode.appendChild(F1N096);

                RouteNode.appendChild(ItemNode);

                var OperationNode1 = doc.createElement("Operation");

                var F1A230 = doc.createElement("F1A230");
                F1A230.innerHTML = MOs.F1A230;
                OperationNode1.appendChild(F1A230);

                var F1N396 = doc.createElement("F1N396");
                F1N396.innerHTML = parseInt(MOs.F1N396).toString();
                OperationNode1.appendChild(F1N396);

                var F1A830 = doc.createElement("F1A830");
                F1A830.innerHTML = MOs.F1A830;
                OperationNode1.appendChild(F1A830);

                var F1N596 = doc.createElement("F1N596");
                F1N596.setAttribute("Label", "Print bar codes");
                F1N596.innerHTML = MOs.F1PK01 // CHANGED SO THE BARCODE IS THE MO;
                OperationNode1.appendChild(F1N596);

                RouteNode.appendChild(OperationNode1);

                //Suppress Operation2 if F1N396=F1N496
                if(MOs.F1N396 !== MOs.F1N496) {
                    var OperationNode2 = doc.createElement("Operation");
                    
                    var F1A330 = doc.createElement("F1A330");
                    F1A330.innerHTML = MOs.F1A330;
                    OperationNode2.appendChild(F1A330);

                    var F1N496 = doc.createElement("F1N496");
                    F1N496.innerHTML = MOs.F1N496;
                    OperationNode2.appendChild(F1N496);

                    var F1A930 = doc.createElement("F1A930");
                    F1A930.innerHTML = MOs.F1A930;
                    OperationNode2.appendChild(F1A930);

                    var F1N496 = doc.createElement("F1N496");
                    F1N496.setAttribute("Label", "Print bar codes");
                    F1N496.innerHTML = MOs.F1N496;
                    OperationNode2.appendChild(F1N496);

                    RouteNode.appendChild(OperationNode2)
                }
                
            });
            
       
            
            SubdocumentNode.appendChild(RouteNode);
            return SubdocumentNode;
        }
        
        public getIONCON(transaction: string, port: string): any {
            
        }
        
        

        //*************************************************Application specific functions ends*************************************************/

    }
}