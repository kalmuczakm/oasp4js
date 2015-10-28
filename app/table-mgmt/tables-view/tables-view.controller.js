angular.module('app.table-mgmt')
    .controller('TablesViewCntl', function ($scope, tables, paginatedTableList, $state, globalSpinner) {
        'use strict';
        var selectedTable = function () {
            return $scope.selectedItems && $scope.selectedItems.length ? $scope.selectedItems[0] : undefined;
        };

        $scope.openEditDialog = function (table) {
            $state.go('tableMgmt.details', {tableId: table.id});
        };

        $scope.selectedItems = [];
        $scope.maxSize = 5;
        $scope.totalItems = paginatedTableList.pagination.total;
        $scope.numPerPage = paginatedTableList.pagination.size;
        $scope.currentPage = paginatedTableList.pagination.page;

        $scope.gridOptions = {
            data: paginatedTableList.result
        };

        $scope.reloadTables = function () {
            tables.getPaginatedTables($scope.currentPage, $scope.numPerPage).then(function (paginatedTables) {
                return paginatedTables;
            }).then(function (res) {
                paginatedTableList = res;
                $scope.gridOptions.data = paginatedTableList.result;
            });
        };

        $scope.tableFilter = {
            free: true,
            reserved: true,
            occupied: true
        };

        $scope.toggleFilter = function (kind) {
            if(kind === 'all') {
                angular.forEach($scope.tableFilter, function(bool, attr) {
                    $scope.tableFilter[attr] = true;
                })
            } else {
                $scope.tableFilter[kind] = !$scope.tableFilter[kind];
            }
        };

        $scope.showTable = function (table) {
            return $scope.tableFilter[table.state.toLowerCase()] === true;
        };

        $scope.$watch('currentPage', function () {
            $scope.reloadTables();
        });

        $scope.reserve = function (table) {
            tables.reserve(table);
        };

        $scope.release = function (table) {
              tables.free(table);
        };

        $scope.occupy = function (table) {
            tables.occupy(table);
        };

        $scope.buttonDefs = [
            {
                label: 'TABLE_MGMT.EDIT',
                onClick: function () {
                    $scope.openEditDialog(selectedTable());
                },
                isActive: function () {
                    return selectedTable();
                }
            },
            {
                label: 'TABLE_MGMT.RESERVE',
                onClick: function () {
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        return tables.reserve(selectedTable()).then($scope.reloadTables);
                    });
                },
                isActive: function () {
                    return selectedTable() && selectedTable().state === 'FREE';
                }
            },
            {
                label: 'TABLE_MGMT.CANCEL_RESERVATION',
                onClick: function () {
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        return tables.cancelReservation(selectedTable()).then($scope.reloadTables);
                    });
                },
                isActive: function () {
                    return selectedTable() && selectedTable().state === 'RESERVED';
                }
            },
            {
                label: 'TABLE_MGMT.OCCUPY',
                onClick: function () {
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        return tables.occupy(selectedTable()).then($scope.reloadTables);
                    });
                },
                isActive: function () {
                    return selectedTable() && (selectedTable().state === 'RESERVED' || selectedTable().state === 'FREE');
                }
            },
            {
                label: 'TABLE_MGMT.FREE',
                onClick: function () {
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        return tables.free(selectedTable()).then($scope.reloadTables);
                    });
                },
                isActive: function () {
                    return selectedTable() && selectedTable().state === 'OCCUPIED';
                }
            }
        ];


    });
