sap.ui.define([
   "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"

], (Controller,MessageBox,MessageToast,Filter,FilterOperator,Fragment) => {
    "use strict";

    return Controller.extend("projec.controller.View1", {
        onInit: function () {},

        onSelectionChange: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            if (!oItem) {
                return;
            }
            this._selectedPath = oItem.getBindingContext().getPath(); // /Products(1)
        },

        onCreateProduct: function () {
            var oView = this.getView();

            if (!this._oCreateDialog) {
                this._oCreateDialog = sap.ui.xmlfragment(
                    oView.getId(),
                    "projec.fragments.CreateProduct",
                    this
                );
                oView.addDependent(this._oCreateDialog);
            }

            this._oCreateDialog.open();
        },

        onCreateConfirm: function () {
            var oModel = this.getView().getModel();
            var oNewProduct = {
                ID: this.byId("prodIdInput").getValue(),
                Name: this.byId("nameInput").getValue(),
                Description: this.byId("descInput").getValue(),
                ReleaseDate: this.byId("releaseDateInput").getDateValue(),
                DiscontinuedDate: this.byId("discontinuedDateInput").getDateValue(),
                Price: this.byId("priceInput").getValue(),
                Rating: parseInt(this.byId("ratingInput").getValue(), 10)
            };
         oModel.create("/Products", oNewProduct, {
                success: function () {
                    MessageToast.show("Product created successfully");
                    this._oCreateDialog.close();
                    oModel.refresh(true);
                }.bind(this),
                error: function (oError) {
                    MessageBox.error("Create failed");
                    console.error(oError);
                }
            });
        },

        onCreateCancel: function () {
            this._oCreateDialog.close();
        },

        onOpenUpdateDialog: function () {
            if (!this._selectedPath) {
                MessageToast.show("Please select a row");
                return;
            }

            var oView = this.getView();
            var oModel = oView.getModel();

            if (!this._oUpdateDialog) {
                this._oUpdateDialog = sap.ui.xmlfragment(
                    oView.getId(),
                    "projec.fragments.UpdateProduct",
                    this
                );
                oView.addDependent(this._oUpdateDialog);
            }

            var oData = oModel.getProperty(this._selectedPath);

            this.byId("updProdIdInput").setValue(oData.ID);
            this.byId("updNameInput").setValue(oData.Name);
            this.byId("updDescInput").setValue(oData.Description);
            this.byId("updReleaseDateInput").setDateValue(oData.ReleaseDate);
            this.byId("updDiscontinuedDateInput").setDateValue(oData.DiscontinuedDate);
            this.byId("updPriceInput").setValue(oData.Price);
            this.byId("updRatingInput").setValue(oData.Rating);

            this._oUpdateDialog.open();
        },

        onUpdateConfirm: function () {
            var oModel = this.getView().getModel();

            var oUpdatedData = {
                Name: this.byId("updNameInput").getValue(),
                Description: this.byId("updDescInput").getValue(),
                ReleaseDate: this.byId("updReleaseDateInput").getDateValue(),
                DiscontinuedDate: this.byId("updDiscontinuedDateInput").getDateValue(),
                Price: this.byId("updPriceInput").getValue(),
                Rating: parseInt(this.byId("updRatingInput").getValue(), 10)
            };

            oModel.update(this._selectedPath, oUpdatedData, {
                success: function () {
                    MessageToast.show("Product updated successfully");
                    this._oUpdateDialog.close();
                    oModel.refresh(true);
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Update failed");
                    console.error(oError);
                }
            });
        },

        onUpdateCancel: function () {
            this._oUpdateDialog.close();
        },

        onDeleteProduct: function () {
            if (!this._selectedPath) {
                MessageToast.show("Please select a row");
                return;
            }

            MessageBox.confirm("Do you want to delete this product?", {
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        var oModel = this.getView().getModel();
                        oModel.remove(this._selectedPath, {
                            success: function () {
                                MessageToast.show("Product deleted successfully");
                                this._selectedPath = null;
                            }.bind(this),
                            error: function () {
                                MessageToast.show("Delete failed");
                            }
                        });
                    }
                }.bind(this)
            });
        },

        onSearch: function (oEvent) {
    var sQuery = oEvent.getParameter("query");
    var aFilters = [];

    if (sQuery) {

        // Check if input is numeric (ID)
        if (!isNaN(sQuery)) {
            // Exact match for ID
            aFilters.push(
                new sap.ui.model.Filter(
                    "ID",
                    sap.ui.model.FilterOperator.EQ,
                    Number(sQuery)
                )
            );
        } else {
            // Text search for Name
            aFilters.push(
                new sap.ui.model.Filter(
                    "Name",
                    sap.ui.model.FilterOperator.Contains,
                    sQuery
                )
            );
        }
    }

    var oTable = this.byId("productTable");
    var oBinding = oTable.getBinding("items");

    if (oBinding) {
        oBinding.filter(aFilters);
    }

        },
        //  onCreateEntryProduct: function () {
        //     var oView = this.getView();
        //     var oModel = oView.getModel();

        //     this._oCreateContext = oModel.createEntry("/Products");

        //     if (!this.oDialog) {
        //         Fragment.load({
        //             id: oView.getId(),
        //             name: "projec.fragments.CreateProductfrg",
        //             controller: this
        //         }).then(function (oDialog) {
        //             this.oDialog = oDialog;
        //             oView.addDependent(oDialog);

        //             oDialog.setModel(oModel);
        //             oDialog.setBindingContext(this._oCreateContext);
        //             oDialog.open();
        //         }.bind(this));
        //     } else {
        //         this.oDialog.setBindingContext(this._oCreateContext);
        //         this.oDialog.open();
        //     }
        // },

        // onCreateConfirm1: function () {
        //     var oModel = this.getView().getModel();

        //     oModel.submitChanges({
        //         success: function () {
        //             MessageToast.show("Product created successfully");
        //             oModel.refresh(true);
        //         },
        //         error: function () {
        //             MessageBox.error("Failed to create product");
        //         }
        //     });

        //     this.oDialog.close();
        // },

        // onCancelProduct1: function () {
        //     var oModel = this.getView().getModel();

        //     oModel.deleteCreatedEntry(this._oCreateContext);
        //     this.oDialog.close();
        // },
        //crete entry with payload//
         onCreateEntryProduct: function () {
            var oView = this.getView();

            if (!this._oCreateDialog) {
                this._oCreateDialog = sap.ui.xmlfragment(
                    oView.getId(),
                    "projec.fragments.CreateProduct",
                    this
                );
                oView.addDependent(this._oCreateDialog);
            }

            this._oCreateDialog.open();
        },

        onCreateConfirm: function () {
            var oModel = this.getView().getModel();

            var oNewProduct = {
                ID: this.byId("prodIdInput").getValue(),
                Name: this.byId("nameInput").getValue(),
                Description: this.byId("descInput").getValue(),
                ReleaseDate: this.byId("releaseDateInput").getDateValue(),
                DiscontinuedDate: this.byId("discontinuedDateInput").getDateValue(),
                Price: this.byId("priceInput").getValue(),
                Rating: parseInt(this.byId("ratingInput").getValue(), 10)
            };
             oModel.createEntry("/Products",{properties:oNewProduct});
             this._oCreateDialog.close();

            oModel.submitChanges({
                success: function () {
                    MessageToast.show("Product created successfully");
                    this._oCreateDialog.close();
                    oModel.refresh(true);
                }.bind(this),
                error: function (oError) {
                    MessageBox.error("Create failed");
                    console.error(oError);
                }
            }); this._oCreateDialog.close();
             },

             //the code

        onCreateCancel: function () {
            var oModel = this.getView().getModel();

            if (this._oCreateContext) {
                oModel.deleteCreatedEntry(this._oCreateContext);
                this._oCreateContext = null;
            }

            this._oCreateDialog.close();
        }


    });
});