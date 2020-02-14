var h5;
(function (h5) {
    var application;
    (function (application) {
        var AppController = (function () {
            function AppController(scope, configService, appService, restService, storageService, gridService, userService, languageService, $uibModal, $interval, $timeout, $filter, $q, $window, formService, $location, $http, FileSaver) {
                this.scope = scope;
                this.configService = configService;
                this.appService = appService;
                this.restService = restService;
                this.storageService = storageService;
                this.gridService = gridService;
                this.userService = userService;
                this.languageService = languageService;
                this.$uibModal = $uibModal;
                this.$interval = $interval;
                this.$timeout = $timeout;
                this.$filter = $filter;
                this.$q = $q;
                this.$window = $window;
                this.formService = formService;
                this.$location = $location;
                this.$http = $http;
                this.FileSaver = FileSaver;
                this.init();
            }
            AppController.prototype.init = function () {
                var _this = this;
                this.scope.appReady = false;
                this.scope.loadingData = false;
                this.scope.statusBar = [];
                this.scope.statusBarIsCollapsed = true;
                this.scope.statusBarVisible = true;
                this.languageService.getAppLanguage().then(function (val) {
                    _this.scope.languageConstants = _this.languageService.languageConstants;
                    _this.initApplication();
                }, function (errorResponse) {
                    Odin.Log.error("Error getting language constants " + errorResponse);
                    _this.scope.statusBar.push({ message: "Error getting language constants" + errorResponse, statusBarMessageType: _this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                });
                if (this.$window.innerWidth <= 768) {
                    this.scope.showSideNavLabel = false;
                    this.scope.showSideNav = false;
                }
                else {
                    this.scope.showSideNavLabel = true;
                    this.scope.showSideNav = true;
                }
            };
            AppController.prototype.initApplication = function () {
                var _this = this;
                this.initGlobalConfig();
                this.initAppScope();
                this.initUIGrids();
                this.initScopeFunctions();
                this.$timeout(function () { _this.scope.appReady = true; }, 5000);
                this.initApplicationConstants();
            };
            AppController.prototype.initGlobalConfig = function () {
                var _this = this;
                this.configService.getGlobalConfig().then(function (configData) {
                    _this.scope.globalConfig = configData;
                    _this.initLanguage();
                    _this.initTheme();
                    _this.getUserContext();
                    _this.initModule();
                }, function (errorResponse) {
                    Odin.Log.error("Error while getting global configuration " + errorResponse);
                    _this.scope.statusBar.push({ message: "Error while getting global configuration " + errorResponse, statusBarMessageType: _this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.initAppScope = function () {
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
                    routing: { url: "views/Routing.html" },
                    errorModule: { url: "views/Error.html" }
                };
                this.scope.modules = [
                    { moduleId: 1, activeIcon: '', inactiveIcon: '', heading: 'Routing Application', content: this.scope.views.routing.url, active: true, available: true }
                ];
                this.scope.appConfig = {};
                this.scope.userContext = new M3.UserContext();
                this.scope["dateRef"] = new Date();
                this.initGlobalSelection();
                this.initRouting();
            };
            AppController.prototype.initGlobalSelection = function () {
                this.scope.globalSelection = {
                    reload: true,
                    transactionStatus: {}
                };
            };
            AppController.prototype.initRouting = function () {
                this.scope.routing = {
                    reload: true,
                    explodedBomGrid: {},
                    openMOsGrid: {},
                    routingSheetGrid: {},
                    finalProductSearchGrid: {},
                    openMOsGridData: [],
                    warehouse: "",
                    warehouseDetails: [],
                    sequence: 0,
                    downloadXML: false,
                    sendEmail: true,
                    printerSetup: {
                        printers: [],
                        updatePrintFile: false,
                    },
                    printer: {
                        printer: "",
                        printerAddress: "",
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
                        selectedItemDetails: []
                    },
                    openMos: {
                        facility: "",
                        product: "",
                        selectedItems: [],
                        routingSheetNumber: ""
                    },
                    routingSheet: {
                        facility: "",
                        structureType: "",
                        finalProduct: "",
                        finalMO: "",
                        routingSheetNumber: "",
                        selectedItems: [],
                        data: [],
                        itemComponents: [],
                        responsible: "",
                        startDate: "",
                        status: 0,
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
            };
            AppController.prototype.initApplicationConstants = function () {
            };
            AppController.prototype.initScopeFunctions = function () {
            };
            AppController.prototype.initUIGrids = function () {
                this.scope.routing.explodedBomGrid = this.gridService.getExplodedBomGrid();
                this.scope.routing.openMOsGrid = this.gridService.getOpenMosGrid();
                this.scope.routing.routingSheetGrid = this.gridService.getRoutingSheetGrid();
                this.scope.routing.finalProductSearchGrid = this.gridService.getFinalProdSearchGrid();
                this.initUIGridsOnRegisterApi();
            };
            AppController.prototype.initUIGridsOnRegisterApi = function () {
                var _this = this;
                this.scope.routing.explodedBomGrid.onRegisterApi = function (gridApi) {
                    _this.scope.routing.explodedBomGrid.gridApi = gridApi;
                    _this.gridService.adjustGridHeight("explodedBomGrid", _this.scope.routing.explodedBomGrid.data.length, 500);
                    gridApi.core.on.renderingComplete(_this.scope, function (handler) { _this.gridService.restoreGridState("explodedBomGrid", gridApi); });
                    gridApi.core.on.sortChanged(_this.scope, function (handler) { _this.gridService.saveGridState("explodedBomGrid", gridApi); });
                    gridApi.core.on.columnVisibilityChanged(_this.scope, function (handler) { _this.gridService.saveGridState("explodedBomGrid", gridApi); });
                    gridApi.core.on.filterChanged(_this.scope, function (handler) { _this.gridService.saveGridState("explodedBomGrid", gridApi); });
                    gridApi.colMovable.on.columnPositionChanged(_this.scope, function (handler) { _this.gridService.saveGridState("explodedBomGrid", gridApi); });
                    gridApi.colResizable.on.columnSizeChanged(_this.scope, function (handler) { _this.gridService.saveGridState("explodedBomGrid", gridApi); });
                    gridApi.cellNav.on.viewPortKeyDown(_this.scope, function (event) {
                        if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                            var cells = gridApi.cellNav.getCurrentSelection();
                            _this.copyCellContentToClipBoard(cells);
                        }
                    });
                    gridApi.selection.on.rowSelectionChanged(_this.scope, function (row) {
                        _this.exBomRowSelected(row);
                    });
                };
                this.scope.routing.openMOsGrid.onRegisterApi = function (gridApi) {
                    _this.scope.routing.openMOsGrid.gridApi = gridApi;
                    _this.gridService.adjustGridHeight("openMOsGrid", _this.scope.routing.openMOsGrid.data.length, 500);
                    gridApi.core.on.renderingComplete(_this.scope, function (handler) { _this.gridService.restoreGridState("openMOsGrid", gridApi); });
                    gridApi.core.on.sortChanged(_this.scope, function (handler) { _this.gridService.saveGridState("openMOsGrid", gridApi); });
                    gridApi.core.on.columnVisibilityChanged(_this.scope, function (handler) { _this.gridService.saveGridState("openMOsGrid", gridApi); });
                    gridApi.core.on.filterChanged(_this.scope, function (handler) { _this.gridService.saveGridState("openMOsGrid", gridApi); });
                    gridApi.colMovable.on.columnPositionChanged(_this.scope, function (handler) { _this.gridService.saveGridState("openMOsGrid", gridApi); });
                    gridApi.colResizable.on.columnSizeChanged(_this.scope, function (handler) { _this.gridService.saveGridState("openMOsGrid", gridApi); });
                    gridApi.cellNav.on.viewPortKeyDown(_this.scope, function (event) {
                        if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                            var cells = gridApi.cellNav.getCurrentSelection();
                            _this.copyCellContentToClipBoard(cells);
                        }
                    });
                    gridApi.selection.on.rowSelectionChanged(_this.scope, function (row) {
                        _this.gridService.saveGridState("openMOsGrid", gridApi);
                        _this.openMOsSelected(gridApi.selection.getSelectedRows());
                    });
                    gridApi.selection.on.rowSelectionChangedBatch(_this.scope, function (row) {
                        _this.gridService.saveGridState("openMOsGrid", gridApi);
                        _this.openMOsSelected(gridApi.selection.getSelectedRows());
                    });
                };
                this.scope.routing.routingSheetGrid.onRegisterApi = function (gridApi) {
                    _this.scope.routing.routingSheetGrid.gridApi = gridApi;
                    _this.gridService.adjustGridHeight("routingSheetGrid", _this.scope.routing.routingSheetGrid.data.length, 500);
                    gridApi.core.on.renderingComplete(_this.scope, function (handler) { _this.gridService.restoreGridState("routingSheetGrid", gridApi); });
                    gridApi.core.on.sortChanged(_this.scope, function (handler) { _this.gridService.saveGridState("routingSheetGrid", gridApi); });
                    gridApi.core.on.columnVisibilityChanged(_this.scope, function (handler) { _this.gridService.saveGridState("routingSheetGrid", gridApi); });
                    gridApi.core.on.filterChanged(_this.scope, function (handler) { _this.gridService.saveGridState("routingSheetGrid", gridApi); });
                    gridApi.colMovable.on.columnPositionChanged(_this.scope, function (handler) { _this.gridService.saveGridState("routingSheetGrid", gridApi); });
                    gridApi.colResizable.on.columnSizeChanged(_this.scope, function (handler) { _this.gridService.saveGridState("routingSheetGrid", gridApi); });
                    gridApi.cellNav.on.viewPortKeyDown(_this.scope, function (event) {
                        if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                            var cells = gridApi.cellNav.getCurrentSelection();
                            _this.copyCellContentToClipBoard(cells);
                        }
                    });
                    gridApi.selection.on.rowSelectionChanged(_this.scope, function (row) {
                        _this.gridService.saveGridState("routingSheetGrid", gridApi);
                        _this.routingSheetSelected(gridApi.selection.getSelectedRows());
                    });
                    gridApi.selection.on.rowSelectionChangedBatch(_this.scope, function (row) {
                        _this.gridService.saveGridState("routingSheetGrid", gridApi);
                        _this.routingSheetSelected(gridApi.selection.getSelectedRows());
                    });
                };
                this.scope.routing.finalProductSearchGrid.onRegisterApi = function (gridApi) {
                    _this.scope.routing.finalProductSearchGrid.gridApi = gridApi;
                    _this.gridService.adjustGridHeight("finalProductSearchGrid", _this.scope.routing.finalProductSearchGrid.data.length, 500);
                    gridApi.core.on.renderingComplete(_this.scope, function (handler) { _this.gridService.restoreGridState("finalProductSearchGrid", gridApi); });
                    gridApi.core.on.sortChanged(_this.scope, function (handler) { _this.gridService.saveGridState("finalProductSearchGrid", gridApi); });
                    gridApi.core.on.columnVisibilityChanged(_this.scope, function (handler) { _this.gridService.saveGridState("finalProductSearchGrid", gridApi); });
                    gridApi.core.on.filterChanged(_this.scope, function (handler) { _this.gridService.saveGridState("finalProductSearchGrid", gridApi); });
                    gridApi.colMovable.on.columnPositionChanged(_this.scope, function (handler) { _this.gridService.saveGridState("finalProductSearchGrid", gridApi); });
                    gridApi.colResizable.on.columnSizeChanged(_this.scope, function (handler) { _this.gridService.saveGridState("finalProductSearchGrid", gridApi); });
                    gridApi.cellNav.on.viewPortKeyDown(_this.scope, function (event) {
                        if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                            var cells = gridApi.cellNav.getCurrentSelection();
                            _this.copyCellContentToClipBoard(cells);
                        }
                    });
                    gridApi.selection.on.rowSelectionChanged(_this.scope, function (row) {
                        _this.clearExplodedBomPage();
                        _this.clearOpenMOsPage();
                        _this.clearRoutingSheetPage();
                        _this.finalProductRowSelected(row);
                        _this.scope.IsDisabled = false;
                    });
                };
            };
            AppController.prototype.resetUIGridsColumnDefs = function () {
            };
            AppController.prototype.initTheme = function () {
                var _this = this;
                var themeId = this.storageService.getLocalData('h5.app.appName.theme.selected');
                var textureId = this.storageService.getLocalData('h5.app.appName.texture.selected');
                themeId = angular.isNumber(themeId) ? themeId : angular.isNumber(this.scope.globalConfig.defaultThemeId) ? this.scope.globalConfig.defaultThemeId : 1;
                textureId = angular.isNumber(textureId) ? textureId : angular.isNumber(this.scope.globalConfig.defaultTextureId) ? this.scope.globalConfig.defaultTextureId : 1;
                this.themeSelected(themeId);
                this.textureSelected(textureId);
                this.scope.themes.forEach(function (theme) {
                    if (_this.scope.globalConfig.excludeThemes.indexOf(theme.themeId) > -1) {
                        theme.available = false;
                    }
                    else {
                        theme.available = true;
                    }
                });
                this.scope.textures.forEach(function (texture) {
                    if (_this.scope.globalConfig.excludeWallpapers.indexOf(texture.textureId) > -1) {
                        texture.available = false;
                    }
                    else {
                        texture.available = true;
                    }
                });
            };
            AppController.prototype.initModule = function () {
                var _this = this;
                var moduleId = this.storageService.getLocalData('h5.app.appName.module.selected');
                moduleId = angular.isNumber(moduleId) ? moduleId : 1;
                this.scope.activeModule = moduleId;
                this.scope.modules.forEach(function (appmodule) {
                    if (angular.equals(moduleId, appmodule.moduleId)) {
                        appmodule.active = true;
                    }
                    else {
                        appmodule.active = false;
                    }
                    if (_this.scope.globalConfig.excludeModules.indexOf(appmodule.moduleId) > -1) {
                        appmodule.available = false;
                    }
                    else {
                        appmodule.available = true;
                    }
                });
            };
            AppController.prototype.initLanguage = function () {
                var _this = this;
                var languageCode = this.storageService.getLocalData('h5.app.appName.language.selected');
                languageCode = angular.isString(languageCode) ? languageCode : angular.isString(this.scope.globalConfig.defaultLanguage) ? this.scope.globalConfig.defaultLanguage : "en-US";
                this.scope.currentLanguage = languageCode;
                if (!angular.equals(this.scope.currentLanguage, "en-US")) {
                    this.languageService.changeAppLanguage(languageCode).then(function (val) {
                        _this.resetUIGridsColumnDefs();
                    }, function (errorResponse) {
                        Odin.Log.error("Error getting language " + errorResponse);
                        _this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: _this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                    });
                }
                this.scope.supportedLanguages.forEach(function (language) {
                    if (angular.equals(language.languageCode, languageCode)) {
                        language.active = true;
                    }
                    else {
                        language.active = false;
                    }
                    if (_this.scope.globalConfig.excludeLanguages.indexOf(language.languageCode) > -1) {
                        language.available = false;
                    }
                    else {
                        language.available = true;
                    }
                });
            };
            AppController.prototype.themeSelected = function (themeId) {
                var _this = this;
                this.scope.themes.forEach(function (theme) {
                    if (angular.equals(theme.themeId, themeId)) {
                        theme.active = true;
                        _this.scope.theme = theme;
                    }
                    else {
                        theme.active = false;
                    }
                });
                this.storageService.setLocalData('h5.app.appName.theme.selected', themeId);
            };
            AppController.prototype.textureSelected = function (textureId) {
                var _this = this;
                this.scope.textures.forEach(function (texture) {
                    if (angular.equals(texture.textureId, textureId)) {
                        texture.active = true;
                        _this.scope.texture = texture;
                    }
                    else {
                        texture.active = false;
                    }
                });
                this.storageService.setLocalData('h5.app.appName.texture.selected', textureId);
            };
            AppController.prototype.getUserContext = function () {
                var _this = this;
                Odin.Log.debug("is H5 " + this.userService.isH5() + " is Iframe " + Odin.Util.isIframe());
                this.userService.getUserContext().then(function (val) {
                    _this.scope.userContext = val;
                    _this.loadGlobalData();
                }, function (reason) {
                    Odin.Log.error("Can't get user context from h5 due to " + reason.errorMessage);
                    _this.scope.statusBar.push({ message: "Can't get user context from h5 " + [reason.errorMessage], statusBarMessageType: _this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                    _this.showError("Can't get user context from h5 ", [reason.errorMessage]);
                    _this.loadGlobalData();
                });
            };
            AppController.prototype.launchM3Program = function (link) {
                Odin.Log.debug("H5 link to launch -->" + link);
                this.formService.launch(link);
            };
            AppController.prototype.mapKeyUp = function (event) {
                if (event.keyCode === 115 && document.activeElement.name === "finalProduct") {
                    this.clearFinalProductSearchPage();
                    this.openFinalProductSearchPage();
                }
            };
            AppController.prototype.addMoreItemsToScroll = function () {
                this.scope.infiniteScroll.currentItems += this.scope.infiniteScroll.numToAdd;
            };
            ;
            AppController.prototype.copyCellContentToClipBoard = function (cells) {
                var hiddenTextArea = angular.element(document.getElementById("gridClipboard"));
                hiddenTextArea.val("");
                var textToCopy = '', rowId = cells[0].row.uid;
                cells.forEach(function (cell) {
                    textToCopy = textToCopy == '' ? textToCopy : textToCopy + ",";
                    var cellValue = cell.row.entity[cell.col.name];
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
            };
            AppController.prototype.openAboutPage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/About.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openChangeThemePage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/ChangeThemeModal.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openChangeWallpaperPage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/ChangeWallpaperModal.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openChangeAppLanguagePage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/ChangeLanguageModal.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.changeAppLanguage = function (languageCode) {
                var _this = this;
                this.scope.supportedLanguages.forEach(function (language) {
                    if (angular.equals(language.languageCode, languageCode)) {
                        language.active = true;
                        _this.scope.currentLanguage = languageCode;
                    }
                    else {
                        language.active = false;
                    }
                });
                this.languageService.changeAppLanguage(languageCode).then(function (val) {
                    _this.scope.appReady = false;
                    _this.closeModalWindow();
                    _this.resetUIGridsColumnDefs();
                    _this.$timeout(function () { _this.scope.appReady = true; }, 1000);
                }, function (errorResponse) {
                    Odin.Log.error("Error getting language " + errorResponse);
                    _this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: _this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                });
                this.storageService.setLocalData('h5.app.appName.language.selected', languageCode);
            };
            AppController.prototype.sideMenuToggler = function () {
                if (this.$window.innerWidth <= 768) {
                    this.scope.showSideNavLabel = false;
                    this.scope.showSideNav = !this.scope.showSideNav;
                }
                else {
                    this.scope.showSideNav = true;
                    this.scope.showSideNavLabel = !this.scope.showSideNavLabel;
                }
            };
            AppController.prototype.closeModalWindow = function () {
                this.scope.modalWindow.close("close");
            };
            AppController.prototype.closeStatusBar = function () {
                this.scope.statusBarIsCollapsed = true;
                this.scope.statusBar = [];
            };
            AppController.prototype.removeStatusBarItemAt = function (index) {
                if (index || index == 0) {
                    this.scope.statusBar.splice(this.scope.statusBar.length - 1 - index, 1);
                }
                this.scope.statusBarIsCollapsed = this.scope.statusBar.length == 0;
            };
            ;
            AppController.prototype.parseError = function (errorResponse) {
                var error = "Error occurred while processing below request(s)";
                var errorMessages = this.scope["errorMessages"];
                var errorMessage = "Request URL: " + errorResponse.config.url + ", Status: " + errorResponse.status +
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
            };
            AppController.prototype.showError = function (error, errorMessages) {
                var _this = this;
                this.scope["hasError"] = true;
                this.scope["error"] = error;
                this.scope["errorMessages"] = errorMessages;
                if (angular.isObject(this.scope["destroyErrMsgTimer"])) {
                    this.$timeout.cancel(this.scope["destroyErrMsgTimer"]);
                }
                this.scope["destroyErrMsgTimer"] = this.$timeout(function () { _this.hideError(); }, 30000);
            };
            AppController.prototype.hideError = function () {
                this.scope["hasError"] = false;
                this.scope["error"] = null;
                this.scope["errorMessages"] = [];
                this.scope["destroyErrMsgTimer"] = undefined;
            };
            AppController.prototype.showWarning = function (warning, warningMessages) {
                var _this = this;
                this.scope["hasWarning"] = true;
                this.scope["warning"] = warning;
                this.scope["warningMessages"] = warningMessages;
                if (angular.isObject(this.scope["destroyWarnMsgTimer"])) {
                    this.$timeout.cancel(this.scope["destroyWarnMsgTimer"]);
                }
                this.scope["destroyWarnMsgTimer"] = this.$timeout(function () { _this.hideWarning(); }, 10000);
            };
            AppController.prototype.hideWarning = function () {
                this.scope["hasWarning"] = false;
                this.scope["warning"] = null;
                this.scope["warningMessages"] = null;
                this.scope["destroyWarnMsgTimer"] = undefined;
            };
            AppController.prototype.showInfo = function (info, infoMessages) {
                var _this = this;
                this.scope["hasInfo"] = true;
                this.scope["info"] = info;
                this.scope["infoMessages"] = infoMessages;
                if (angular.isObject(this.scope["destroyInfoMsgTimer"])) {
                    this.$timeout.cancel(this.scope["destroyInfoMsgTimer"]);
                }
                this.scope["destroyInfoMsgTimer"] = this.$timeout(function () { _this.hideInfo(); }, 10000);
            };
            AppController.prototype.hideInfo = function () {
                this.scope["hasInfo"] = false;
                this.scope["info"] = null;
                this.scope["infoMessages"] = null;
                this.scope["destroyInfoMsgTimer"] = undefined;
            };
            AppController.prototype.loadGlobalData = function () {
                var _this = this;
                var userContext = this.scope.userContext;
                var globalConfig = this.scope.globalConfig;
                this.loadAppConfig(userContext.company, userContext.division, userContext.m3User, globalConfig.environment).then(function (val) {
                    if (_this.scope.appConfig.authorizedUser === true) {
                        console.log("authorized");
                        _this.loadData(_this.scope.activeModule);
                        _this.loadDefaultFields();
                        _this.getPrinters();
                        _this.hideWarning();
                    }
                    else {
                        console.log("NOT authorized");
                        window.alert("NOT Authorized, Please Contact Security");
                    }
                });
            };
            AppController.prototype.loadDefaultFields = function () {
                var userContext = this.scope.userContext;
                var appConfig = this.scope.appConfig;
            };
            AppController.prototype.loadApplicationData = function () {
                var categories = ['globalSelection', 'routing'];
                this.clearData(categories);
                this.resetReloadStatus();
                this.loadData(this.scope.activeModule);
            };
            AppController.prototype.clearData = function (categories) {
                categories.forEach(function (category) {
                    if (category == "globalSelection") {
                    }
                    if (category == "routing") {
                    }
                });
            };
            AppController.prototype.resetReloadStatus = function () {
            };
            AppController.prototype.moduleSelected = function (moduleId) {
                this.scope.activeModule = moduleId;
                this.scope.modules.forEach(function (appmodule) {
                    if (angular.equals(moduleId, appmodule.moduleId)) {
                        appmodule.active = true;
                    }
                    else {
                        appmodule.active = false;
                    }
                });
                this.storageService.setLocalData('h5.app.appName.module.selected', moduleId);
                this.loadData(this.scope.activeModule);
            };
            AppController.prototype.loadData = function (activeModule) {
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
            };
            AppController.prototype.refreshTransactionStatus = function () {
                var isLoading = false;
                for (var transaction in this.scope.transactionStatus) {
                    var value = this.scope.transactionStatus[transaction];
                    if (value == true) {
                        isLoading = true;
                        break;
                    }
                }
                for (var transaction in this.scope.globalSelection.transactionStatus) {
                    var value = this.scope.globalSelection.transactionStatus[transaction];
                    if (value == true) {
                        isLoading = true;
                        break;
                    }
                }
                this.scope.loadingData = isLoading;
                if (isLoading) {
                    return;
                }
                switch (this.scope.activeModule) {
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                }
            };
            AppController.prototype.loadAppConfig = function (company, division, user, environment) {
                var _this = this;
                var deferred = this.$q.defer();
                this.scope.appConfig = this.scope.globalConfig.appConfig;
                this.scope.appConfig.searchQuery = this.$location.search();
                this.scope.appConfig.enableM3Authority = true;
                if (this.scope.appConfig.enableM3Authority) {
                    this.scope.loadingData = true;
                    this.scope.transactionStatus.appConfig = true;
                    var programName = "TZR100";
                    var promise1 = this.appService.getAuthority(company, division, user, programName, 1).then(function (result) {
                        _this.scope.appConfig.authorizedUser = result;
                    });
                    var promises = [promise1];
                    this.$q.all(promises).finally(function () {
                        deferred.resolve(_this.scope.appConfig);
                        _this.scope.transactionStatus.appConfig = false;
                        _this.refreshTransactionStatus();
                    });
                }
                else {
                    deferred.resolve(this.scope.appConfig);
                }
                return deferred.promise;
            };
            AppController.prototype.clearPage = function () {
                this.clearExplodedBomPage();
                this.clearOpenMOsPage();
                this.clearRoutingSheetPage();
                this.scope.IsDisabled = false;
            };
            AppController.prototype.createRoutingSheet = function () {
                var _this = this;
                this.clearOpenMOsPage();
                this.clearRoutingSheetPage();
                var finalMo = this.scope.routing.explodedBOM.finalMO;
                var facility = this.scope.routing.explodedBOM.facility;
                var structureType = this.scope.routing.explodedBOM.structureType;
                var finalProduct = this.scope.routing.explodedBOM.finalProduct;
                if (finalMo == "" || facility == "" || structureType == "" || finalProduct == "") {
                    var warningMessage = "Please select a Final Product using Prompt(F4).";
                    this.showWarning(warningMessage, null);
                    return;
                }
                this.scope.loadingData = true;
                this.scope.routing.transactionStatus.selMPDSUM = true;
                this.appService.selMPDSUM(facility, structureType, finalProduct).then(function (val) {
                    _this.scope.routing.explodedBomGrid.data = val.items;
                    var data = [];
                    val.items.forEach(function (MOs) {
                        if (MOs.CNQT >= 0) {
                            data.push(MOs);
                        }
                    });
                    _this.scope.routing.explodedBomGrid.data = data;
                    if (angular.isArray(val.items)) {
                        _this.gridService.adjustGridHeight("explodedBomGrid", val.items.length, 500);
                    }
                    _this.scope.routing.transactionStatus.selMPDSUM = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.routing.transactionStatus.selMPDSUM = false;
                    _this.refreshTransactionStatus();
                });
                this.scope.loadingData = true;
                this.scope.routing.transactionStatus.GetWarehouse = true;
                this.appService.GetMo(facility, finalProduct, finalMo).then(function (val) {
                    _this.scope.routing.routingSheet.status = val.item.WHST;
                    console.log(_this.scope.routing.routingSheet.status);
                    if (_this.scope.routing.routingSheet.status == 90) {
                        _this.scope.routing.routingSheet.isOpen = false;
                    }
                    else {
                        _this.scope.routing.routingSheet.isOpen = true;
                    }
                    _this.scope.routing.routingSheet.startDate = val.item.STDT;
                    _this.scope.routing.routingSheet.responsible = _this.scope.userContext.m3User;
                    _this.scope.routing.warehouse = val.item.WHLO;
                    _this.scope.routing.transactionStatus.GetWarehouse = false;
                    _this.refreshTransactionStatus();
                    _this.clearRoutingSheetPage();
                    _this.LstRoutingSheet(finalMo);
                }, function (err) {
                    var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.routing.transactionStatus.GetWarehouse = false;
                    _this.refreshTransactionStatus();
                });
                this.scope.IsDisabled = true;
            };
            AppController.prototype.validateRouting = function () {
                var _this = this;
                var status = true;
                this.scope.routing.openMos.selectedItems.forEach(function (MOs, index) {
                    if (MOs.F1PK02 > 0) {
                        if (_this.scope.routing.openMos.routingSheetNumber === '') {
                            _this.scope.routing.openMos.routingSheetNumber = MOs.F1PK02;
                        }
                        _this.showWarning("The Selected MO already added to a routing sheet " + MOs.F1PK02, null);
                        status = false;
                    }
                });
                return status;
            };
            AppController.prototype.addToRoutingSheet = function () {
                var _this = this;
                var routingSheetNo = this.scope.routing.explodedBOM.finalMO;
                if (this.scope.routing.openMos.selectedItems.length == 0) {
                    this.showWarning("Please select an MO to add.", null);
                    return;
                }
                if (this.validateRouting()) {
                    this.scope.routing.openMos.selectedItems.forEach(function (MOs, index) {
                        var MONumber = MOs.VHMFNO;
                        var itemNo = MOs.VHPRNO;
                        _this.getNewSequenceNo();
                        var Sequence = _this.scope.routing.sequence;
                        var finalMoNumber = _this.scope.routing.finalProductSearch.selectedItem.VHMFNO;
                        var finalItemNo = _this.scope.routing.explodedBOM.selectedItem.PRNO;
                        var V1OPDS = MOs.V1OPDS;
                        var V2OPDS = MOs.V2OPDS;
                        var VHSTRT = "001";
                        var V1PLGR = MOs.V1PLGR;
                        var V2PLGR = MOs.V2PLGR;
                        var VHORQT = MOs.VHORQT;
                        var V1OPNO = MOs.V1OPNO;
                        var V2OPNO = MOs.V2OPNO;
                        var V1WOSQ = MOs.V1WOSQ;
                        var V2WOSQ = MOs.V2WOSQ;
                        var facility = _this.scope.routing.openMos.facility;
                        var finalItemName;
                        _this.scope.loadingData = true;
                        _this.scope.routing.transactionStatus.addMWOHEDext = true;
                        _this.appService.GetMo(facility, itemNo, MONumber).then(function (val) {
                            _this.appService.addMWOHEDext(MONumber, routingSheetNo, Sequence, val.item.WHLO, itemNo, val.item.MAUN, V1OPDS, V2OPDS, VHSTRT, val.item.ITDS, finalItemNo, finalItemName, V1PLGR, V2PLGR, VHORQT, finalMoNumber, V1OPNO, V2OPNO, V1WOSQ, V2WOSQ)
                                .then(function (val) {
                                _this.scope.routing.transactionStatus.addMWOHEDext = false;
                                _this.refreshTransactionStatus();
                                _this.LstRoutingSheet(routingSheetNo);
                            }, function (err) {
                                var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                                _this.showError(error, [err.errorMessage]);
                                _this.scope.routing.transactionStatus.addMWOHEDext = false;
                                _this.refreshTransactionStatus();
                            });
                        }, function (err) {
                            var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                            _this.showError(error, [err.errorMessage]);
                            _this.scope.routing.transactionStatus.addMWOHEDext = false;
                            _this.refreshTransactionStatus();
                        });
                    });
                }
                else {
                    this.LstRoutingSheet(this.scope.routing.openMos.routingSheetNumber);
                }
            };
            AppController.prototype.getNewSequenceNo = function () {
                var newSeq;
                var highestSeq = 1;
                this.scope.routing.routingSheetGrid.data.forEach(function (MOs, index) {
                    var seq = MOs.F1PK03;
                    if (seq >= highestSeq) {
                        highestSeq = parseInt(seq) + 1;
                    }
                });
                newSeq = highestSeq;
                this.scope.routing.sequence = newSeq;
            };
            AppController.prototype.findRoutingSheet = function () {
                var _this = this;
                var routingSheetNo = this.scope.routing.routingSheet.routingSheetNumber;
                if (routingSheetNo != "") {
                    this.scope.routing.routingSheet.structureType = "001";
                    this.scope.routing.routingSheet.facility = "650";
                    this.scope.loadingData = true;
                    this.scope.routing.transactionStatus.lstRoutingSheet = true;
                    this.appService.LstRoutingSheet(routingSheetNo).then(function (val) {
                        if (val.items.length > 0) {
                            _this.scope.routing.routingSheetGrid.data = val.items;
                            _this.scope.routing.routingSheet.data = val.items;
                            _this.scope.routing.routingSheet.finalMO = val.items[0].F1PK02;
                            _this.scope.routing.routingSheet.finalProduct = val.items[val.items.length - 1].F1A030;
                            _this.scope.routing.explodedBOM.facility = "650";
                            _this.scope.routing.explodedBOM.finalMO = val.items[0].F1PK02;
                            _this.scope.routing.explodedBOM.finalProduct = val.items[val.items.length - 1].F1A030;
                            _this.scope.routing.explodedBOM.structureType = "001";
                            _this.scope.routing.transactionStatus.lstComponents = true;
                            _this.appService.lstComponents(_this.scope.routing.routingSheet.facility, val.items[0].F1A030).then(function (val) {
                                _this.scope.routing.routingSheet.itemComponents = val.items;
                                _this.scope.routing.transactionStatus.lstComponents = false;
                                _this.refreshTransactionStatus();
                            }, function (err) {
                                var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                                _this.showError(error, [err.errorMessage]);
                                _this.scope.routing.transactionStatus.lstComponents = false;
                                _this.scope.routing.routingSheet.data[0].MTNO = "";
                                _this.scope.routing.routingSheet.data[0].ITDS = "";
                                _this.refreshTransactionStatus();
                            }).finally(function () {
                                _this.scope.routing.routingSheet.itemComponents.forEach(function (components) {
                                    _this.scope.routing.routingSheet.data[0].MTNO = components.MTNO;
                                    _this.scope.routing.routingSheet.data[0].ITDS = components.ITNO;
                                });
                            });
                            if (angular.isArray(val.items)) {
                                _this.gridService.adjustGridHeight("routingSheetGrid", val.items.length, 500);
                            }
                            _this.scope.loadingData = true;
                            _this.scope.routing.transactionStatus.GetWarehouse = true;
                            _this.appService.GetMo(_this.scope.routing.routingSheet.facility, _this.scope.routing.routingSheet.finalProduct, _this.scope.routing.routingSheet.finalMO).then(function (val) {
                                _this.scope.routing.routingSheet.status = val.item.WHST;
                                console.log(_this.scope.routing.routingSheet.status);
                                if (_this.scope.routing.routingSheet.status == 90) {
                                    _this.scope.routing.routingSheet.isOpen = false;
                                }
                                else {
                                    _this.scope.routing.routingSheet.isOpen = true;
                                }
                                _this.scope.routing.routingSheet.startDate = val.item.STDT;
                                _this.scope.routing.routingSheet.responsible = _this.scope.userContext.m3User;
                                _this.scope.routing.warehouse = val.item.WHLO;
                                _this.scope.routing.transactionStatus.GetWarehouse = false;
                                _this.refreshTransactionStatus();
                                _this.getWarehouseDetails();
                            }, function (err) {
                                var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                                _this.showError(error, [err.errorMessage]);
                                _this.scope.routing.transactionStatus.GetWarehouse = false;
                                _this.refreshTransactionStatus();
                            });
                            _this.scope.routing.transactionStatus.lstRoutingSheet = false;
                            _this.refreshTransactionStatus();
                        }
                        else {
                            var error = "Routing Sheet does not exist";
                            _this.showError(error, null);
                            _this.scope.routing.transactionStatus.GetWarehouse = false;
                            _this.refreshTransactionStatus();
                        }
                    }, function (err) {
                        var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                        _this.showError(error, [err.errorMessage]);
                        _this.scope.routing.transactionStatus.lstRoutingSheet = false;
                        _this.refreshTransactionStatus();
                    });
                }
                else {
                    var warningMessage = "Please Enter a Routing Sheet Number.";
                    this.showWarning(warningMessage, null);
                    return;
                }
            };
            AppController.prototype.getWarehouse = function (facility, finalProduct, finalMo) {
                var _this = this;
                this.scope.loadingData = true;
                this.scope.routing.transactionStatus.GetWarehouse = true;
                this.appService.GetMo(facility, finalProduct, finalMo).then(function (val) {
                    _this.scope.routing.explodedBOM.selectedItemDetails = val.item;
                    _this.scope.routing.warehouse = val.item.WHLO;
                    _this.scope.routing.transactionStatus.GetWarehouse = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.routing.transactionStatus.GetWarehouse = false;
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.LstRoutingSheet = function (routingSheetNo) {
                var _this = this;
                this.scope.routing.routingSheet.facility = this.scope.routing.explodedBOM.facility;
                this.scope.routing.routingSheet.finalMO = this.scope.routing.explodedBOM.finalMO;
                this.scope.routing.routingSheet.finalProduct = this.scope.routing.explodedBOM.finalProduct;
                this.scope.routing.routingSheet.routingSheetNumber = routingSheetNo;
                this.scope.routing.routingSheet.structureType = "001";
                this.scope.loadingData = true;
                this.scope.routing.transactionStatus.lstRoutingSheet = true;
                this.appService.LstRoutingSheet(routingSheetNo).then(function (val) {
                    _this.scope.routing.routingSheetGrid.data = val.items;
                    _this.scope.routing.routingSheet.data = val.items;
                    _this.scope.routing.transactionStatus.lstComponents = true;
                    _this.appService.lstComponents(_this.scope.routing.routingSheet.facility, val.items[0].F1A030).then(function (val) {
                        _this.scope.routing.routingSheet.itemComponents = val.items;
                        _this.scope.routing.transactionStatus.lstComponents = false;
                        _this.refreshTransactionStatus();
                    }, function (err) {
                        var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                        _this.showError(error, [err.errorMessage]);
                        _this.scope.routing.transactionStatus.lstComponents = false;
                        _this.scope.routing.routingSheet.data[0].MTNO = "";
                        _this.scope.routing.routingSheet.data[0].ITDS = "";
                        _this.refreshTransactionStatus();
                    }).finally(function () {
                        _this.scope.routing.routingSheet.itemComponents.forEach(function (components) {
                            _this.scope.routing.routingSheet.data[0].MTNO = components.MTNO;
                            _this.scope.routing.routingSheet.data[0].ITDS = components.ITNO;
                        });
                    });
                    if (angular.isArray(val.items)) {
                        _this.gridService.adjustGridHeight("routingSheetGrid", val.items.length, 500);
                    }
                    _this.scope.routing.transactionStatus.lstRoutingSheet = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.routing.transactionStatus.lstRoutingSheet = false;
                    _this.refreshTransactionStatus();
                });
                this.getWarehouseDetails();
            };
            AppController.prototype.getWarehouseDetails = function () {
                var _this = this;
                this.scope.loadingData = true;
                this.scope.routing.transactionStatus.GetWarehouse = true;
                this.appService.getWarehouse(this.scope.routing.warehouse).then(function (val) {
                    _this.scope.routing.warehouseDetails = val.item;
                    _this.scope.routing.transactionStatus.GetWarehouse = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.routing.transactionStatus.GetWarehouse = false;
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.deleteAllLines = function () {
                var _this = this;
                if (this.scope.routing.routingSheetGrid.data.length > 0) {
                    var routingSheetNo = this.scope.routing.routingSheet.routingSheetNumber;
                    this.scope.routing.routingSheet.data.forEach(function (MOs, index) {
                        var MFNO = MOs.F1PK01;
                        var Seq = MOs.F1PK03;
                        var WHLO = MOs.F1PK04;
                        _this.scope.loadingData = true;
                        _this.scope.routing.transactionStatus.deleteMWOHEDext = true;
                        _this.appService.deleteMWOHEDext(MFNO, routingSheetNo, Seq, WHLO).then(function (val) {
                            _this.scope.routing.transactionStatus.deleteMWOHEDext = false;
                            _this.refreshTransactionStatus();
                            _this.clearRoutingSheetPage();
                        }, function (err) {
                            var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                            _this.showError(error, [err.errorMessage]);
                            _this.scope.routing.transactionStatus.deleteMWOHEDext = false;
                            _this.refreshTransactionStatus();
                        });
                    });
                }
            };
            AppController.prototype.deleteLines = function () {
                var _this = this;
                if (this.scope.routing.routingSheetGrid.data.length > 0) {
                    var routingSheetNo = this.scope.routing.routingSheet.routingSheetNumber;
                    this.scope.routing.routingSheet.selectedItems.forEach(function (MOs, index) {
                        var MFNO = MOs.F1PK01;
                        var Seq = MOs.F1PK03;
                        var WHLO = MOs.F1PK04;
                        _this.scope.loadingData = true;
                        _this.scope.routing.transactionStatus.deleteMWOHEDext = true;
                        _this.appService.deleteMWOHEDext(MFNO, routingSheetNo, Seq, WHLO).then(function (val) {
                            _this.scope.routing.transactionStatus.deleteMWOHEDext = false;
                            _this.refreshTransactionStatus();
                            _this.clearRoutingSheetPage();
                            _this.LstRoutingSheet(routingSheetNo);
                        }, function (err) {
                            var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                            _this.showError(error, [err.errorMessage]);
                            _this.scope.routing.transactionStatus.deleteMWOHEDext = false;
                            _this.refreshTransactionStatus();
                            _this.clearRoutingSheetPage();
                            _this.LstRoutingSheet(routingSheetNo);
                        });
                    });
                }
            };
            AppController.prototype.routingSheetSelected = function (rows) {
                this.scope.routing.routingSheet.selectedItems = rows;
            };
            AppController.prototype.openMOsSelected = function (rows) {
                this.scope.routing.openMos.selectedItems = rows;
            };
            AppController.prototype.exBomRowSelected = function (row) {
                this.scope.routing.explodedBOM.selectedItem = row.entity;
                this.getWarehouse(this.scope.routing.explodedBOM.facility, row.entity.PRNO, this.scope.routing.explodedBOM.finalMO);
                this.clearOpenMOsPage();
                this.populateOpenMos();
            };
            AppController.prototype.finalProductRowSelected = function (row) {
                this.scope.routing.finalProductSearch.selectedItem = row.entity;
                this.closeModalWindow();
                this.populateExplodedBomData();
            };
            AppController.prototype.populateOpenMos = function () {
                var _this = this;
                var facility = this.scope.routing.explodedBOM.selectedItem.FACI;
                var product = this.scope.routing.explodedBOM.selectedItem.PRN1;
                var moFromStatus = "20";
                var moToStatus = "80";
                this.scope.routing.openMos.facility = facility;
                this.scope.routing.openMos.product = product;
                this.scope.loadingData = true;
                this.scope.routing.transactionStatus.lstRoutingMOs = true;
                this.appService.lstRoutingMOs(moFromStatus, moToStatus, product, product, facility).then(function (val) {
                    _this.scope.routing.openMOsGrid.data = val.items;
                    if (angular.isArray(val.items)) {
                        _this.gridService.adjustGridHeight("openMOsGrid", val.items.length, 500);
                    }
                    _this.scope.routing.transactionStatus.lstRoutingMOs = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.routing.transactionStatus.lstRoutingMOs = false;
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.populateExplodedBomData = function () {
                this.scope.routing.explodedBOM.facility = this.scope.routing.finalProductSearch.selectedItem.VHFACI;
                this.scope.routing.explodedBOM.finalMO = this.scope.routing.finalProductSearch.selectedItem.VHMFNO;
                this.scope.routing.explodedBOM.finalProduct = this.scope.routing.finalProductSearch.selectedItem.VHPRNO;
                this.scope.routing.explodedBOM.structureType = "001";
            };
            AppController.prototype.searchFinalProduct = function () {
                var _this = this;
                var facility = this.scope.routing.finalProductSearch.facility;
                var finalProduct = this.scope.routing.finalProductSearch.finalProduct;
                var moFromStatus = this.scope.routing.finalProductSearch.moFromStatus;
                var moToStatus = this.scope.routing.finalProductSearch.moToStatus;
                if (facility == "") {
                    var warningMessage = "Please Enter a Facility.";
                    this.showWarning(warningMessage, null);
                    return;
                }
                else if (finalProduct == "") {
                    var warningMessage = "Please Enter a Product.";
                    this.showWarning(warningMessage, null);
                    return;
                }
                else if (moFromStatus == "") {
                    var warningMessage = "Please Enter from Status.";
                    this.showWarning(warningMessage, null);
                    return;
                }
                else if (moToStatus == "") {
                    var warningMessage = "Please Enter to status.";
                    this.showWarning(warningMessage, null);
                    return;
                }
                this.scope.loadingData = true;
                this.scope.routing.transactionStatus.lstRoutingMOs = true;
                this.appService.lstRoutingMOs(moFromStatus, moToStatus, finalProduct, finalProduct, facility).then(function (val) {
                    _this.scope.routing.finalProductSearchGrid.data = val.items;
                    if (angular.isArray(val.items)) {
                        _this.gridService.adjustGridHeight("finalProductSearchGrid", val.items.length, 500);
                    }
                    _this.scope.routing.transactionStatus.lstRoutingMOs = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.routing.transactionStatus.lstRoutingMOs = false;
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.clearFinalProductSearchPage = function () {
                this.scope.routing.finalProductSearch.facility = "";
                this.scope.routing.finalProductSearch.finalProduct = "";
                this.scope.routing.finalProductSearch.moFromStatus = "";
                this.scope.routing.finalProductSearch.moToStatus = "";
                this.scope.routing.finalProductSearchGrid.data = [];
            };
            AppController.prototype.clearOpenMOsPage = function () {
                this.scope.routing.openMos.facility = "";
                this.scope.routing.openMos.product = "";
                this.scope.routing.openMos.selectedItems = [];
                this.scope.routing.openMOsGrid.data = [];
            };
            AppController.prototype.clearExplodedBomPage = function () {
                this.scope.routing.explodedBOM.facility = "";
                this.scope.routing.explodedBOM.finalMO = "";
                this.scope.routing.explodedBOM.finalProduct = "";
                this.scope.routing.explodedBOM.structureType = "";
                this.scope.routing.explodedBOM.selectedItem = [];
                this.scope.routing.explodedBomGrid.data = [];
                this.scope.routing.explodedBOM.selectedItemDetails = [];
            };
            AppController.prototype.clearRoutingSheetPage = function () {
                this.scope.routing.routingSheet.facility = "";
                this.scope.routing.routingSheet.finalMO = "";
                this.scope.routing.routingSheet.finalProduct = "";
                this.scope.routing.routingSheet.routingSheetNumber = "";
                this.scope.routing.routingSheet.structureType = "";
                this.scope.routing.routingSheet.isOpen = true;
                this.scope.routing.routingSheet.selectedItems = [];
                this.scope.routing.routingSheetGrid.data = [];
                this.scope.routing.routingSheet.data = [];
            };
            AppController.prototype.browseFinalProduct = function () {
                this.clearFinalProductSearchPage();
                this.openFinalProductSearchPage();
            };
            AppController.prototype.openFinalProductSearchPage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/FinalProductSearchModal.html",
                    size: "lg",
                    scope: this.scope
                };
                this.scope.routing.finalProductSearch.finalProduct = this.scope.routing.explodedBOM.finalProduct;
                this.scope.routing.finalProductSearch.facility = this.scope.userContext.FACI;
                this.scope.routing.finalProductSearch.moFromStatus = "20";
                this.scope.routing.finalProductSearch.moToStatus = "80";
                this.scope.modalWindow = this.$uibModal.open(options);
                if (this.scope.routing.finalProductSearch.finalProduct != "") {
                    this.searchFinalProduct();
                }
            };
            AppController.prototype.getPrinters = function () {
                var _this = this;
                this.scope.routing.transactionStatus.getPrinters = true;
                this.appService.lstPrinters().then(function (val) {
                    _this.scope.routing.printerSetup.printers = val.items;
                    _this.scope.routing.transactionStatus.getPrinters = false;
                    _this.getDefaultPrinter();
                }, function (err) {
                    var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.routing.transactionStatus.getPrinters = false;
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.getDefaultPrinter = function () {
                var _this = this;
                var user = this.scope.userContext.m3User;
                this.scope.routing.transactionStatus.getPrintFile = true;
                this.appService.getPrintFile(user).then(function (val) {
                    _this.scope.routing.printer.printer = val.items[0].DEV;
                    _this.scope.routing.printer.user = val.items[0].USID;
                    _this.scope.routing.printer.printFile = val.items[0].PRTF;
                    _this.scope.routing.printerSetup.printers.selected = val.items[0].DEV;
                    _this.scope.routing.transactionStatus.getPrintFile = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.routing.printerSetup.printers.selected = _this.scope.routing.printerSetup.printers[0];
                    _this.appService.addPrintFile(user, "").then(function (val) {
                        console.log("PrintFile Updated");
                        _this.scope.routing.transactionStatus.addPrintFile = false;
                        _this.getDefaultPrinter();
                    }, function (err) {
                        console.log("err");
                        var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                        _this.showError(error, [err.errorMessage]);
                        _this.scope.routing.transactionStatus.addPrintFile = false;
                        _this.refreshTransactionStatus();
                    });
                    _this.scope.routing.transactionStatus.getPrintFile = false;
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.updPrintFile = function () {
                var _this = this;
                var user = this.scope.userContext.m3User;
                var printer = this.scope.routing.printerSetup.printers.selected;
                this.scope.routing.printer.printer = this.scope.routing.printerSetup.printers.selected;
                this.scope.routing.transactionStatus.updPrintFile = true;
                this.appService.updPrintFile(user, printer).then(function (val) {
                    console.log("PrintFile Updated");
                    _this.scope.routing.transactionStatus.updPrintFile = false;
                    _this.sendXML();
                }, function (err) {
                    _this.scope.routing.transactionStatus.addPrintFile = true;
                    _this.appService.addPrintFile(user, printer).then(function (val) {
                        console.log("PrintFile Updated");
                        _this.scope.routing.transactionStatus.addPrintFile = false;
                        _this.sendXML();
                        _this.getPrinters();
                    }, function (err) {
                        var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                        _this.showError(error, [err.errorMessage]);
                        _this.scope.routing.transactionStatus.addPrintFile = false;
                        _this.refreshTransactionStatus();
                    });
                    _this.scope.routing.transactionStatus.updPrintFile = false;
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.printRoutingSheet = function () {
                if (this.scope.routing.routingSheetGrid.data.length > 0) {
                    var updatePrintFile = this.scope.routing.printerSetup.updatePrintFile;
                    if (updatePrintFile) {
                        this.updPrintFile();
                    }
                    else {
                        this.sendXML();
                    }
                }
                else {
                    var warningMessage = "Routing Sheet is Blank";
                    this.showWarning(warningMessage, null);
                    return;
                }
            };
            AppController.prototype.sendXML = function () {
                var _this = this;
                var connectionString = "";
                var transaction = "sendXML";
                var port = location.port;
                this.scope.routing.transactionStatus.LstIONCON = true;
                this.appService.getIONURL(transaction, port).then(function (val) {
                    var data = val.items[0];
                    var URL = data.F3A230 + data.F3A330 + data.F3A130;
                    var path = data.F3A430;
                    var transaction = data.F3PK02;
                    connectionString = URL + path + transaction;
                    _this.scope.routing.transactionStatus.LstIONCON = false;
                    var printFile;
                    var printer = _this.scope.routing.printerSetup.printers.selected;
                    _this.scope.routing.printer.printer = _this.scope.routing.printerSetup.printers.selected;
                    _this.appService.getPrintAddress(printer).then(function (val) {
                        _this.scope.routing.transactionStatus.getPrintAddress = true;
                        _this.refreshTransactionStatus();
                        _this.scope.routing.printer.printerAddress = val.items[0].PVRA;
                        var dateTime = new Date();
                        var filename = "RoutingSheet_" + _this.scope.routing.routingSheet.routingSheetNumber;
                        var doc = document.implementation.createDocument("", "", null);
                        var RootElem = doc.createElement("M3OutDocument");
                        var MetadataNode = _this.getMetaDataNode(doc, dateTime, filename);
                        RootElem.appendChild(MetadataNode);
                        printFile = _this.scope.routing.printer.printFile;
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
                        var CoverNode = _this.getCoverNode(doc, dateTime);
                        DocumentNode.appendChild(CoverNode);
                        var FormattingNode = _this.getFormattingNode(doc);
                        DocumentNode.appendChild(FormattingNode);
                        var HeaderNode = _this.getHeaderNode(doc);
                        DocumentNode.appendChild(HeaderNode);
                        var DocumentHeaderNode = _this.getDocumentHeaderNode(doc);
                        DocumentNode.appendChild(DocumentHeaderNode);
                        var SubdocumentNode = _this.getSubdocumentNode(doc);
                        DocumentNode.appendChild(SubdocumentNode);
                        var MediaNode = _this.getMediaNode(doc, filename);
                        DocumentNode.appendChild(MediaNode);
                        var DataAreaNode = doc.createElement("DataArea");
                        DataAreaNode.appendChild(DocumentNode);
                        RootElem.appendChild(DataAreaNode);
                        doc.appendChild(RootElem);
                        var xml = new XMLSerializer().serializeToString(doc);
                        console.log(xml);
                        var base_url = "https://ion-truex-t.tac.com:7443/infor/";
                        var trans = "CustomerApi/streamserv/sendXML";
                        var url = base_url + trans;
                        var req = {
                            method: 'POST',
                            url: connectionString,
                            headers: {
                                'Content-Type': undefined
                            },
                            data: xml
                        };
                        _this.$http(req).then(function (val) {
                            console.log(val.response);
                        }, function (err) {
                            console.log(err.data);
                        });
                        if (_this.scope.routing.downloadXML) {
                            _this.FileSaver.saveAs(new Blob([xml], { type: 'text/xml' }), filename);
                        }
                        _this.scope.routing.transactionStatus.getPrintAddress = false;
                        _this.refreshTransactionStatus();
                    }, function (err) {
                        var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                        _this.showError(error, [err.errorMessage]);
                        _this.scope.routing.transactionStatus.getPrintAddress = false;
                        _this.refreshTransactionStatus();
                    });
                }, function (err) {
                    var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.routing.transactionStatus.LstIONCON = false;
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.getMetaDataNode = function (doc, dateTime, file) {
                var MetadataNode = doc.createElement("metadata");
                var ZZCONO = doc.createElement("ZZCONO");
                ZZCONO.innerHTML = this.scope.userContext.company;
                MetadataNode.appendChild(ZZCONO);
                var ZZDIVI = doc.createElement("ZZDIVI");
                ZZDIVI.innerHTML = this.scope.userContext.division;
                MetadataNode.appendChild(ZZDIVI);
                var ZZDATE = doc.createElement("ZZDATE");
                var MM = ((dateTime.getMonth() + 1) < 10 ? '0' : '') + (dateTime.getMonth() + 1);
                var dd = (dateTime.getDate() < 10 ? '0' : '') + dateTime.getDate();
                ZZDATE.innerHTML = dateTime.getFullYear() + "-" + MM + "-" + dd;
                MetadataNode.appendChild(ZZDATE);
                var ZZTIME = doc.createElement("ZZTIME");
                var hr = (dateTime.getHours() < 10 ? '0' : '') + dateTime.getHours();
                var min = (dateTime.getMinutes() < 10 ? '0' : '') + dateTime.getMinutes();
                var sec = (dateTime.getSeconds() < 10 ? '0' : '') + dateTime.getSeconds();
                ZZTIME.innerHTML = hr + ":" + min + ":" + sec;
                MetadataNode.appendChild(ZZTIME);
                var ZZUSER = doc.createElement("ZZUSER");
                ZZUSER.innerHTML = this.scope.userContext.m3User;
                MetadataNode.appendChild(ZZUSER);
                var ZZBJNO = doc.createElement("ZZBJNO");
                MetadataNode.appendChild(ZZBJNO);
                var ZZPRTF = doc.createElement("ZZPRTF");
                ZZPRTF.innerHTML = this.scope.routing.printer.printFile;
                MetadataNode.appendChild(ZZPRTF);
                var ZZFILE = doc.createElement("ZZFILE");
                ZZFILE.innerHTML = file;
                MetadataNode.appendChild(ZZFILE);
                var ZZSIID = doc.createElement("ZZSIID");
                ZZSIID.innerHTML = "TEST_XML";
                MetadataNode.appendChild(ZZSIID);
                return MetadataNode;
            };
            AppController.prototype.getCoverNode = function (doc, dateTime) {
                var CoverNode = doc.createElement("Cover");
                var HeadingNode = doc.createElement("Heading");
                var ZZUBPG = doc.createElement("ZZUBPG");
                ZZUBPG.innerHTML = "PMS240";
                HeadingNode.appendChild(ZZUBPG);
                var ZZPR40 = doc.createElement("ZZPR40");
                ZZPR40.innerHTML = "Manufact Order. Print Documents";
                HeadingNode.appendChild(ZZPR40);
                var ZZDATE = doc.createElement("ZZDATE");
                var MM = ((dateTime.getMonth() + 1) < 10 ? '0' : '') + (dateTime.getMonth() + 1);
                var dd = (dateTime.getDate() < 10 ? '0' : '') + dateTime.getDate();
                ZZDATE.innerHTML = dateTime.getFullYear() + "-" + MM + "-" + dd;
                HeadingNode.appendChild(ZZDATE);
                var ZZTIME = doc.createElement("ZZTIME");
                var hr = (dateTime.getHours() < 10 ? '0' : '') + dateTime.getHours();
                var min = (dateTime.getMinutes() < 10 ? '0' : '') + dateTime.getMinutes();
                var sec = (dateTime.getSeconds() < 10 ? '0' : '') + dateTime.getSeconds();
                ZZTIME.innerHTML = hr + ":" + min + ":" + sec;
                HeadingNode.appendChild(ZZTIME);
                var ZZUSER = doc.createElement("ZZUSER");
                ZZUSER.innerHTML = this.scope.userContext.m3User;
                ;
                HeadingNode.appendChild(ZZUSER);
                var ZZSPGM = doc.createElement("ZZSPGM");
                ZZSPGM.innerHTML = "PMS241";
                HeadingNode.appendChild(ZZSPGM);
                var ZZROW2 = doc.createElement("ZZROW2");
                ZZROW2.innerHTML = "***  ***";
                HeadingNode.appendChild(ZZROW2);
                var ZZROW3 = doc.createElement("ZZROW3");
                ZZROW3.innerHTML = "*** TRUEX COMPANY (005/005) ***";
                HeadingNode.appendChild(ZZROW3);
                CoverNode.appendChild(HeadingNode);
                return CoverNode;
            };
            AppController.prototype.getFormattingNode = function (doc) {
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
                var PaperSize = doc.createElement("PaperSize");
                PaperSize.innerHTML = "LETTER";
                FormattingNode.appendChild(PaperSize);
                var LocalizationNode = doc.createElement("Localization");
                var DocumentDivisionNode = doc.createElement("DocumentDivision");
                DocumentDivisionNode.innerHTML = this.scope.userContext.division;
                LocalizationNode.appendChild(DocumentDivisionNode);
                var CountryVersion = doc.createElement("CountryVersion");
                CountryVersion.innerHTML = "US";
                LocalizationNode.appendChild(CountryVersion);
                var BaseCountry = doc.createElement("BaseCountry");
                BaseCountry.innerHTML = "US";
                LocalizationNode.appendChild(BaseCountry);
                var FromToCountry = doc.createElement("FromToCountry");
                FromToCountry.innerHTML = "US";
                LocalizationNode.appendChild(FromToCountry);
                var DocumentLanguage = doc.createElement("DocumentLanguage");
                DocumentLanguage.innerHTML = "GB";
                LocalizationNode.appendChild(DocumentLanguage);
                var Locale = doc.createElement("Locale");
                Locale.innerHTML = "en-US";
                LocalizationNode.appendChild(Locale);
                var DateFormat = doc.createElement("DateFormat");
                DateFormat.innerHTML = "YYMMDD";
                LocalizationNode.appendChild(DateFormat);
                var DecimalFormat = doc.createElement("DecimalFormat");
                LocalizationNode.appendChild(DecimalFormat);
                var ThousandSeparator = doc.createElement("ThousandSeparator");
                ThousandSeparator.innerHTML = ".";
                LocalizationNode.appendChild(ThousandSeparator);
                var DocumentInformationNode = doc.createElement("DocumentInformation");
                var DebitCreditCodeUsed = doc.createElement("DebitCreditCodeUsed");
                DebitCreditCodeUsed.innerHTML = false;
                DocumentInformationNode.appendChild(DebitCreditCodeUsed);
                FormattingNode.appendChild(LocalizationNode);
                FormattingNode.appendChild(DocumentInformationNode);
                return FormattingNode;
            };
            AppController.prototype.getHeaderNode = function (doc) {
                var HeaderNode = doc.createElement("Header");
                HeaderNode.setAttribute("Label", "Header");
                var AddressNode = doc.createElement("Address");
                AddressNode.setAttribute("Label", "Company address");
                AddressNode.setAttribute("Type", "Company");
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
            };
            AppController.prototype.getDocumentHeaderNode = function (doc) {
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
            };
            AppController.prototype.getMediaNode = function (doc, file) {
                var printFile = this.scope.routing.printer.printFile;
                var printer = this.scope.routing.printer.printer;
                var user = this.scope.routing.printer.user;
                var printAddress = this.scope.routing.printer.printerAddress;
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
                Archive.innerHTML = false;
                PrintNode.appendChild(Archive);
                var MailNode = doc.createElement("Mail");
                var email = "";
                if (this.scope.routing.sendEmail) {
                    email = user + "@teknorapex.com";
                }
                var ToMail = doc.createElement("ToMail");
                ToMail.innerHTML = email;
                MailNode.appendChild(ToMail);
                var FromMail = doc.createElement("FromMail");
                FromMail.innerHTML = "apus@truex.com";
                MailNode.appendChild(FromMail);
                var Archive = doc.createElement("Archive");
                Archive.innerHTML = false;
                MailNode.appendChild(Archive);
                var ReportFileType = doc.createElement("ReportFileType");
                ReportFileType.innerHTML = "PDF";
                MailNode.appendChild(ReportFileType);
                var FileNode = doc.createElement("File");
                var FilePath = doc.createElement("FilePath");
                FilePath.innerHTML = "";
                FileNode.appendChild(FilePath);
                var FileName = doc.createElement("FileName");
                FileName.innerHTML = "";
                FileNode.appendChild(FileName);
                var Archive = doc.createElement("Archive");
                Archive.innerHTML = false;
                FileNode.appendChild(Archive);
                var ReportFileType = doc.createElement("ReportFileType");
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
                AccountingEntity.innerHTML = this.scope.userContext.company + "_" + this.scope.userContext.division;
                ArchiveNode.appendChild(AccountingEntity);
                var DocumentType = doc.createElement("DocumentType");
                DocumentType.innerHTML = printFile;
                ArchiveNode.appendChild(DocumentType);
                var Acl = doc.createElement("Acl");
                Acl.innerHTML = "PMZ242PFACL";
                ArchiveNode.appendChild(Acl);
                var FileName = doc.createElement("FileName");
                FileName.innerHTML = file;
                ArchiveNode.appendChild(FileName);
                var Attribute1 = doc.createElement("Attribute");
                Attribute1.setAttribute("Name", "M3ROUT");
                var Value1 = doc.createElement("Value");
                Value1.innerHTML = this.scope.routing.routingSheet.routingSheetNumber;
                Attribute1.appendChild(Value1);
                ArchiveNode.appendChild(Attribute1);
                var Attribute2 = doc.createElement("Attribute");
                Attribute2.setAttribute("Name", "M3ITNO");
                var Value2 = doc.createElement("Value");
                Value2.innerHTML = this.scope.routing.routingSheet.finalProduct;
                Attribute2.appendChild(Value2);
                ArchiveNode.appendChild(Attribute2);
                var Attribute3 = doc.createElement("Attribute");
                Attribute3.setAttribute("Name", "M3PRNO");
                var Value3 = doc.createElement("Value");
                Value3.innerHTML = this.scope.routing.routingSheet.finalMO;
                Attribute3.appendChild(Value3);
                ArchiveNode.appendChild(Attribute3);
                MediaNode.appendChild(PrintNode);
                MediaNode.appendChild(MailNode);
                MediaNode.appendChild(FileNode);
                MediaNode.appendChild(ArchiveNode);
                return MediaNode;
            };
            AppController.prototype.getSubdocumentNode = function (doc) {
                var SubdocumentNode = doc.createElement("Subdocument");
                SubdocumentNode.setAttribute("Label", "Subdocument");
                var xxSUBD = doc.createElement("xxSUBD");
                xxSUBD.setAttribute("Label", "Subdocument");
                xxSUBD.innerHTML = true;
                SubdocumentNode.appendChild(xxSUBD);
                var RouteNode = doc.createElement("Route");
                RouteNode.setAttribute("Label", "Route");
                var F1PK03 = doc.createElement("F1PK03");
                F1PK03.setAttribute("Label", "Sequence");
                F1PK03.innerHTML = "";
                RouteNode.appendChild(F1PK03);
                var F1A030 = doc.createElement("F1A030");
                F1A030.setAttribute("Label", "MO Number");
                F1A030.innerHTML = "";
                RouteNode.appendChild(F1A030);
                var F1A530 = doc.createElement("F1A530");
                F1A530.setAttribute("Label", "Item Number");
                F1A530.innerHTML = "";
                RouteNode.appendChild(F1A530);
                var F1A530 = doc.createElement("F1A540");
                F1A530.setAttribute("Label", "Item Name");
                F1A530.innerHTML = "";
                RouteNode.appendChild(F1A530);
                var WCDESC = doc.createElement("WCDESC");
                WCDESC.setAttribute("Label", "Op description");
                WCDESC.innerHTML = "";
                RouteNode.appendChild(WCDESC);
                var WCOPER = doc.createElement("WCOPER");
                WCOPER.setAttribute("Label", "Op No.");
                WCOPER.innerHTML = "";
                RouteNode.appendChild(WCOPER);
                var WCNAME = doc.createElement("WCNAME");
                WCNAME.setAttribute("Label", "W/C");
                WCNAME.innerHTML = "";
                RouteNode.appendChild(WCNAME);
                var WCREPT = doc.createElement("WCREPT");
                WCREPT.setAttribute("Label", "Reporting No.");
                WCREPT.innerHTML = "";
                RouteNode.appendChild(WCREPT);
                this.scope.routing.routingSheet.itemComponents.forEach(function (components) {
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
                this.scope.routing.routingSheet.data.forEach(function (MOs, index) {
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
                    F1N596.innerHTML = MOs.F1PK01;
                    OperationNode1.appendChild(F1N596);
                    RouteNode.appendChild(OperationNode1);
                    if (MOs.F1N396 !== MOs.F1N496) {
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
                        RouteNode.appendChild(OperationNode2);
                    }
                });
                SubdocumentNode.appendChild(RouteNode);
                return SubdocumentNode;
            };
            AppController.prototype.getIONCON = function (transaction, port) {
            };
            AppController.$inject = ["$scope", "configService", "AppService", "RestService", "StorageService", "GridService", "m3UserService", "languageService", "$uibModal", "$interval", "$timeout", "$filter", "$q", "$window", "m3FormService", "$location", "$http", "FileSaver"];
            return AppController;
        }());
        application.AppController = AppController;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
