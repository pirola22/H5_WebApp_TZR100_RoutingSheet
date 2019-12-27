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

        transactionStatus: {
            lstRoutingMOs: boolean;
            selMPDSUM: boolean;
            addFieldValue: boolean;
            deleteFieldValue: boolean;
            lstRoutingSheet: boolean;
            GetMo: boolean;
            GetItem: boolean;
            GetWarehouse: boolean;
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