angular.module('app.sales-mgmt')
    .controller('CookAssigmentCntl', function ($scope, currentPositions, positions, globalSpinner, positionStateNotification, $log) {
        'use strict';

        positionStateNotification.connect().then(function () {
            positionStateNotification.subscribe(function () {
                positions.get();
            });
        });

        $scope.gridOptions = {
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 35,
            rowHeight: 35,
            multiSelect: true,
            enableFullRowSelection: true,
            enableColumnMenus: false
        };

        $scope.gridOptions.columnDefs = [
            { name: 'id', displayName: 'ID', minWidth: 80},
            { name: 'orderId', displayName: 'Order ID', minWidth: 80},
            { name: 'mealName', displayName: 'Meal', minWidth: 100},
            { name: 'sideDishName', displayName: 'Side Dish', minWidth: 100}
        ];

        $scope.gridOptionsAssigned = angular.copy($scope.gridOptions);

        $scope.gridOptions.data = currentPositions.availablePositions;
        $scope.gridOptionsAssigned.data = currentPositions.positionsAssignedToCurrentUser;

        $scope.gridOptions.onRegisterApi = function(gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                var msg = 'row selected ' + row.isSelected;
                $log.log(msg);
            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                var msg = 'rows changed ' + rows.length;
                $log.log(msg);
            });
        };

        /*$scope.positionsAvailableSelected = [];
        $scope.positionsAssignedSelected = [];


        $scope.availablePositionSelected = function () {
            return ($scope.positionsAvailableSelected && $scope.positionsAvailableSelected.length > 0) ? true : false;
        };

        $scope.assignedPositionSelected = function () {
            return ($scope.positionsAssignedSelected && $scope.positionsAssignedSelected.length > 0) ? true : false;
        };

        $scope.assignCookToPosition = function () {
            if ($scope.availablePositionSelected()) {
                globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                    return positions.assignCookToPosition($scope.positionsAvailableSelected[0].id);
                });
            }
        };
        $scope.buttonDefs = [
            {
                label: 'SALES_MGMT.DONE',
                onClick: function () {
                    if ($scope.assignedPositionSelected()) {
                        globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                            return positions.setPositionStatusToPrepared($scope.positionsAssignedSelected[0].id);
                        });
                    }
                },
                isActive: function () {
                    return $scope.assignedPositionSelected();
                }
            },
            {
                label: 'SALES_MGMT.REJECT',
                onClick: function () {
                    if ($scope.assignedPositionSelected()) {
                        globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                            return positions.makePositionAvailable($scope.positionsAssignedSelected[0].id);
                        });
                    }
                },
                isActive: function () {
                    return $scope.assignedPositionSelected();
                }
            }
        ];*/
    });
