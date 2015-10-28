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

                //paginatedTableList.result = filterTables(res.result);
                $scope.gridOptions.data = paginatedTableList.result;
            });
        };

        /*function filterTables(tables) {
            var filteredTables = [];
            angular.forEach(tables, function(table) {
                $scope.statusFilter(table) ? filteredTables.push(table) : '';
            });
            return filteredTables;
        }*/

        function multiplyPaginatedTableBy (table, times) {
            var multipliedTable = table;
            for(var i=1; i<times; i++) {
                multipliedTable.result = table.result.concat(angular.copy(table.result));
            }
            multipliedTable.pagination.total *= times;
            return multipliedTable;
        }

        $scope.tableStatus = {
            free: true,
            reserved: true,
            occupied: true
        };

        $scope.toggleFilter = function (kind) {
            if(kind === 'all') {
                angular.forEach($scope.tableStatus, function(bool, attr) {
                    $scope.tableStatus[attr] = true;
                })
            } else {
                $scope.tableStatus[kind] = !$scope.tableStatus[kind];
            }
            $scope.reloadTables();
        };

        $scope.statusFilter = function (table) {
            return $scope.tableStatus[table.state.toLowerCase()] === true;
        };

        $scope.$watch('currentPage', function () {
            $scope.reloadTables();
        });

        $scope.reserve = function (table) {
            globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                return tables.reserve(table).then($scope.reloadTables);
            })
        };

        $scope.release = function (table) {
            globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                return tables.free(table).then($scope.reloadTables);
            });
        };

        $scope.occupy = function (table) {
            globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                return tables.occupy(table).then($scope.reloadTables);
            });
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
