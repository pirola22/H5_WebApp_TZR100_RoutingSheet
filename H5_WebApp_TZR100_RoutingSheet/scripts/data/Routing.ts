module h5.application {
    export interface IRouting {
        reload: boolean;
        explodedBomGrid: IUIGrid;
        openMOsGrid: IUIGrid;
        routingSheetGrid: IUIGrid;
        finalProductSearchGrid:IUIGrid;
        openMOsGridData:any;
        warehouse:string;
        warehouseDetails:any;
        sequence:any;
        
        downloadXML:boolean;
        sendEmail:boolean;
        
        printerSetup:{
            printers: any;
            updatePrintFile: boolean;
        }
        
        printer:{
            printer : string;
            printerAddress: string;
            printFile: string;
            user: string;
        }
        
        transactionStatus: {
            getPrintFile: boolean;
            updPrintFile: boolean;
            addPrintFile: boolean;
            lstComponents: boolean;
            getPrintAddress: boolean;
            getPrinters: boolean;
            lstRoutingMOs: boolean;
            selMPDSUM: boolean;
            addMWOHEDext: boolean;
            deleteMWOHEDext: boolean;
            lstRoutingSheet: boolean;
            GetMo: boolean;
            GetItem: boolean;
            GetWarehouse: boolean;
            LstIONCON: boolean;
        };

        explodedBOM: {
            finalMO: string;
            facility: string;
            structureType: string;
            finalProduct: string;
            selectedItem: any;
            selectedItemDetails: any;
        };

        openMos: {
            facility: string;
            product: string;
            selectedItems: any;
            routingSheetNumber:string;
        };

        routingSheet: {
            facility: string;
            structureType: string;
            finalProduct: string;
            finalMO: string;
            routingSheetNumber:string;
            selectedItems: any;
            data: any;
            itemComponents: any;
            responsible: any;
            startDate: any;
            status:any;
            isOpen: boolean;
            numberOfCopies: any;
            
        };

        finalProductSearch:{
            facility: string;
            finalProduct: string;
            moFromStatus: string;
            moToStatus: string;
            selectedItem: any;
        };
    }
}